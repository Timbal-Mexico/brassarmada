import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBandBySlug, type Band } from "@/data/bands";
import { trackEvent } from "@/lib/analytics";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BandLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const [band, setBand] = useState<Band | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    if (slug) {
      const found = getBandBySlug(slug);
      setBand(found);
      if (found) {
        trackEvent("band_page_view", { band: found.slug, name: found.name });
        document.title = `${found.name} — Booking Talento Musical`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", found.description);
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", `${found.name} | Booking Talento Musical`);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", found.tagline);
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute("content", found.image);
      }
    }
  }, [slug]);

  const venueItems = band?.venuesGallery ?? [];

  useEffect(() => {
    if (!lightbox.open || !venueItems.length) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox((s) => ({ ...s, open: false }));
        return;
      }
      if (e.key === "ArrowLeft") {
        setLightbox((s) => ({ ...s, index: (s.index - 1 + venueItems.length) % venueItems.length }));
      } else if (e.key === "ArrowRight") {
        setLightbox((s) => ({ ...s, index: (s.index + 1) % venueItems.length }));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox.open, venueItems.length]);

  if (!band) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl">Banda no encontrada</h1>
          <Link to="/" className="font-body text-sm text-primary underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/52${band.phone}?text=${encodeURIComponent(`Hola, me interesa contratar a ${band.name} para un evento. ¿Podrían darme información?`)}`;

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      <nav className="border-b border-black px-4 py-4">
        <div className="container flex items-center justify-between">
          <Link to="/proyectos" className="font-heading text-[10px] font-black tracking-widest text-black">← PROYECTOS</Link>
          <span className="font-body text-[10px] font-light tracking-widest text-black uppercase">{band.genre}</span>
        </div>
      </nav>

      <section className="relative border-b border-black bg-white">
        <div className="aspect-[16/9] max-h-[60vh] w-full overflow-hidden md:aspect-[21/9]">
          <img src={band.image} alt={band.name} className="grayscale h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-white/10" />
        </div>
        <div className="p-8 md:p-16 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-black uppercase">{band.name}</h1>
          <p className="mt-6 mx-auto max-w-2xl font-body text-xs tracking-[0.2em] text-black uppercase font-light leading-relaxed">{band.tagline}</p>
          
          {band.lineup && (
            <div className="mt-12 border-t border-black pt-12">
              <h3 className="mb-6 font-heading text-[10px] font-black tracking-[0.3em] text-black">INTEGRANTES / LINE-UP</h3>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {band.lineup.map((member, idx) => (
                  <span key={idx} className="font-body text-xs tracking-widest text-black uppercase font-light">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="px-12 py-4 border border-black font-heading text-[10px] font-black tracking-widest text-black hover:bg-black hover:text-white transition-all"
            >
              SOLICITAR FECHA
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { band: band.slug })}
              className="px-12 py-4 bg-black font-heading text-[10px] font-black tracking-widest text-white hover:opacity-80 transition-all"
            >
              WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {band.gallery?.length ? (
        <section className="border-b border-black bg-white py-16">
          <div className="mx-auto w-full max-w-[1440px] px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black tracking-tighter md:text-5xl uppercase text-black">
                GALERÍA / <span className="font-light italic text-black/40">SHOW</span>
              </h2>
            </div>

            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent className="-ml-0">
                {band.gallery.map((src) => (
                  <CarouselItem key={src} className="pl-0">
                    <div className="border border-black bg-black p-1">
                      <div className="aspect-[21/9] w-full overflow-hidden">
                        <img
                          src={src}
                          alt={`${band.name} galería`}
                          loading="lazy"
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="rounded-none border-black bg-white text-black hover:bg-black hover:text-white"
              />
              <CarouselNext className="rounded-none border-black bg-white text-black hover:bg-black hover:text-white" />
            </Carousel>
          </div>
        </section>
      ) : null}

      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-3xl text-center">
          <p className="font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">
            {band.description}
          </p>
        </div>
      </section>

      {band.venuesGallery?.length ? (
        <section className="border-b border-black bg-white py-16">
          <div className="mx-auto w-full max-w-[1440px] px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black tracking-tighter md:text-5xl uppercase text-black">
                LUGARES / <span className="font-light italic text-black/40">DONDE TOCARON</span>
              </h2>
            </div>

            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {band.venuesGallery.map((v) => (
                  <CarouselItem key={`${v.name}-${v.image}`} className="md:basis-1/2 lg:basis-1/3">
                    <button
                      type="button"
                      onClick={() => {
                        const idx = venueItems.findIndex((it) => it.image === v.image);
                        setLightbox({ open: true, index: idx >= 0 ? idx : 0 });
                      }}
                      aria-label={`Abrir imagen de ${v.name}`}
                      className="group block w-full border border-black bg-black p-1 text-left"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <img
                          src={v.image}
                          alt={v.name}
                          loading="lazy"
                          className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 border-t border-black bg-white/95 p-4">
                          <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">
                            {v.name}
                          </div>
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="rounded-none border-black bg-white text-black hover:bg-black hover:text-white"
              />
              <CarouselNext className="rounded-none border-black bg-white text-black hover:bg-black hover:text-white" />
            </Carousel>
          </div>
        </section>
      ) : null}

      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-black tracking-tighter md:text-5xl uppercase">
            MEDIA / <span className="font-light italic text-black/40">SONIDO</span>
          </h2>
          {band.spotifyEmbed && band.youtubeEmbed ? (
            <div className="grid gap-12 md:grid-cols-2">
              <div className="border border-black bg-black p-1">
                <iframe
                  src={band.spotifyEmbed}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${band.name} en Spotify`}
                  className="grayscale"
                />
              </div>
              <div className="border border-black bg-black p-1">
                <div className="aspect-video">
                  <iframe
                    src={band.youtubeEmbed}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={`${band.name} en YouTube`}
                    className="grayscale"
                  />
                </div>
              </div>
            </div>
          ) : band.youtubeEmbed ? (
            <div className="border border-black bg-black p-1">
              <div className="aspect-video">
                <iframe
                  src={band.youtubeEmbed}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  title={`${band.name} en YouTube`}
                  className="grayscale"
                />
              </div>
            </div>
          ) : band.spotifyEmbed ? (
            <div className="border border-black bg-black p-1">
              <iframe
                src={band.spotifyEmbed}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${band.name} en Spotify`}
                className="grayscale"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-black tracking-tighter md:text-5xl uppercase">
            RESEÑAS / <span className="font-light italic text-black/40">FEEDBACK</span>
          </h2>
          {band.testimonials.length ? (
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {band.testimonials.map((t, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <div className="border border-black bg-white p-8 h-full">
                      <p className="mb-6 font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">
                        "{t.quote}"
                      </p>
                      <p className="font-heading text-[10px] font-black tracking-widest text-black">{t.author}</p>
                      <p className="font-body text-[9px] tracking-[0.2em] text-black/40 uppercase">{t.venue}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="rounded-none border-black bg-white text-black hover:bg-black hover:text-white" />
              <CarouselNext className="rounded-none border-black bg-white text-black hover:bg-black hover:text-white" />
            </Carousel>
          ) : (
            <div className="border border-black bg-white p-8 text-center font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
              Sin reseñas por ahora
            </div>
          )}
        </div>
      </section>

      <Footer />

      {lightbox.open && venueItems.length ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de lugar"
          onClick={() => setLightbox((s) => ({ ...s, open: false }))}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-heading text-[10px] font-black tracking-[0.3em] text-white uppercase">
                {venueItems[lightbox.index]?.name}
              </div>
              <button
                type="button"
                onClick={() => setLightbox((s) => ({ ...s, open: false }))}
                className="h-10 border border-white bg-transparent px-4 font-heading text-[10px] font-black tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors"
              >
                CERRAR
              </button>
            </div>

            <div className="relative border border-white bg-black p-1">
              <img
                src={venueItems[lightbox.index]?.image}
                alt={venueItems[lightbox.index]?.name}
                className="max-h-[75vh] w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/30 bg-black/40 p-4">
                <div className="font-body text-[10px] font-light tracking-[0.3em] text-white uppercase opacity-90">
                  {lightbox.index + 1} / {venueItems.length}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setLightbox((s) => ({ ...s, index: (s.index - 1 + venueItems.length) % venueItems.length }))
                }
                className="h-10 border border-white bg-transparent px-4 font-heading text-[10px] font-black tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightbox((s) => ({ ...s, index: (s.index + 1) % venueItems.length }))
                }
                className="h-10 border border-white bg-transparent px-4 font-heading text-[10px] font-black tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-black bg-white p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">SOLICITAR FECHA / {band.name}</h3>
              <button onClick={() => setShowModal(false)} className="text-black hover:opacity-50 transition-opacity">✕</button>
            </div>
            <ContactForm preselectedBand={band.slug} onSuccess={() => setTimeout(() => setShowModal(false), 2000)} variant="modal" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BandLanding;
