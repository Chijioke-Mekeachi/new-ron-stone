import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  CreditCard, 
  Wallet, 
  Shield, 
  Smartphone, 
  Globe, 
  TrendingUp,
  Gift,
  Users,
  Clock
} from "lucide-react";

const Personal = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Wallet,
      title: "Digital Account",
      description: "Open a premium digital account in minutes with no paperwork. No minimum balance required.",
    },
    {
      icon: CreditCard,
      title: "Debit & Credit Cards",
      description: "Get virtual cards instantly and premium metal cards delivered to your door.",
    },
    {
      icon: Globe,
      title: "Multi-Currency",
      description: "Hold, send, and receive money in 50+ currencies at the real exchange rate.",
    },
    {
      icon: TrendingUp,
      title: "Savings Goals",
      description: "Set savings goals and earn competitive interest on your deposits.",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Biometric authentication, instant card freeze, and real-time fraud monitoring.",
    },
    {
      icon: Smartphone,
      title: "Mobile Banking",
      description: "Full banking control from our award-winning mobile app available on iOS and Android.",
    },
  ];

  const benefits = [
    { icon: Gift, text: "No monthly fees" },
    { icon: Users, text: "24/7 customer support" },
    { icon: Clock, text: "Instant account opening" },
    { icon: Shield, text: "Insured deposits" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-navy-light to-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Personal <span className="text-accent">Banking</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Experience banking that puts you first. Manage your money, save smarter, and spend with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                <Link to="/signup">Open Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-8 bg-accent">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center space-x-2 text-accent-foreground">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for <span className="text-gradient-gold">Personal Finance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to simplify your financial life and help you achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-elegant group"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold" asChild>
              <Link to="/signup">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Personal;
