import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[50vh] flex-col items-center justify-center border-b border-black overflow-hidden md:min-h-[60vh]">
      <div className="relative z-10 h-full w-full">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1559752067-f30e5f277930?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Concert Background" 
              className="h-full w-full object-cover grayscale"
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
