import { CheckCircle, Lock, Bell, CreditCard, Smartphone, Globe } from "lucide-react";
import appTransactions from "@/assets/app-transactions.jpg";
import appSendMoney from "@/assets/app-send-money.jpg";
import appWallet from "@/assets/app-wallet.jpg";

const features = [
  {
    icon: CheckCircle,
    title: "Fast Onboarding",
    description: "Open your account in under 5 minutes with just your phone and ID.",
  },
  {
    icon: Smartphone,
    title: "Mobile Control",
    description: "Manage everything from deposits to investments right from your phone.",
  },
  {
    icon: Lock,
    title: "Smart Security",
    description: "Biometric login, instant card freezing, and real-time fraud alerts.",
  },
  {
    icon: Globe,
    title: "International IBAN",
    description: "Get local account details for USD, EUR, GBP, and 20+ currencies.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Instant alerts for every transaction, payment, and account activity.",
  },
  {
    icon: CreditCard,
    title: "Smart Cards",
    description: "Physical and virtual cards with contactless payments and Apple Pay.",
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Banking <span className="text-gradient-gold">Reimagined</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to give you complete control over your financial life.
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
            Experience the <span className="text-gradient-gold">Ron Stone Bank App</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group animate-fade-up">
              <div className="overflow-hidden rounded-2xl shadow-elegant hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                <img
                  src={appTransactions}
                  alt="Transaction History"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">Transaction History</p>
            </div>
            <div className="group animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="overflow-hidden rounded-2xl shadow-elegant hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                <img
                  src={appSendMoney}
                  alt="Send Money"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">Send Money</p>
            </div>
            <div className="group animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="overflow-hidden rounded-2xl shadow-elegant hover:shadow-gold transition-all duration-500 hover:-translate-y-2">
                <img
                  src={appWallet}
                  alt="Multi-Currency Wallet"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">Multi-Currency Wallet</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
