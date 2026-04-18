import { useState, useEffect, useContext, useCallback } from "react";
import { CollectionContext } from "../context/CollectionContext";
import StickerCard from "../components/StickerCard";
import SectionFilter from "../components/SectionFilter";
import SearchBar from "../components/SearchBar";
import { QuickEntry } from "../components/SearchBar";
import "../styles/Album.css";

/* Secciones del álbum Panini 2026 */
const SECTIONS = [
  { id: "all",        label: "Todos",         emoji: "🌍" },
  { id: "especiales", label: "Especiales",     emoji: "⭐" },
  { id: "estadios",   label: "Estadios",       emoji: "🏟️" },
  { id: "ciudades",   label: "Ciudades sede",  emoji: "🏙️" },
  { id: "grupo-a",    label: "Grupo A",        emoji: "🅰️" },
  { id: "grupo-b",    label: "Grupo B",        emoji: "🅱️" },
  { id: "grupo-c",    label: "Grupo C",        emoji: "🇨" },
  { id: "grupo-d",    label: "Grupo D",        emoji: "🇩" },
  { id: "grupo-e",    label: "Grupo E",        emoji: "🇪" },
  { id: "grupo-f",    label: "Grupo F",        emoji: "🇫" },
];

const VIEW_FILTERS = [
  { id: "all",      label: "Todas" },
  { id: "owned",    label: "Tengo" },
  { id: "missing",  label: "Me faltan" },
  { id: "repeated", label: "Repetidas" },
];

export default function Album() {
  const { stickers, loading, toggleSticker } = useContext(CollectionContext);

  const [activeSection, setActiveSection] = useState("all");
  const [viewFilter, setViewFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showQuickEntry, setShowQuickEntry] = useState(false);

  /* Atajo de teclado: "/" abre búsqueda, "q" abre entrada rápida */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "/") { e.preventDefault(); document.getElementById("album-search")?.focus(); }
      if (e.key === "q") setShowQuickEntry((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Filtrado combinado */
  const filtered = useCallback(() => {
    let result = stickers;

    if (activeSection !== "all")
      result = result.filter((s) => s.section === activeSection);

    if (viewFilter === "owned")    result = result.filter((s) => s.owned);
    if (viewFilter === "missing")  result = result.filter((s) => !s.owned);
    if (viewFilter === "repeated") result = result.filter((s) => s.repeated_count > 0);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          String(s.number).includes(q) ||
          s.country?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [stickers, activeSection, viewFilter, search]);

  /* Progreso general */
  const total   = stickers.length;
  const owned   = stickers.filter((s) => s.owned).length;
  const pct     = total > 0 ? Math.round((owned / total) * 100) : 0;
  const missing = total - owned;
  const repeated = stickers.reduce((acc, s) => acc + (s.repeated_count || 0), 0);

  const displayStickers = filtered();

  return (
    <div className="album-root">
      {/* ── Encabezado con progreso ── */}
      <header className="album-header">
        <div className="album-header-inner">
          <div className="album-title-row">
            <h1 className="album-title">Mi álbum <span className="album-year">2026</span></h1>
            <button
              className="btn-quick-entry"
              onClick={() => setShowQuickEntry((v) => !v)}
              title="Entrada rápida (Q)"
            >
              ⚡ Abrir sobre
            </button>
          </div>

          {/* Progreso general */}
          <div className="album-progress-wrap">
            <div className="album-stats">
              <span className="stat"><strong>{owned}</strong> tengo</span>
              <span className="stat"><strong>{missing}</strong> me faltan</span>
              <span className="stat"><strong>{repeated}</strong> repetidas</span>
              <span className="stat stat--pct"><strong>{pct}%</strong></span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${pct}%` }}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Panel entrada rápida ── */}
      {showQuickEntry && (
        <QuickEntry
          onClose={() => setShowQuickEntry(false)}
          onToggle={toggleSticker}
          stickers={stickers}
        />
      )}

      {/* ── Controles ── */}
      <div className="album-controls">
        <SearchBar
          id="album-search"
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre, número o país... ( / )"
        />

        {/* Filtro rápido de estado */}
        <div className="view-filters">
          {VIEW_FILTERS.map((f) => (
            <button
              key={f.id}
              className={`view-filter-btn ${viewFilter === f.id ? "active" : ""}`}
              onClick={() => setViewFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filtro de secciones ── */}
      <SectionFilter
        sections={SECTIONS}
        active={activeSection}
        onSelect={setActiveSection}
        stickers={stickers}
      />

      {/* ── Grid de figuritas ── */}
      <main className="album-grid-wrap">
        {loading ? (
          <div className="album-loading">
            <div className="loading-spinner" />
            <p>Cargando tu álbum...</p>
          </div>
        ) : displayStickers.length === 0 ? (
          <div className="album-empty">
            <span className="album-empty-icon">🔍</span>
            <p>No hay figuritas con ese filtro.</p>
            <button className="btn-secondary" onClick={() => { setSearch(""); setViewFilter("all"); }}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="album-grid">
            {displayStickers.map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                onToggle={() => toggleSticker(sticker.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}