import { useState, useEffect, useRef } from "react";
import { bands } from "@/data/bands";

interface CalendarSectionProps {
  filteredBand?: string;
}

const CalendarSection = ({ filteredBand }: CalendarSectionProps) => {
  const [selectedBand, setSelectedBand] = useState(filteredBand || "");
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="calendario" className="border-b border-border px-4 py-16 md:py-24" ref={containerRef}>
      <div className="container">
        <h2 className="mb-2 text-center text-2xl md:text-4xl">
          <span className="text-primary">Disponibilidad</span>
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-center font-body text-sm text-muted-foreground">
          Consulta fechas disponibles de nuestras bandas
        </p>

        {!filteredBand && (
          <div className="mx-auto mb-8 max-w-xs">
            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className="touch-target w-full rounded-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Todas las bandas</option>
              {bands.map((b) => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Teamup Calendar Container — ready for iframe embed */}
        <div
          id="teamup-calendar"
          className="mx-auto min-h-[400px] max-w-4xl border border-border bg-card p-4"
          data-band-filter={selectedBand || filteredBand || "all"}
        >
          {isVisible ? (
            <div className="flex h-[400px] items-center justify-center font-body text-sm text-muted-foreground">
              {/* Replace this div with your Teamup iframe:
                  <iframe
                    src="https://teamup.com/YOUR_CALENDAR_ID"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    title="Calendario de disponibilidad"
                  /> */}
              <div className="text-center">
                <p className="mb-2 text-primary">📅 Calendario Teamup</p>
                <p>Inserta tu iframe de Teamup aquí</p>
                <p className="mt-1 text-xs">Container ID: teamup-calendar</p>
                {(selectedBand || filteredBand) && (
                  <p className="mt-2 text-xs">Filtro activo: {selectedBand || filteredBand}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="font-body text-sm text-muted-foreground">Cargando calendario...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
