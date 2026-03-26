import { Suspense, lazy, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { bands } from "@/data/bands";
import { getArtists } from "@/data/artists";
import type { Artist } from "@/data/artists";
import type { SortDir, SortKey } from "./artists/ArtistsTableView";

const ArtistsCardsView = lazy(() => import("./artists/ArtistsCardsView"));
const ArtistsTableView = lazy(() => import("./artists/ArtistsTableView"));

const normalize = (value: string) => value.trim().toLowerCase();

const getBandNameBySlug = (slug: string) => {
  return bands.find((b) => b.slug === slug)?.name ?? slug;
};

const buildSearchIndex = (artist: Artist) => {
  const bandNames = artist.bandSlugs.map(getBandNameBySlug).join(" ");
  return `${artist.name} ${artist.genre} ${bandNames}`.toLowerCase();
};

const sortArtists = (list: Artist[], sortKey: SortKey, sortDir: SortDir) => {
  const dir = sortDir === "asc" ? 1 : -1;
  const copy = [...list];

  copy.sort((a, b) => {
    const aBands = a.bandSlugs.map(getBandNameBySlug).join(" ");
    const bBands = b.bandSlugs.map(getBandNameBySlug).join(" ");

    const aVal =
      sortKey === "name"
        ? a.name
        : sortKey === "genre"
          ? a.genre
          : sortKey === "bands"
            ? aBands
            : sortKey === "debutYear"
              ? a.debutYear
              : a.active ? 1 : 0;

    const bVal =
      sortKey === "name"
        ? b.name
        : sortKey === "genre"
          ? b.genre
          : sortKey === "bands"
            ? bBands
            : sortKey === "debutYear"
              ? b.debutYear
              : b.active ? 1 : 0;

    if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
    return String(aVal).localeCompare(String(bVal)) * dir;
  });

  return copy;
};

const clampPage = (page: number, totalPages: number) => Math.min(Math.max(page, 1), Math.max(totalPages, 1));

const ArtistsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"cards" | "table">("cards");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedBandSlugs, setSelectedBandSlugs] = useState<string[]>([]);
  const [isBandFilterOpen, setIsBandFilterOpen] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const defaultPageSize = view === "cards" ? 12 : 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q) return;
    setQuery(q);
    setSearchParams((p) => {
      const next = new URLSearchParams(p);
      next.delete("q");
      return next;
    });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setPageSize(defaultPageSize);
  }, [defaultPageSize]);

  const bandOptions = useMemo(() => {
    return [...bands].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery);
    const selected = new Set(selectedBandSlugs);
    return getArtists().filter((artist) => {
      const matchesBands = selected.size === 0 ? true : artist.bandSlugs.some((slug) => selected.has(slug));
      if (!matchesBands) return false;
      if (!q) return true;
      return buildSearchIndex(artist).includes(q);
    });
  }, [deferredQuery, selectedBandSlugs]);

  const sorted = useMemo(() => sortArtists(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = clampPage(page, totalPages);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    setPage(1);
  }, [deferredQuery, selectedBandSlugs, pageSize, view]);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [pageSize, safePage, sorted]);

  const onToggleBand = (slug: string) => {
    setSelectedBandSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      return [...prev, slug];
    });
  };

  const onClearFilters = () => {
    setQuery("");
    setSelectedBandSlugs([]);
    setPage(1);
  };

  const onSortChange = (nextKey: SortKey) => {
    if (nextKey === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDir("asc");
  };

  const pageSizes = view === "cards" ? [12, 24, 48] : [10, 25, 50];

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-black md:text-6xl">ARTISTAS</h1>
              <p className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                Catálogo con búsqueda y filtros por proyectos
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                aria-pressed={view === "cards"}
                onClick={() => setView("cards")}
                className={`h-10 border border-black px-4 font-heading text-[10px] font-black tracking-[0.2em] ${
                  view === "cards" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                CARDS
              </button>
              <button
                type="button"
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
                className={`h-10 border border-black px-4 font-heading text-[10px] font-black tracking-[0.2em] ${
                  view === "table" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                TABLA
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar artistas"
                placeholder="BUSCAR POR ARTISTA / BANDA / GÉNERO"
                className="h-12 w-full rounded-none border border-black bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="button"
                onClick={() => setIsBandFilterOpen((v) => !v)}
                aria-expanded={isBandFilterOpen}
                className="h-12 w-full border border-black bg-white px-4 text-left font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
              >
                FILTRO BANDAS {selectedBandSlugs.length ? `(${selectedBandSlugs.length})` : ""}
              </button>
            </div>

            <div className="md:col-span-3 flex gap-3">
              <select
                aria-label="Tamaño de página"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-12 w-full border border-black bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black uppercase"
              >
                {pageSizes.map((s) => (
                  <option key={s} value={s}>
                    {s} / PÁGINA
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onClearFilters}
                className="h-12 shrink-0 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
              >
                LIMPIAR
              </button>
            </div>
          </div>

          <div
            className={`grid overflow-hidden transition-[max-height,opacity] duration-300 ${
              isBandFilterOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-4 border border-black bg-white p-4">
              <div className="flex flex-wrap gap-6">
                {bandOptions.map((b) => (
                  <label key={b.slug} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedBandSlugs.includes(b.slug)}
                      onChange={() => onToggleBand(b.slug)}
                      aria-label={`Filtrar por ${b.name}`}
                      className="h-4 w-4 accent-black"
                    />
                    <span className="font-body text-[10px] font-light tracking-[0.2em] text-black uppercase">
                      {b.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
              RESULTADOS: {sorted.length}
            </div>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <button
                type="button"
                onClick={() => setPage((p) => clampPage(p - 1, totalPages))}
                disabled={safePage <= 1}
                className="h-10 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black disabled:opacity-30"
              >
                ←
              </button>
              <div className="hidden items-center gap-2 md:flex">
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const pageNumber =
                    totalPages <= 7
                      ? i + 1
                      : safePage <= 4
                        ? i + 1
                        : safePage >= totalPages - 3
                          ? totalPages - 6 + i
                          : safePage - 3 + i;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-10 w-10 border border-black font-heading text-[10px] font-black tracking-[0.2em] ${
                        pageNumber === safePage ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <div className="font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60 md:hidden">
                {safePage} / {totalPages}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => clampPage(p + 1, totalPages))}
                disabled={safePage >= totalPages}
                className="h-10 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-10">
            <Suspense
              fallback={
                <div className="border border-black bg-white p-8 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                  CARGANDO…
                </div>
              }
            >
              {view === "cards" ? (
                <ArtistsCardsView items={paginated} />
              ) : (
                <ArtistsTableView items={paginated} sortKey={sortKey} sortDir={sortDir} onSortChange={onSortChange} />
              )}
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistsPage;
