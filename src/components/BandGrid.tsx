import { Link } from "react-router-dom";
import { bands } from "@/data/bands";

const BandGrid = () => {
  return (
    <section id="catalogo" className="border-b border-border px-4 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl md:text-4xl">
          Nuestras <span className="text-primary">Bandas</span>
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center font-body text-sm text-muted-foreground">
          10 proyectos musicales para cualquier tipo de evento
        </p>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory">
          {bands.map((band) => (
            <Link
              key={band.id}
              to={`/bandas/${band.slug}`}
              className="band-card-hover group flex-shrink-0 snap-start"
              style={{ width: "75vw", maxWidth: "300px" }}
            >
              <div className="overflow-hidden border border-border bg-card">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={band.image}
                    alt={`${band.name} - ${band.genre}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="border-t border-border p-4">
                  <span className="mb-1 block font-body text-xs text-primary">{band.genre}</span>
                  <h3 className="band-name font-heading text-lg text-foreground transition-transform">{band.name}</h3>
                  <span className="mt-3 inline-block font-body text-xs text-muted-foreground underline underline-offset-4">
                    Ver más →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden gap-px bg-border md:grid md:grid-cols-3 lg:grid-cols-5">
          {bands.map((band) => (
            <Link
              key={band.id}
              to={`/bandas/${band.slug}`}
              className="band-card-hover group bg-card"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={band.image}
                  alt={`${band.name} - ${band.genre}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="border-t border-border p-4">
                <span className="mb-1 block font-body text-xs text-primary">{band.genre}</span>
                <h3 className="band-name font-heading text-base text-foreground transition-transform">{band.name}</h3>
                <span className="mt-3 inline-block font-body text-xs text-muted-foreground underline underline-offset-4">
                  Ver más →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BandGrid;
