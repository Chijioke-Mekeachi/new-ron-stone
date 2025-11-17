import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Trusted by 1.5M+ users worldwide</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Your Most Trusted{" "}
              <span className="text-gradient-gold">Digital Banking</span> Partner
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Experience fast, secure, and borderless banking built for the modern world. 
              Manage your finances with confidence from anywhere, anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold group">
                Open Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                Login to Account
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 border-t border-border/50">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Instant Transfers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">120+ Countries</span>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative animate-fade-in">
            <div className="relative z-10">
              <img
                src={heroMockup}
                alt="Ron Stone Bank Mobile App"
                className="w-full h-auto rounded-3xl shadow-elegant hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
