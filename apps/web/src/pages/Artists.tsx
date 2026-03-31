import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useArtists } from "@/lib/artistProfiles";

const ArtistsPage = () => {
  const location = useLocation();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const artists = useArtists({ q, page, pageSize });
  const debug = new URLSearchParams(location.search).get("debug") === "1";

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-black md:text-6xl">ARTISTAS</h1>
              <p className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                Perfiles públicos y portafolios
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                aria-label="Buscar artistas"
                placeholder="BUSCAR POR ARTISTA"
                className="h-12 w-full rounded-none border border-black bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-10">
            {artists.isError ? (
              <div className="border border-red-600 bg-red-50 p-8 font-body text-[10px] tracking-[0.2em] text-red-700 uppercase">
                Error al cargar artistas: {(artists.error as Error)?.message ?? "desconocido"}
              </div>
            ) : null}

            {artists.isLoading ? (
              <div className="border border-black bg-white p-8 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                CARGANDO…
              </div>
            ) : null}

            {artists.data && artists.data.length === 0 && !artists.isLoading ? (
              <div className="border border-black bg-white p-8 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                NO HAY ARTISTAS PUBLICADOS
              </div>
            ) : null}

            {artists.data && artists.data.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {artists.data.map((a) => (
                  <Link key={a.id} to={`/artistas/${a.slug}`} className="border border-black bg-white">
                    <div className="aspect-[4/3] w-full overflow-hidden border-b border-black bg-black">
                      <img
                        src={a.profile_image_url ?? "/placeholder.svg"}
                        alt={a.stage_name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="font-heading text-xl font-black tracking-tight text-black">{a.stage_name}</div>
                      <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
                        {a.genre ?? ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}

          {debug && artists.data?.length ? (
            <div className="mt-10 border border-black bg-white p-4">
              <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
                Debug: artistas en esta página
              </div>
              <pre className="mt-3 overflow-auto text-xs text-black">{JSON.stringify(artists.data, null, 2)}</pre>
            </div>
          ) : null}

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/10 pt-8">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-10 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors disabled:opacity-40"
              >
                ANTERIOR
              </button>
              <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">PÁGINA {page}</div>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={(artists.data?.length ?? 0) < pageSize}
                className="h-10 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors disabled:opacity-40"
              >
                SIGUIENTE
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistsPage;
