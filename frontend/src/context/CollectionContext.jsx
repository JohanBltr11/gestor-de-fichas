import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CollectionContext = createContext(null);

// ─────────────────────────────────────────────
// HELPER: genera fichas por equipo (20 c/u)
// ─────────────────────────────────────────────
const makeTeam = (startNum, teamName, section) => {
  const stickers = [];

  // Escudo
  stickers.push({
    id: startNum,
    number: startNum,
    name: `Escudo ${teamName}`,
    section,
    type: "escudo",
    owned: false,
    repeated_count: 0,
  });

  // Foto equipo
  stickers.push({
    id: startNum + 1,
    number: startNum + 1,
    name: `Equipo ${teamName}`,
    section,
    type: "equipo",
    owned: false,
    repeated_count: 0,
  });

  // 18 jugadores
  for (let i = 0; i < 18; i++) {
    stickers.push({
      id: startNum + 2 + i,
      number: startNum + 2 + i,
      name: `${teamName} Jugador ${i + 1}`,
      section,
      type: "jugador",
      owned: false,
      repeated_count: 0,
    });
  }

  return stickers;
};

// ─────────────────────────────────────────────
// EQUIPOS QATAR 2022 (32 selecciones)
// ─────────────────────────────────────────────
const EQUIPOS_2022 = [
  // Grupo A
  { name: "Qatar", section: "grupo-a" },
  { name: "Ecuador", section: "grupo-a" },
  { name: "Senegal", section: "grupo-a" },
  { name: "Países Bajos", section: "grupo-a" },

  // Grupo B
  { name: "Inglaterra", section: "grupo-b" },
  { name: "Irán", section: "grupo-b" },
  { name: "Estados Unidos", section: "grupo-b" },
  { name: "Gales", section: "grupo-b" },

  // Grupo C
  { name: "Argentina", section: "grupo-c" },
  { name: "Arabia Saudita", section: "grupo-c" },
  { name: "México", section: "grupo-c" },
  { name: "Polonia", section: "grupo-c" },

  // Grupo D
  { name: "Francia", section: "grupo-d" },
  { name: "Australia", section: "grupo-d" },
  { name: "Dinamarca", section: "grupo-d" },
  { name: "Túnez", section: "grupo-d" },

  // Grupo E
  { name: "España", section: "grupo-e" },
  { name: "Costa Rica", section: "grupo-e" },
  { name: "Alemania", section: "grupo-e" },
  { name: "Japón", section: "grupo-e" },

  // Grupo F
  { name: "Bélgica", section: "grupo-f" },
  { name: "Canadá", section: "grupo-f" },
  { name: "Marruecos", section: "grupo-f" },
  { name: "Croacia", section: "grupo-f" },

  // Grupo G
  { name: "Brasil", section: "grupo-g" },
  { name: "Serbia", section: "grupo-g" },
  { name: "Suiza", section: "grupo-g" },
  { name: "Camerún", section: "grupo-g" },

  // Grupo H
  { name: "Portugal", section: "grupo-h" },
  { name: "Ghana", section: "grupo-h" },
  { name: "Uruguay", section: "grupo-h" },
  { name: "Corea del Sur", section: "grupo-h" },
];

// ─────────────────────────────────────────────
// GENERAR FICHAS DE EQUIPOS
// ─────────────────────────────────────────────
let currentNum = 1;
const teamStickers = [];

EQUIPOS_2022.forEach((eq) => {
  const fichas = makeTeam(currentNum, eq.name, eq.section);
  teamStickers.push(...fichas);
  currentNum += 20;
});

// ─────────────────────────────────────────────
// ESTADIOS (QATAR 2022)
// ─────────────────────────────────────────────
const ESTADIOS_2022 = [
  "Lusail Stadium",
  "Al Bayt Stadium",
  "974 Stadium",
  "Al Thumama Stadium",
  "Education City Stadium",
  "Ahmad Bin Ali Stadium",
  "Khalifa International Stadium",
  "Al Janoub Stadium",
];

const estadioStickers = ESTADIOS_2022.map((nombre, i) => ({
  id: currentNum + i,
  number: currentNum + i,
  name: nombre,
  section: "estadios",
  type: "estadio",
  owned: false,
  repeated_count: 0,
}));

currentNum += ESTADIOS_2022.length;

// ─────────────────────────────────────────────
// ESPECIALES
// ─────────────────────────────────────────────
const ESPECIALES = [
  "Trofeo Copa del Mundo",
  "Balón oficial Al Rihla",
  "Logo oficial FIFA 2022",
  "Mascota La'eeb",
];

const especialesStickers = ESPECIALES.map((nombre, i) => ({
  id: currentNum + i,
  number: currentNum + i,
  name: nombre,
  section: "especiales",
  type: "especial",
  owned: false,
  repeated_count: 0,
}));

// ─────────────────────────────────────────────
// COLECCIÓN COMPLETA
// ─────────────────────────────────────────────
const ALL_STICKERS = [
  ...teamStickers,
  ...estadioStickers,
  ...especialesStickers,
];

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────
export function CollectionProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [stickers, setStickers] = useState(ALL_STICKERS);
  const loading = false;

  // Marcar como obtenida
  const toggleSticker = (stickerId) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.id === stickerId ? { ...s, owned: !s.owned } : s
      )
    );
  };

  // Manejar repetidas
  const setRepeated = (stickerId, delta) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.id === stickerId
          ? {
              ...s,
              repeated_count: Math.max(
                0,
                (s.repeated_count || 0) + delta
              ),
            }
          : s
      )
    );
  };

  return (
    <CollectionContext.Provider
      value={{ stickers, loading, toggleSticker, setRepeated }}
    >
      {children}
    </CollectionContext.Provider>
  );
}
