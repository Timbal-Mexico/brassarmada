import Hero from "@/components/Hero";
import BandGrid from "@/components/BandGrid";
import CalendarSection from "@/components/CalendarSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import StickyMobileForm from "@/components/StickyMobileForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <BandGrid />
      <CalendarSection />

      {/* Desktop: offset content for sticky sidebar */}
      <div className="md:mr-80">
        <Testimonials />
      </div>

      <Footer />
      <StickyMobileForm />

      {/* Bottom padding for mobile sticky form */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Index;
