import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Building2, 
  CreditCard, 
  FileText, 
  Globe, 
  Users,
  TrendingUp,
  Shield,
  Zap,
  Briefcase,
  BarChart3
} from "lucide-react";

const Business = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Building2,
      title: "Business Accounts",
      description: "Multi-currency business accounts with dedicated IBANs for seamless international operations.",
    },
    {
      icon: CreditCard,
      title: "Corporate Cards",
      description: "Issue unlimited virtual and physical cards for your team with custom spending limits.",
    },
    {
      icon: Globe,
      title: "International Payments",
      description: "Send and receive payments in 50+ currencies with competitive exchange rates.",
    },
    {
      icon: FileText,
      title: "Invoicing & Billing",
      description: "Create professional invoices, track payments, and automate recurring billing.",
    },
    {
      icon: BarChart3,
      title: "Financial Analytics",
      description: "Real-time insights into your business finances with detailed reports and dashboards.",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Add team members with role-based permissions and approval workflows.",
    },
  ];

  const stats = [
    { value: "50+", label: "Currencies Supported" },
    { value: "0.5%", label: "FX Margin" },
    { value: "10k+", label: "Business Clients" },
    { value: "24/7", label: "Priority Support" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-navy-light to-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-accent/20 px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">For Businesses of All Sizes</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Business <span className="text-accent">Banking</span> Reimagined
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Powerful financial tools designed for modern businesses. From startups to enterprises, 
              we help you grow globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                <Link to="/signup">Open Business Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-accent-foreground">{stat.value}</p>
                <p className="text-sm text-accent-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for <span className="text-gradient-gold">Business Growth</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial tools that scale with your business needs.
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Business Banking?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of businesses that trust Ron Stone Bank for their financial operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Business;
