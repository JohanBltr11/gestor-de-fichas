import { useContext, useRef, useCallback } from "react";
import { CollectionContext } from "../context/CollectionContext";
import "../styles/StickerCard.css";

const HOLD_MS = 600;

export default function StickerCard({ sticker }) {
  const { toggleSticker, decrementSticker } = useContext(CollectionContext);
  const { id, code, name, owned, repeated_count, type } = sticker;

  const holdTimer = useRef(null);
  const didHold   = useRef(false);

  // Clic rápido → marcar / sumar repetida
  // Mantener 600ms → resetear a "no la tengo"
  const startHold = useCallback(() => {
    didHold.current = false;
    holdTimer.current = setTimeout(() => {
      didHold.current = true;

      decrementSticker(id); // 👈 aquí el cambio

      if (navigator.vibrate) navigator.vibrate(80);
    }, HOLD_MS);
  }, [id, decrementSticker]);


  const endHold = useCallback(() => {
    clearTimeout(holdTimer.current);
  }, []);

  const handleClick = useCallback(() => {
    if (didHold.current) return;
    toggleSticker(id);
  }, [id, toggleSticker]);

  const handleContextMenu = (e) => e.preventDefault();

  let stateClass = "sc--missing";
  if (owned && repeated_count === 0) stateClass = "sc--owned";
  if (owned && repeated_count >  0)  stateClass = "sc--repeated";

  const isGold = type === "especial" || type === "historico";

  let typeTag = null;
  if (type === "escudo")      typeTag = "ESC";
  if (type === "foto_equipo") typeTag = "FTO";
  if (type === "especial")    typeTag = "ESP";
  if (type === "historico")   typeTag = "HIS";
  if (type === "estadio")     typeTag = "EST";

  return (
    <button
      className={`sc ${stateClass}${isGold ? " sc--gold" : ""}`}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label={`${code} ${name}`}
    >
      {owned && repeated_count > 0 && (
        <span className="sc-badge">+{repeated_count}</span>
      )}
      {typeTag && <span className="sc-type">{typeTag}</span>}
      <span className="sc-code">{code}</span>
      <span className="sc-name">{name}</span>
      <span className="sc-dot" />
    </button>
  );
}