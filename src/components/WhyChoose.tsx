import { Globe, Zap, DollarSign, HeadphonesIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyChoose = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Globe,
      title: t('why.instant.title'),
      description: t('why.instant.desc'),
    },
    {
      icon: Zap,
      title: t('why.multicurrency.title'),
      description: t('why.multicurrency.desc'),
    },
    {
      icon: DollarSign,
      title: t('why.zerofees.title'),
      description: t('why.zerofees.desc'),
    },
    {
      icon: HeadphonesIcon,
      title: t('why.support.title'),
      description: t('why.support.desc'),
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-secondary/50" id="personal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('why.title').split('Ron Stone Bank').map((part, i) => 
              i === 0 ? (
                <span key={i}>{part}<span className="text-gradient-gold">Ron Stone Bank</span></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('why.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
