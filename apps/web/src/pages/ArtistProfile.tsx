import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useArtistBySlug, useArtistWorks } from "@/lib/artistProfiles";

const ArtistsProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const artistQuery = useArtistBySlug(slug);
  const worksQuery = useArtistWorks(artistQuery.data?.id);
  const artist = artistQuery.data;

  if (artistQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navigation />
        <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center">
          <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase">CARGANDO…</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navigation />
        <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-black tracking-tighter text-black">ARTISTA NO ENCONTRADO</h1>
          <Link to="/artistas" className="mt-6 inline-block border border-black px-6 py-3 font-heading text-[10px] font-black tracking-[0.2em] text-black">
            VOLVER A ARTISTAS
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="border border-black bg-white">
                <div className="aspect-square overflow-hidden bg-black">
                  <img
                    src={artist.profile_image_url ?? "/placeholder.svg"}
                    alt={artist.stage_name}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="border-t border-black p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="font-heading text-3xl font-black tracking-tighter text-black md:text-5xl">{artist.stage_name}</h1>
                  </div>

                  <div className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-70">
                    {artist.genre ?? ""}
                  </div>

                  {artist.website ? (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 flex h-11 items-center justify-center border border-black bg-black px-4 font-heading text-[10px] font-black tracking-[0.2em] text-white hover:opacity-80"
                    >
                      WEBSITE
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-black bg-white p-8">
                <h2 className="font-heading text-xl font-black tracking-tight text-black">BIO</h2>
                <p className="mt-6 font-body text-sm font-light leading-relaxed tracking-widest text-black uppercase">
                  {artist.bio ?? ""}
                </p>

                {worksQuery.data?.length ? (
                  <div className="mt-10 border-t border-black pt-10">
                    <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">OBRAS</div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {(worksQuery.data ?? []).map((w) => (
                        <div key={w.id} className="border border-black overflow-hidden bg-black">
                          <img src={w.image_url} alt={w.title} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistsProfile;
