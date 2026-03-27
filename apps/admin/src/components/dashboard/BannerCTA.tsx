import { ArrowRight } from "lucide-react";
import concertBanner from "@/assets/concert-banner.jpg";

const BannerCTA = () => {
  return (
    <div className="relative overflow-hidden rounded-xl mt-6">
      <img
        src={concertBanner}
        alt="Concert stage"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={512}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      <div className="relative p-8">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          ¿Listo para lanzar tu
          <br />
          gira de verano?
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          Accede a alianzas exclusivas con venues y herramientas de facturación automatizada.
        </p>
        <button className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all">
          Explorar Venues
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BannerCTA;
