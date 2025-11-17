import { CreditCard, Wallet, Send, Shield, TrendingUp, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Wallet,
    title: "Digital Banking",
    description: "Open a premium digital account in minutes with no paperwork. Manage everything from your phone.",
  },
  {
    icon: CreditCard,
    title: "Virtual & Physical Cards",
    description: "Get instant virtual cards and premium metal cards with cashback rewards on every purchase.",
  },
  {
    icon: Send,
    title: "Real-Time Transfers",
    description: "Send money anywhere in the world instantly with the best exchange rates and lowest fees.",
  },
  {
    icon: TrendingUp,
    title: "Smart Savings & Investments",
    description: "Grow your wealth with high-yield savings accounts and automated investment portfolios.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Military-grade encryption, biometric authentication, and 24/7 fraud monitoring protection.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Experience",
    description: "Full banking control at your fingertips with our award-winning mobile app.",
  },
];

const Services = () => {
  return (
    <section className="py-20 lg:py-32" id="business">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Complete <span className="text-gradient-gold">Banking Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage your money, all in one powerful platform. 
            From everyday banking to international business, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="p-8 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-elegant group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
