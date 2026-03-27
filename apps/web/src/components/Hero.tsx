import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative border-b border-black overflow-hidden bg-black">
      <div className="relative z-10 w-full">
        <div className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          <img
            src="/images/herocover.png"
            alt="Brass Armada cover"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 z-10 flex items-center justify-center p-6 sm:p-8">
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
