import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsSidebar from "@/components/NewsSidebar";
import { getNews, type NewsPost } from "@/data/news";

const normalize = (s: string) => s.trim().toLowerCase();

const indexFor = (p: NewsPost) =>
  `${p.title} ${p.excerpt} ${p.content} ${p.tags.join(" ")} ${p.author}`.toLowerCase();

const clampPage = (page: number, totalPages: number) => Math.min(Math.max(page, 1), Math.max(totalPages, 1));

const NewsIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const all = useMemo(() => getNews(), []);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [fromISO, setFromISO] = useState("");
  const [toISO, setToISO] = useState("");

  const pageSize = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get("q");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (q) setQuery(q);
    if (from) setFromISO(from);
    if (to) setToISO(to);
    if (q || from || to) {
      setSearchParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("q");
        next.delete("from");
        next.delete("to");
        return next;
      });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery);
    return all.filter((p) => {
      if (fromISO && p.dateISO < fromISO) return false;
      if (toISO && p.dateISO > toISO) return false;
      if (!q) return true;
      return indexFor(p).includes(q);
    });
  }, [all, deferredQuery, fromISO, toISO]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = clampPage(page, totalPages);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  useEffect(() => {
    setPage(1);
  }, [deferredQuery, fromISO, toISO]);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const clearFilters = () => {
    setQuery("");
    setFromISO("");
    setToISO("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-black md:text-6xl">NOTICIAS</h1>
              <p className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                Últimas publicaciones, actualizaciones de eventos y anuncios
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="h-10 border border-black px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
              >
                LIMPIAR
              </button>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-6">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Buscar noticias"
                    placeholder="BUSCAR POR TEXTO / TAGS / AUTOR"
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40"
                  />
                </div>
                <div className="md:col-span-3">
                  <input
                    type="date"
                    value={fromISO}
                    onChange={(e) => setFromISO(e.target.value)}
                    aria-label="Desde fecha"
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                  />
                </div>
                <div className="md:col-span-3">
                  <input
                    type="date"
                    value={toISO}
                    onChange={(e) => setToISO(e.target.value)}
                    aria-label="Hasta fecha"
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                  />
                </div>
              </div>

              <div className="mt-6 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                RESULTADOS: {filtered.length}
              </div>

              <div className="mt-6 space-y-6">
                {paginated.map((p) => (
                  <article key={p.slug} className="border border-black p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-heading text-xl font-black tracking-tight text-black">
                        <Link to={`/noticias/${p.slug}`} className="hover:opacity-60">{p.title}</Link>
                      </h2>
                      <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">{p.dateISO}</div>
                    </div>
                    <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">Por {p.author}</div>
                    <p className="mt-4 font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">
                      {p.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Link key={t} to={`/noticias?q=${encodeURIComponent(t)}`} className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white">
                          {t}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
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
            <div className="md:col-span-4">
              <NewsSidebar />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsIndex;

