import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBandBySlug, type Band } from "@/data/bands";
import { trackEvent } from "@/lib/analytics";
import CalendarSection from "@/components/CalendarSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const BandLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const [band, setBand] = useState<Band | undefined>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = getBandBySlug(slug);
      setBand(found);
      if (found) {
        trackEvent("band_page_view", { band: found.slug, name: found.name });
        // Update OG tags dynamically
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
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-4 py-4">
        <div className="container flex items-center justify-between">
          <Link to="/" className="font-heading text-xs text-primary">← Catálogo</Link>
          <span className="font-body text-xs text-muted-foreground">{band.genre}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="aspect-[16/9] max-h-[60vh] w-full overflow-hidden md:aspect-[21/9]">
          <img src={band.image} alt={band.name} className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl">{band.name}</h1>
          <p className="mt-2 max-w-xl font-body text-sm text-muted-foreground md:text-base">{band.tagline}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setShowModal(true)}
              className="touch-target rounded-sm bg-primary px-8 py-4 font-heading text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Solicitar Fecha
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { band: band.slug })}
              className="touch-target rounded-sm border border-primary px-8 py-4 text-center font-heading text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="border-b border-border px-4 py-16">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-xl md:text-3xl">
            <span className="text-primary">Paquetes</span>
          </h2>
          <div className="grid gap-px bg-border md:grid-cols-2">
            {band.packages.map((pkg, i) => (
              <div key={i} className="bg-card p-6">
                <h3 className="font-heading text-base text-foreground">{pkg.name}</h3>
                <p className="mb-4 mt-1 font-body text-xs text-muted-foreground">Desde</p>
                <p className="mb-6 font-heading text-2xl text-primary">{pkg.price}</p>
                <ul className="space-y-2">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 font-body text-xs text-foreground">
                      <span className="mt-0.5 text-primary">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowModal(true)}
                  className="touch-target mt-6 w-full rounded-sm bg-primary py-3 font-heading text-xs text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Reservar {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="border-b border-border px-4 py-16">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-xl md:text-3xl">
            <span className="text-primary">Escúchanos</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden border border-border">
              <iframe
                src={band.spotifyEmbed}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${band.name} en Spotify`}
                className="border-0"
              />
            </div>
            <div className="overflow-hidden border border-border">
              <div className="aspect-video">
                <iframe
                  src={band.youtubeEmbed}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  title={`${band.name} en YouTube`}
                  className="border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setlist */}
      <section className="border-b border-border px-4 py-16">
        <div className="container max-w-xl">
          <h2 className="mb-8 text-center text-xl md:text-3xl">
            <span className="text-primary">Setlist</span> Ejemplo
          </h2>
          <ol className="space-y-0 divide-y divide-border border border-border">
            {band.setlist.map((song, i) => (
              <li key={i} className="flex items-center gap-4 bg-card px-4 py-3">
                <span className="w-6 font-body text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-body text-sm text-foreground">{song}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rider */}
      <section className="border-b border-border px-4 py-12">
        <div className="container max-w-xl text-center">
          <h2 className="mb-4 text-xl md:text-2xl">Rider <span className="text-primary">Técnico</span></h2>
          <a
            href={band.riderPdf}
            download
            className="inline-block touch-target rounded-sm border border-border px-8 py-3 font-body text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            📄 Descargar PDF
          </a>
        </div>
      </section>

      {/* Calendar */}
      <CalendarSection filteredBand={band.slug} />

      {/* Testimonials */}
      <section className="border-b border-border px-4 py-16">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-xl md:text-3xl">
            Lo que dicen de <span className="text-primary">{band.name}</span>
          </h2>
          <div className="grid gap-px bg-border md:grid-cols-2">
            {band.testimonials.map((t, i) => (
              <div key={i} className="bg-card p-6">
                <p className="mb-4 font-body text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                <p className="font-heading text-xs text-primary">{t.author}</p>
                <p className="font-body text-xs text-muted-foreground">{t.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTAs */}
      <section className="border-b border-border px-4 py-16">
        <div className="container max-w-lg text-center">
          <h2 className="mb-6 text-xl md:text-3xl">
            ¿Listo para <span className="text-primary">reservar</span>?
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="touch-target rounded-sm bg-primary px-8 py-4 font-heading text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Solicitar Fecha
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { band: band.slug })}
              className="touch-target rounded-sm border border-primary px-8 py-4 font-heading text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/90 p-4">
          <div className="w-full max-w-md border border-border bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm text-primary">Solicitar Fecha — {band.name}</h3>
              <button onClick={() => setShowModal(false)} className="touch-target font-body text-muted-foreground">✕</button>
            </div>
            <ContactForm preselectedBand={band.slug} onSuccess={() => setTimeout(() => setShowModal(false), 2000)} variant="modal" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BandLanding;
