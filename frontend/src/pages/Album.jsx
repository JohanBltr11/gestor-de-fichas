import { useState, useEffect, useContext, useCallback } from "react";
import { CollectionContext } from "../context/CollectionContext";
import StickerCard from "../components/StickerCard";
import "../styles/Album.css";

const SECTIONS = [
  { id: "all",        label: "Todo",      short: "TODO" },
  { id: "especiales", label: "Especiales",short: "FWC"  },
  { id: "grupo-a",    label: "Grupo A",   short: "A",   teams: "México · Sudáfrica · Corea del Sur · Rep. Checa" },
  { id: "grupo-b",    label: "Grupo B",   short: "B",   teams: "Canadá · Bosnia · Catar · Suiza" },
  { id: "grupo-c",    label: "Grupo C",   short: "C",   teams: "Brasil · Marruecos · Haití · Escocia" },
  { id: "grupo-d",    label: "Grupo D",   short: "D",   teams: "EE.UU. · Paraguay · Australia · Turquía" },
  { id: "grupo-e",    label: "Grupo E",   short: "E",   teams: "Alemania · Curazao · Costa de Marfil · Ecuador" },
  { id: "grupo-f",    label: "Grupo F",   short: "F",   teams: "Países Bajos · Japón · Suecia · Túnez" },
  { id: "grupo-g",    label: "Grupo G",   short: "G",   teams: "Bélgica · Egipto · Irán · Nueva Zelanda" },
  { id: "grupo-h",    label: "Grupo H",   short: "H",   teams: "España · Cabo Verde · Arabia Saudita · Uruguay" },
  { id: "grupo-i",    label: "Grupo I",   short: "I",   teams: "Francia · Senegal · Irak · Noruega" },
  { id: "grupo-j",    label: "Grupo J",   short: "J",   teams: "Argentina · Argelia · Austria · Jordania" },
  { id: "grupo-k",    label: "Grupo K",   short: "K",   teams: "Portugal · RD Congo · Uzbekistán · Colombia" },
  { id: "grupo-l",    label: "Grupo L",   short: "L",   teams: "Inglaterra · Croacia · Ghana · Panamá" },
];

const VIEW_FILTERS = [
  { id: "all",      label: "Todas"    },
  { id: "owned",    label: "Tengo"    },
  { id: "missing",  label: "Me faltan"},
  { id: "repeated", label: "Repetidas"},
];

export default function Album() {
  const { stickers, toggleSticker } = useContext(CollectionContext);

  const [activeSection, setActiveSection] = useState("all");
  const [viewFilter,    setViewFilter]    = useState("all");
  const [search,        setSearch]        = useState("");

  /* Atajo / para enfocar búsqueda */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "/") { e.preventDefault(); document.getElementById("srch")?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Filtrado */
  const displayed = useCallback(() => {
    let r = stickers;
    if (activeSection !== "all") r = r.filter(s => s.section === activeSection);
    if (viewFilter === "owned")    r = r.filter(s => s.owned);
    if (viewFilter === "missing")  r = r.filter(s => !s.owned);
    if (viewFilter === "repeated") r = r.filter(s => s.repeated_count > 0);
    if (search.trim()) {
      const q = search.toLowerCase();

      r = r.filter((s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.number?.toString() || "").includes(q) ||
        (s.section || "").toLowerCase().includes(q)
      );
    }
    return r;
  }, [stickers, activeSection, viewFilter, search]);

  /* Stats */
  const total    = stickers.length;
  const owned    = stickers.filter(s => s.owned).length;
  const pct      = total > 0 ? Math.round((owned / total) * 100) : 0;
  const missing  = total - owned;
  const repeated = stickers.reduce((a, s) => a + s.repeated_count, 0);

  const shown = displayed();

  return (
    <div className="album-root">

      {/* ── HEADER ── */}
      <header className="album-header">
        <div className="album-header-inner">
          <div className="album-brand">
            <span className="album-brand-line">FIFA WORLD CUP</span>
            <span className="album-brand-year">2026</span>
          </div>
          <div className="album-brand-sub">Mi álbum de figuritas</div>
        </div>

        {/* Barra de progreso pegada al bottom del header */}
        <div className="album-progress-bar">
          <div className="album-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </header>

      {/* ── STATS ── */}
      <div className="album-stats-row">
        <div className="stat-chip stat-chip--owned">
          <span className="stat-num">{owned}</span>
          <span className="stat-lbl">tengo</span>
        </div>
        <div className="stat-chip stat-chip--missing">
          <span className="stat-num">{missing}</span>
          <span className="stat-lbl">me faltan</span>
        </div>
        <div className="stat-chip stat-chip--repeated">
          <span className="stat-num">{repeated}</span>
          <span className="stat-lbl">repetidas</span>
        </div>
        <div className="stat-chip stat-chip--pct">
          <span className="stat-num">{pct}%</span>
          <span className="stat-lbl">completo</span>
        </div>
      </div>

      {/* ── BÚSQUEDA ── */}
      <div className="album-search-wrap">
        <span className="search-icon">⌕</span>
        <input
          id="srch"
          type="search"
          className="album-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar jugador, código o país…"
          autoComplete="off"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* ── FILTROS ESTADO ── */}
      <div className="album-view-filters">
        {VIEW_FILTERS.map(f => (
          <button
            key={f.id}
            className={`vf-btn ${viewFilter === f.id ? "vf-btn--active" : ""}`}
            onClick={() => setViewFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── SECCIONES ── */}
      <div className="album-sections-wrap">
        <div className="album-sections">
          {SECTIONS.map(sec => {
            const secStickers = sec.id === "all"
              ? stickers
              : stickers.filter(s => s.section === sec.id);
            const secOwned = secStickers.filter(s => s.owned).length;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                className={`sec-btn ${active ? "sec-btn--active" : ""}`}
                onClick={() => setActiveSection(sec.id)}
              >
                <span className="sec-short">{sec.short}</span>
                <span className="sec-progress">{secOwned}/{secStickers.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRID ── */}
      <main className="album-main">
        {shown.length === 0 ? (
          <div className="album-empty">
            <p className="empty-icon">◻</p>
            <p>Sin resultados</p>
            <button
              className="empty-reset"
              onClick={() => { setSearch(""); setViewFilter("all"); }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="album-grid">
            {shown.map(sticker => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── INSTRUCCIONES FLOTANTES (solo móvil, desaparece tras 4s) ── */}
      <HintToast />
    </div>
  );
}

/* Toast de ayuda que aparece una sola vez */
function HintToast() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="hint-toast">
      <span>Toca para marcar · Toca de nuevo para repetida · Mantén para quitar</span>
      <button onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}