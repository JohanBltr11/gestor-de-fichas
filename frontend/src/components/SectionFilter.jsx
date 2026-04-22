/* SectionFilter.jsx */
export default function SectionFilter({ sections, active, onSelect, stickers }) {
  return (
    <div style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "14px 24px 0",
      display: "flex", gap: 8, overflowX: "auto",
    }}>
      {sections.map((sec) => {
        const secStickers = sec.id === "all" ? stickers : stickers.filter(s => s.section === sec.id);
        const owned = secStickers.filter(s => s.owned).length;
        return (
          <button
            key={sec.id}
            onClick={() => onSelect(sec.id)}
            style={{
              background: active === sec.id ? "#f5c518" : "#0f1220",
              border: `1px solid ${active === sec.id ? "#f5c518" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 20,
              color: active === sec.id ? "#0a0a0a" : "#8892a4",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: active === sec.id ? 700 : 500,
              padding: "5px 14px",
              whiteSpace: "nowrap",
              transition: "all .15s",
            }}
          >
            {sec.emoji} {sec.label}
            {sec.id !== "all" && (
              <span style={{ marginLeft: 6, opacity: .7 }}>
                {owned}/{secStickers.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}