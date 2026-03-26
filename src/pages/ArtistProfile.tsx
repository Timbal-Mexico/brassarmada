import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { bands } from "@/data/bands";
import { getArtistBySlug } from "@/data/artists";
import type { Artist } from "@/data/artists";
import AvailabilityCalendar from "@/pages/artists/AvailabilityCalendar";

const levelLabel = (level: 1 | 2 | 3 | 4 | 5) => {
  if (level === 1) return "BÁSICO";
  if (level === 2) return "INTERMEDIO";
  if (level === 3) return "AVANZADO";
  if (level === 4) return "PRO";
  return "EXPERTO";
};

const getBandName = (slug: string) => bands.find((b) => b.slug === slug)?.name ?? slug;

const STATS_KEY = "brassarmada_artist_stats_v1";

const bumpStat = (slug: string, key: "views" | "hireClicks") => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, { views?: number; hireClicks?: number }>) : {};
    const current = parsed[slug] ?? {};
    parsed[slug] = { ...current, [key]: (current[key] ?? 0) + 1 };
    window.localStorage.setItem(STATS_KEY, JSON.stringify(parsed));
  } catch {
    return;
  }
};

const ArtistsProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  const artist = useMemo(() => (slug ? getArtistBySlug(slug) : undefined), [slug]);

  useEffect(() => {
    if (!artist) return;
    bumpStat(artist.slug, "views");
    document.title = `${artist.name} — Artista`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", artist.bio);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `${artist.name} — Artista`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", artist.bio);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", artist.image);
  }, [artist]);

  useEffect(() => {
    if (!artist) return;
    const q = searchParams.get("contratar");
    if (q === "1") {
      setShowModal(true);
      setSearchParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("contratar");
        return next;
      });
    }
  }, [artist, searchParams, setSearchParams]);

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

  const defaultBandForForm = artist.bandSlugs[0] ?? "";
  const bandOptions = artist.bandSlugs.map((s) => ({ slug: s, name: getBandName(s) }));
  const contactPhone = artist.contact?.phone;
  const contactEmail = artist.contact?.email;
  const whatsappUrl = contactPhone
    ? `https://wa.me/52${contactPhone}?text=${encodeURIComponent(
        `Hola, me interesa contratar a ${artist.name}. ¿Podrían darme información?`,
      )}`
    : "";

  const timeline = [...artist.timeline].sort((a, b) => a.year - b.year);

  const statusBadge =
    artist.availabilityStatus === "reservado"
      ? "bg-black text-white"
      : artist.availabilityStatus === "pendiente"
        ? "bg-white text-black"
        : "bg-white text-black";

  const statusLabel = artist.availabilityStatus.toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="border border-black bg-white">
                <div className="aspect-square overflow-hidden bg-black">
                  <img src={artist.image} alt={artist.name} className="h-full w-full object-cover grayscale" loading="eager" />
                </div>
                <div className="border-t border-black p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="font-heading text-3xl font-black tracking-tighter text-black md:text-5xl">{artist.name}</h1>
                    <span className={`border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] uppercase ${statusBadge}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-70">
                    {artist.genre} · DEBUT {artist.debutYear}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {artist.bandSlugs.map((s) => (
                      <Link
                        key={s}
                        to={`/bandas/${s}`}
                        className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white transition-colors"
                      >
                        {getBandName(s)}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        bumpStat(artist.slug, "hireClicks");
                        setShowModal(true);
                      }}
                      className="h-11 border border-black bg-black px-4 font-heading text-[10px] font-black tracking-[0.2em] text-white hover:opacity-80"
                    >
                      CONTRATAR
                    </button>
                    <Link
                      to="/contacto"
                      className="flex h-11 items-center justify-center border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                    >
                      CONTACTO
                    </Link>
                  </div>

                  {(contactPhone || contactEmail) ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {contactPhone ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-11 items-center justify-center border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                        >
                          WHATSAPP
                        </a>
                      ) : null}
                      {contactEmail ? (
                        <a
                          href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Contratación: ${artist.name}`)}`}
                          className="flex h-11 items-center justify-center border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                        >
                          EMAIL
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {artist.cvUrl ? (
                    <a
                      href={artist.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex h-11 items-center justify-center border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                    >
                      DESCARGAR CV (PDF)
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-black bg-white p-8">
                <h2 className="font-heading text-xl font-black tracking-tight text-black">TRAYECTORIA</h2>
                <p className="mt-6 font-body text-sm font-light leading-relaxed tracking-widest text-black uppercase">
                  {artist.bio}
                </p>

                <div className="mt-10 border-t border-black pt-10">
                  <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">
                    TIMELINE
                  </div>
                  <div className="mt-6 space-y-6">
                    {timeline.map((item) => (
                      <div key={`${item.year}-${item.title}`} className="border border-black p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-heading text-sm font-black tracking-tight text-black">{item.title}</div>
                          <div className="font-body text-[10px] font-black tracking-[0.2em] text-black opacity-60">{item.year}</div>
                        </div>
                        <div className="mt-3 font-body text-[10px] font-light tracking-[0.2em] text-black uppercase opacity-70">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 border-t border-black pt-10">
                  <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">
                    ESTILOS
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {artist.styles.map((style) => (
                      <Link
                        key={style}
                        to={`/artistas?q=${encodeURIComponent(style)}`}
                        className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white transition-colors"
                      >
                        {style}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-10 border-t border-black pt-10">
                  <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">
                    INSTRUMENTOS
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {artist.instruments.map((inst) => (
                      <div key={inst.name} className="border border-black p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-heading text-xs font-black tracking-[0.2em] text-black uppercase">{inst.name}</div>
                          <div className="font-body text-[9px] font-black tracking-[0.2em] text-black opacity-60">
                            {levelLabel(inst.level)}
                          </div>
                        </div>
                        <div className="mt-4 h-2 w-full border border-black">
                          <div className="h-full bg-black" style={{ width: `${(inst.level / 5) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {artist.gallery?.length ? (
                  <div className="mt-10 border-t border-black pt-10">
                    <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">
                      MULTIMEDIA
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {artist.gallery.map((src) => (
                        <div key={src} className="border border-black overflow-hidden bg-black">
                          <img src={src} alt={artist.name} loading="lazy" className="h-full w-full object-cover grayscale" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-10">
                <AvailabilityCalendar items={artist.availability} availableBandSlugs={bandOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-black bg-white p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                CONTRATACIÓN / {artist.name}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-black hover:opacity-50 transition-opacity" aria-label="Cerrar">
                ✕
              </button>
            </div>
            <ContactForm
              preselectedBand={defaultBandForForm}
              onSuccess={() => setTimeout(() => setShowModal(false), 2000)}
              variant="modal"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistsProfile;
