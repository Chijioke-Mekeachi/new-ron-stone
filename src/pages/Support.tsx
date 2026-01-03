import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin,
  HelpCircle,
  FileText,
  Shield,
  Clock,
  ChevronDown
} from "lucide-react";

const Support = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I open an account?",
      answer: "Opening an account is simple! Click 'Open Account', provide your email and create a password, verify your identity with a valid ID, and you're ready to go. The entire process takes less than 5 minutes."
    },
    {
      question: "What currencies do you support?",
      answer: "We support over 50 currencies including USD, EUR, GBP, JPY, AUD, CAD, CHF, and many more. You can hold multiple currencies in your account and convert between them at competitive rates."
    },
    {
      question: "How long do transfers take?",
      answer: "Internal transfers between Ron Stone Bank accounts are instant. International transfers typically take 1-3 business days depending on the destination country and currency."
    },
    {
      question: "Are my funds protected?",
      answer: "Yes, your deposits are protected up to applicable limits by regulatory insurance schemes. We also use bank-grade encryption and multi-factor authentication to secure your account."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us 24/7 via live chat in the app, email at support@ronstonebank.com, or call us at +1 (800) RON-BANK. Premium members have access to priority support."
    },
    {
      question: "What are the fees?",
      answer: "We believe in transparent pricing. Personal accounts have no monthly fees. We charge minimal fees for currency conversion (0.5%) and international transfers. Check our pricing page for full details."
    },
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us 24/7",
      action: "Start Chat",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (800) RON-BANK",
      action: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@ronstonebank.com",
      action: "Send Email",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-navy-light to-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              How Can We <span className="text-accent">Help?</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Our support team is here for you 24/7. Find answers in our FAQ or reach out directly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="text-center text-accent-foreground">
                  <Icon className="w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                  <p className="text-accent-foreground/80 mb-3">{method.description}</p>
                  <Button variant="secondary" size="sm">
                    {method.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-accent transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              Send Us a <span className="text-gradient-gold">Message</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="How can we help?" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..." 
                  rows={5}
                  required 
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
            <p className="text-muted-foreground text-lg mb-2">
              123 Banking Street, Finance District
            </p>
            <p className="text-muted-foreground text-lg">
              New York, NY 10004, United States
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
