import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center border-b border-border px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background opacity-50" />
      <div className="relative z-10 max-w-4xl text-center">
        <h1 className="mb-6 text-4xl leading-tight md:text-6xl lg:text-7xl">
          Talento Musical
          <br />
          <span className="text-primary">Para Tu Evento</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl font-body text-sm text-muted-foreground md:text-base">
          10 bandas + 60 músicos profesionales listos para transformar tu evento
          corporativo o privado en una experiencia inolvidable.
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
