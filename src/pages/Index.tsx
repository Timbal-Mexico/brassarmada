import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BandGrid from "@/components/BandGrid";
import CalendarSection from "@/components/CalendarSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      <Hero />
      <BandGrid />
      <CalendarSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
