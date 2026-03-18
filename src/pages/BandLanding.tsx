import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBandBySlug, type Band } from "@/data/bands";
import { trackEvent } from "@/lib/analytics";
import CalendarSection from "@/components/CalendarSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

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
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      {/* Nav */}
      <nav className="border-b border-black px-4 py-4">
        <div className="container flex items-center justify-between">
          <Link to="/" className="font-heading text-[10px] font-black tracking-widest text-black">← PROYECTOS</Link>
          <span className="font-body text-[10px] font-light tracking-widest text-black uppercase">{band.genre}</span>
        </div>
      </nav>

      {/* Hero */}
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

      {/* Description */}
      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-3xl text-center">
          <p className="font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">
            {band.description}
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-black tracking-tighter md:text-5xl uppercase">
            PAQUETES / <span className="font-light italic text-black/40">SERVICIOS</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {band.packages.map((pkg, i) => (
              <div key={i} className="border border-black p-8 flex flex-col">
                <h3 className="font-heading text-lg font-black text-black tracking-tight">{pkg.name}</h3>
                <p className="mt-6 font-heading text-3xl font-black text-black">{pkg.price}</p>
                <ul className="mt-8 space-y-3 flex-grow">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 font-body text-[10px] tracking-widest text-black uppercase font-light">
                      <span className="font-black">/</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-10 w-full border border-black py-4 font-heading text-[10px] font-black tracking-widest text-black hover:bg-black hover:text-white transition-all"
                >
                  RESERVAR {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-black tracking-tighter md:text-5xl uppercase">
            MEDIA / <span className="font-light italic text-black/40">SONIDO</span>
          </h2>
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
        </div>
      </section>

      {/* Setlist */}
      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-2xl">
          <h2 className="mb-12 text-center text-2xl font-black tracking-tighter md:text-5xl uppercase">
            SETLIST / <span className="font-light italic text-black/40">REPERTORIO</span>
          </h2>
          <div className="border border-black divide-y divide-black">
            {band.setlist.map((song, i) => (
              <div key={i} className="flex items-center gap-6 px-6 py-4 bg-white">
                <span className="font-body text-[10px] font-black text-black opacity-20">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-body text-xs tracking-widest text-black uppercase font-light">{song}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalendarSection filteredBand={band.slug} />

      {/* Testimonials */}
      <section className="border-b border-black px-4 py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-black tracking-tighter md:text-5xl uppercase">
            RESEÑAS / <span className="font-light italic text-black/40">FEEDBACK</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {band.testimonials.map((t, i) => (
              <div key={i} className="border border-black p-8">
                <p className="mb-6 font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">"{t.quote}"</p>
                <p className="font-heading text-[10px] font-black tracking-widest text-black">{t.author}</p>
                <p className="font-body text-[9px] tracking-[0.2em] text-black/40 uppercase">{t.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-black bg-white p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">SOLICITAR FECHA / {band.name}</h3>
              <button onClick="{() => setShowModal(false)}" className="text-black hover:opacity-50 transition-opacity">✕</button>
            </div>
            <ContactForm preselectedBand={band.slug} onSuccess="{() => setTimeout(() => setShowModal(false), 2000)}" variant="modal" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BandLanding;
