/* StickerCard.jsx */
export default function StickerCard({ sticker, onToggle }) {
  const { number, name, owned, repeated_count } = sticker;
  return (
    <button
      onClick={onToggle}
      title={`${number} — ${name}`}
      style={{
        background: owned ? "#1a3a22" : "#0f1220",
        border: `1px solid ${owned ? "#3ecf8e44" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 8,
        cursor: "pointer",
        padding: "8px 4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        transition: "all .15s",
        position: "relative",
      }}
    >
      {repeated_count > 0 && (
        <span style={{
          position: "absolute", top: 4, right: 4,
          background: "#e8440a", color: "#fff",
          fontSize: 9, fontWeight: 700,
          borderRadius: 20, padding: "1px 5px",
        }}>
          +{repeated_count}
        </span>
      )}
      <span style={{ fontSize: 11, fontWeight: 700, color: owned ? "#3ecf8e" : "#525a70" }}>
        #{number}
      </span>
      <span style={{ fontSize: 9, color: "#8892a4", textAlign: "center", lineHeight: 1.3 }}>
        {name}
      </span>
    </button>
  );
}