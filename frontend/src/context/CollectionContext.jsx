import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

// ─────────────────────────────────────────────────────────────────
// Importa la lista maestra de figuritas (datos estáticos del álbum)
// Esta es la misma lista que tenías en CollectionContext antes.
// La mantenemos aquí como fuente de verdad del catálogo.
// ─────────────────────────────────────────────────────────────────
import { ALL_STICKERS } from "../data/stickers";

export const CollectionContext = createContext(null);

export function CollectionProvider({ children }) {
  const { token } = useContext(AuthContext);

  // Estado local: copia del catálogo con owned/repeated_count
  const [stickers, setStickers] = useState(ALL_STICKERS);
  const [loading,  setLoading]  = useState(false);

  // ── Carga inicial: trae de la BD lo que el usuario tiene ──────────
  useEffect(() => {
    if (!token) {
      // Sin sesión → resetear todo a "no tengo"
      setStickers(ALL_STICKERS.map(s => ({ ...s, owned: false, repeated_count: 0 })));
      return;
    }

    setLoading(true);
    api.get("/stickers/collection")
      .then(({ data }) => {
        // data.stickers = [{ sticker_id: "ARG1", quantity: 2 }, ...]
        const ownedMap = {};
        data.stickers.forEach(({ sticker_id, quantity }) => {
          ownedMap[sticker_id] = quantity;
        });

        setStickers(
          ALL_STICKERS.map(s => {
            const qty = ownedMap[s.code] ?? 0;
            return {
              ...s,
              owned:          qty > 0,
              repeated_count: qty > 1 ? qty - 1 : 0,
            };
          })
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // ── Toggle: clic normal → marcar / sumar repetida ─────────────────
  // Lógica de quantity en BD:
  //   quantity = 1  → la tengo (sin repetidas)
  //   quantity = 2  → la tengo + 1 repetida
  //   quantity = 0  → no la tengo (se borra de la BD)
  const toggleSticker = useCallback(async (stickerId) => {
    setStickers(prev =>
      prev.map(s => {
        if (s.id !== stickerId) return s;
        if (!s.owned) return { ...s, owned: true,  repeated_count: 0 };
        return          { ...s, owned: true,  repeated_count: s.repeated_count + 1 };
      })
    );

    // Obtener el estado actualizado para enviarlo a la BD
    setStickers(prev => {
      const updated = prev.find(s => s.id === stickerId);
      if (!updated) return prev;

      const quantity = updated.owned ? updated.repeated_count + 1 : 1;

      api.post("/stickers/toggle", {
        sticker_id: updated.code,   // "ARG1", "FRA19", etc.
        quantity,
      }).catch(() => {
        // Si falla → revertir
        setStickers(p =>
          p.map(s => {
            if (s.id !== stickerId) return s;
            if (s.repeated_count > 0) return { ...s, repeated_count: s.repeated_count - 1 };
            return { ...s, owned: false, repeated_count: 0 };
          })
        );
      });

      return prev;
    });
  }, []);


    const decrementSticker = useCallback(async (stickerId) => {
    let previousState;

    // actualización optimista
    setStickers(prev => {
      return prev.map(s => {
        if (s.id !== stickerId) return s;

        previousState = s;

        // si tiene repetidas → quitar 1
        if (s.repeated_count > 0) {
          return {
            ...s,
            repeated_count: s.repeated_count - 1
          };
        }

        // si solo tiene 1 → dejar de tenerla
        if (s.owned) {
          return {
            ...s,
            owned: false,
            repeated_count: 0
          };
        }

        return s;
      });
    });

    try {
      const sticker = stickers.find(s => s.id === stickerId);
      if (!sticker) return;

      let quantity = 0;

      if (sticker.repeated_count > 0) {
        quantity = sticker.repeated_count; // ya restamos 1 arriba
      } else if (sticker.owned) {
        quantity = 0; // se elimina completamente
      }

      await api.post("/stickers/toggle", {
        sticker_id: sticker.code,
        quantity,
      });

    } catch {
      // revertir si falla
      setStickers(prev =>
        prev.map(s =>
          s.id === stickerId ? previousState : s
        )
      );
    }
  }, [stickers]);


  // ── Reset: mantener presionado → quitar completamente ─────────────
  const resetSticker = useCallback(async (stickerId) => {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;

    // Actualización optimista
    setStickers(prev =>
      prev.map(s =>
        s.id === stickerId ? { ...s, owned: false, repeated_count: 0 } : s
      )
    );

    // Enviar quantity=0 → la BD borra el registro
    try {
      await api.post("/stickers/toggle", {
        sticker_id: sticker.code,
        quantity:   0,
      });
    } catch {
      // Revertir si falla
      setStickers(prev =>
        prev.map(s =>
          s.id === stickerId
            ? { ...s, owned: sticker.owned, repeated_count: sticker.repeated_count }
            : s
        )
      );
    }
  }, [stickers]);

  return (
    <CollectionContext.Provider value={{ stickers, loading, toggleSticker, resetSticker, decrementSticker }}>
      {children}
    </CollectionContext.Provider>
  );
}