import { Globe, Zap, DollarSign, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Instant Global Transfers",
    description: "Send money across borders in seconds with real-time exchange rates and zero delays.",
  },
  {
    icon: Zap,
    title: "Multi-Currency Accounts",
    description: "Hold, exchange, and spend in 50+ currencies with a single account and competitive rates.",
  },
  {
    icon: DollarSign,
    title: "Zero Hidden Fees",
    description: "Transparent pricing with no monthly charges, no minimum balance, and no surprise costs.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Global Support",
    description: "Expert support team available around the clock in multiple languages to assist you.",
  },
];

const WhyChoose = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/50" id="personal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="text-gradient-gold">Ron Stone Bank</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience banking that works as hard as you do. Built for the global citizen, 
            designed for simplicity, secured by industry-leading technology.
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
