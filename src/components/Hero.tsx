import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[50vh] flex-col items-center justify-center border-b border-black overflow-hidden md:min-h-[60vh]">
      <div className="relative z-10 h-full w-full">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/herocover.png" 
              alt="Brass Armada cover" 
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center p-8">
            <img 
              src="/images/logos/brassaarmada.png" 
              alt="Brass Armada" 
              className="h-auto w-full max-w-xs md:max-w-md lg:max-w-xl brightness-0 invert" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
