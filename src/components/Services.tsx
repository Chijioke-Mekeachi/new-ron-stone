import { CreditCard, Wallet, Send, Shield, TrendingUp, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Wallet,
      title: t('services.banking.title'),
      description: t('services.banking.desc'),
    },
    {
      icon: CreditCard,
      title: t('services.cards.title'),
      description: t('services.cards.desc'),
    },
    {
      icon: Send,
      title: t('services.transfer.title'),
      description: t('services.transfer.desc'),
    },
    {
      icon: TrendingUp,
      title: t('services.savings.title'),
      description: t('services.savings.desc'),
    },
    {
      icon: Shield,
      title: t('services.security.title'),
      description: t('services.security.desc'),
    },
    {
      icon: Smartphone,
      title: t('services.mobile.title'),
      description: t('services.mobile.desc'),
    },
  ];

  return (
    <section className="py-20 lg:py-32" id="business">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('services.title').split('Banking Solutions').map((part, i) => 
              i === 0 ? (
                <span key={i}>{part}<span className="text-gradient-gold">Banking Solutions</span></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('services.subtitle')}
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
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold" asChild>
            <Link to="/signup">{t('services.cta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
