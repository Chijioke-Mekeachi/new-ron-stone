import { CheckCircle, Lock, Bell, CreditCard, Smartphone, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import appTransactions from "@/assets/app-transactions.jpg";
import appSendMoney from "@/assets/app-send-money.jpg";
import appWallet from "@/assets/app-wallet.jpg";

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: CheckCircle,
      title: t('features.onboarding.title'),
      description: t('features.onboarding.desc'),
    },
    {
      icon: Smartphone,
      title: t('features.mobile.title'),
      description: t('features.mobile.desc'),
    },
    {
      icon: Lock,
      title: t('features.security.title'),
      description: t('features.security.desc'),
    },
    {
      icon: Globe,
      title: t('features.international.title'),
      description: t('features.international.desc'),
    },
    {
      icon: Bell,
      title: t('features.notifications.title'),
      description: t('features.notifications.desc'),
    },
    {
      icon: CreditCard,
      title: t('features.cards.title'),
      description: t('features.cards.desc'),
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-secondary/30" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('features.title').split('Banking Features').map((part, i) => 
              i === 0 ? (
                <span key={i}>{part}<span className="text-gradient-gold">Banking Features</span></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border hover:border-accent/30 transition-all duration-300 group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* App Screenshots */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t('features.appTitle').split('Ron Stone Bank App').map((part, i) => 
              i === 0 ? (
                <span key={i}>{part}<span className="text-gradient-gold">Ron Stone Bank App</span></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group animate-fade-up">
              <div className="overflow-hidden rounded-2xl shadow-elegant hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                <img
                  src={appTransactions}
                  alt={t('features.appTransactions')}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">{t('features.appTransactions')}</p>
            </div>
            <div className="group animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="overflow-hidden rounded-2xl shadow-elegant hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                <img
                  src={appSendMoney}
                  alt={t('features.appSendMoney')}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">{t('features.appSendMoney')}</p>
            </div>
            <div className="group animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="overflow-hidden rounded-2xl shadow-elegant hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                <img
                  src={appWallet}
                  alt={t('features.appWallet')}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">{t('features.appWallet')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
