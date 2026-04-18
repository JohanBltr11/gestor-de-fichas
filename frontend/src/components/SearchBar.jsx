/* SearchBar.jsx */

import { useState } from "react";

export function SearchBar({ id, value, onChange, placeholder }) {
  return (
    <input
      id={id}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1, minWidth: 200,
        background: "#0f1220",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 8,
        color: "#dde2ed",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        padding: "9px 14px",
        outline: "none",
      }}
      onFocus={e => e.target.style.borderColor = "#f5c518"}
      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
    />
  );
}

/* QuickEntry.jsx — panel "abrir sobre" */
export function QuickEntry({ onClose, onToggle, stickers }) {
  const [input, setInput] = useState("");
  const [log,   setLog]   = useState([]);

  const handleKey = (e) => {
    if (e.key !== "Enter") return;
    const num = parseInt(input.trim(), 10);
    const found = stickers.find(s => s.number === num);
    if (found) {
      onToggle(found.id);
      setLog(prev => [{ number: num, name: found.name, ok: true }, ...prev.slice(0, 9)]);
    } else {
      setLog(prev => [{ number: num, name: "No encontrada", ok: false }, ...prev.slice(0, 9)]);
    }
    setInput("");
  };

  return (
    <div style={{
      background: "#0f1220",
      border: "1px solid rgba(245,197,24,.2)",
      borderRadius: 10,
      maxWidth: 1200, margin: "12px auto 0",
      padding: "16px 24px",
      display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#f5c518", letterSpacing: ".06em", textTransform: "uppercase" }}>
          ⚡ Abrir sobre — ingresa números
        </span>
        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Número y Enter..."
          autoFocus
          style={{
            background: "#131828", border: "1px solid rgba(245,197,24,.3)",
            borderRadius: 8, color: "#f0f4ff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700,
            padding: "10px 16px", width: 200, outline: "none",
          }}
        />
        <span style={{ fontSize: 11, color: "#525a70" }}>Presiona Enter para marcar · Q para cerrar</span>
      </div>
      <div style={{ flex: 1 }}>
        {log.map((entry, i) => (
          <div key={i} style={{
            fontSize: 12, color: entry.ok ? "#3ecf8e" : "#ff5c5c",
            padding: "3px 0",
          }}>
            {entry.ok ? "✓" : "✗"} #{entry.number} — {entry.name}
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{
        background: "none", border: "none", color: "#525a70",
        cursor: "pointer", fontSize: 18, padding: 4,
      }}>✕</button>
    </div>
  );
}

export default SearchBar;