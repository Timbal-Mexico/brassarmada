import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center border-b border-border px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background opacity-50" />
      <div className="relative z-10 max-w-6xl text-center">
        <div className="mb-8 flex justify-center">
          <img 
            src="/images/logos/brassaarmada.png" 
            alt="Brass Armada" 
            className="h-auto w-full max-w-md md:max-w-2xl lg:max-w-3xl" 
          />
        </div>
        <h1 className="mb-6 font-heading text-3xl text-primary md:text-5xl lg:text-6xl tracking-widest drop-shadow-md">
          PROPUESTAS SONORAS EN CATÁLOGO
        </h1>
        <p className="mx-auto mb-10 max-w-2xl font-body text-sm text-muted-foreground md:text-base uppercase">
          Brass Armada es una institución dedicada a crear, estimular y propagar el movimiento del jazz con un enfoque explosivo, audaz y refrescante. Una plataforma de talento, ensamble y producción. La alianza ideal para planners, activaciones de marca, festivales y productoras de eventos.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => {
              trackEvent("click_availability");
              scrollTo("calendario");
            }}
            className="touch-target rounded-sm bg-primary px-8 py-4 font-heading text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ver Disponibilidad
          </button>
          <button
            onClick={() => scrollTo("catalogo")}
            className="touch-target rounded-sm border border-primary px-8 py-4 font-heading text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Explorar Catálogo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
