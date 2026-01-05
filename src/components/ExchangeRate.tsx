import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const currencies = [
  { code: "USD", name: "US Dollar", rate: 1.0, change: 0 },
  { code: "EUR", name: "Euro", rate: 0.92, change: -0.3 },
  { code: "GBP", name: "British Pound", rate: 0.79, change: 0.5 },
  { code: "JPY", name: "Japanese Yen", rate: 149.82, change: 1.2 },
  { code: "AUD", name: "Australian Dollar", rate: 1.53, change: -0.8 },
  { code: "CAD", name: "Canadian Dollar", rate: 1.36, change: 0.2 },
];

const ExchangeRate = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-navy-light to-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t('exchange.title').split('Exchange Rates').map((part, i) => 
                i === 0 ? (
                  <span key={i}>{part}<span className="text-accent">Exchange Rates</span></span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h2>
            <p className="text-lg text-primary-foreground/80">
              {t('exchange.subtitle')}
            </p>
          </div>

          <div className="bg-card/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-primary-foreground/10">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Currency List */}
              <div className="space-y-3 sm:space-y-4">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedCurrency === currency.code
                        ? "bg-accent/20 border-2 border-accent"
                        : "bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10"
                    }`}
                    onClick={() => setSelectedCurrency(currency.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-accent">{currency.code}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary-foreground">{currency.code}</p>
                          <p className="text-sm text-primary-foreground/60">{currency.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-foreground">{currency.rate.toFixed(4)}</p>
                        <p
                          className={`text-sm flex items-center justify-end ${
                            currency.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {currency.change >= 0 ? "+" : ""}
                          {currency.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Placeholder */}
              <div className="space-y-6">
                <div className="bg-primary-foreground/5 rounded-2xl p-6 border border-primary-foreground/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-primary-foreground/60">USD {t('exchange.to')} {selectedCurrency}</p>
                      <p className="text-3xl font-bold text-accent mt-1">
                        {currencies.find((c) => c.code === selectedCurrency)?.rate.toFixed(4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary-foreground/60">24h Change</p>
                      <p className="text-green-400 font-semibold">+1.2%</p>
                    </div>
                  </div>

                  {/* Simple line chart visualization */}
                  <div className="h-48 flex items-end space-x-2">
                    {[65, 72, 68, 85, 78, 92, 88, 95, 90, 98, 94, 100].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-accent to-accent/30 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  {t('exchange.setAlert')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExchangeRate;
