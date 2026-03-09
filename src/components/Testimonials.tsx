import { venues } from "@/data/bands";

const homeTestimonials = [
  {
    quote: "Contratamos 3 bandas diferentes para nuestra convención y todas cumplieron al 100%. El proceso fue rapidísimo.",
    author: "Laura Vázquez",
    role: "Directora de Eventos, Grupo Modelo",
  },
  {
    quote: "La calidad de los músicos superó nuestras expectativas. Definitivamente repetiremos para el próximo año.",
    author: "Ricardo Mendoza",
    role: "CEO, EventosPro MX",
  },
  {
    quote: "Respuesta en menos de 2 horas. Profesionalismo total desde la cotización hasta el evento.",
    author: "Gabriela Núñez",
    role: "Wedding Planner, Bodas CDMX",
  },
];

const Testimonials = () => {
  return (
    <section className="border-b border-border px-4 py-16 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-2xl md:text-4xl">
          Clientes <span className="text-primary">Satisfechos</span>
        </h2>

        {/* Testimonials - horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-px md:overflow-visible md:bg-border md:pb-0">
          {homeTestimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 border border-border bg-card p-6 md:border-0"
              style={{ minWidth: "280px" }}
            >
              <p className="mb-4 font-body text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <p className="font-heading text-xs text-primary">{t.author}</p>
              <p className="font-body text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>

        {/* Venue logos */}
        <div className="mt-16">
          <p className="mb-6 text-center font-body text-xs uppercase tracking-widest text-muted-foreground">
            Venues donde hemos tocado
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {venues.map((venue) => (
              <span
                key={venue}
                className="font-body text-xs text-muted-foreground"
              >
                {venue}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
