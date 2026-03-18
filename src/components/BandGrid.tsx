import { Link } from "react-router-dom";
import { bands } from "@/data/bands";

const BandGrid = () => {
  return (
    <section id="catalogo" className="border-b border-black bg-white px-4 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-2 text-center text-2xl font-black md:text-5xl lg:text-6xl tracking-tighter">
          NUESTROS <span className="font-light italic">PROYECTOS</span>
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center font-body text-xs tracking-widest text-black uppercase opacity-60">
          7 proyectos musicales para cualquier tipo de evento
        </p>

        {/* Desktop: grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bands.map((band) => (
            <Link
              key={band.id}
              to={`/bandas/${band.slug}`}
              className="group relative block overflow-hidden border border-black"
            >
              <div className="aspect-[4/5] overflow-hidden bg-black">
                <img
                  src={band.image}
                  alt={`${band.name} - ${band.genre}`}
                  loading="lazy"
                  className="grayscale-img h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
              </div>
              <div className="border-t border-black bg-white p-6">
                <span className="mb-2 block font-body text-[10px] font-light tracking-[0.2em] text-black uppercase">{band.genre}</span>
                <h3 className="font-heading text-xl font-black text-black leading-tight tracking-tight">{band.name}</h3>
                
                {band.lineup && (
                  <div className="mt-4 border-t border-black/10 pt-4">
                    <p className="mb-2 font-heading text-[9px] font-black tracking-widest text-black">LINE-UP:</p>
                    <ul className="space-y-1">
                      {band.lineup.map((member, idx) => (
                        <li key={idx} className="font-body text-[10px] font-light text-black uppercase opacity-70">
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 h-[1px] w-8 bg-black transition-all duration-300 group-hover:w-full" />
                <span className="mt-4 inline-block font-heading text-[10px] font-black tracking-widest text-black">
                  EXPLORAR →
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
