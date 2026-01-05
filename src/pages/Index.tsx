import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChoose from "@/components/WhyChoose";
import Services from "@/components/Services";
import ExchangeRate from "@/components/ExchangeRate";
import Features from "@/components/Features";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Preloader />
      <Navbar />
      <Hero />
      <WhyChoose />
      <Services />
      <ExchangeRate />
      <Features />
      <Statistics />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
