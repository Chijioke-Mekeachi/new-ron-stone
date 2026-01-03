import { useEffect, useRef, useState } from "react";
import { Users, Globe, Clock, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Stat {
  icon: typeof Users;
  value: number;
  suffix: string;
  labelKey: string;
}

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const stats: Stat[] = [
    { icon: Award, value: 10, suffix: "+", labelKey: "stats.years" },
    { icon: Users, value: 1.5, suffix: "M+", labelKey: "stats.users" },
    { icon: Globe, value: 120, suffix: "+", labelKey: "stats.countries" },
    { icon: Clock, value: 24, suffix: "/7", labelKey: "stats.support" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-gradient-to-br from-primary via-navy-light to-navy-dark text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('stats.title').split('Millions').map((part, i) => 
              i === 0 ? (
                <span key={i}>{part}<span className="text-accent">Millions</span></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p className="text-lg text-primary-foreground/80">
            {t('stats.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StatCard
                key={index}
                icon={Icon}
                value={stat.value}
                suffix={stat.suffix}
                label={t(stat.labelKey)}
                isVisible={isVisible}
                delay={index * 0.2}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
  delay: number;
}

const StatCard = ({ icon: Icon, value, suffix, label, isVisible, delay }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      className="text-center p-8 bg-primary-foreground/5 backdrop-blur-sm rounded-2xl border border-primary-foreground/10 hover:border-accent/50 transition-all duration-300 hover:scale-105 animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-accent" />
      </div>
      <div className="text-4xl sm:text-5xl font-bold mb-2 text-accent">
        {count.toFixed(count < 10 ? 1 : 0)}
        {suffix}
      </div>
      <p className="text-primary-foreground/80 font-medium">{label}</p>
    </div>
  );
};

export default Statistics;
