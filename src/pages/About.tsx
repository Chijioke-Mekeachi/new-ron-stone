import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Target, 
  Heart, 
  Users, 
  Globe,
  Award,
  Shield
} from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We constantly push boundaries to deliver cutting-edge banking solutions.",
    },
    {
      icon: Heart,
      title: "Customer Obsession",
      description: "Every decision we make starts with our customers' needs and ends with their satisfaction.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We safeguard your assets with industry-leading security measures and transparent practices.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "We believe in borderless banking, connecting people and businesses worldwide.",
    },
  ];

  const milestones = [
    { year: "2015", event: "Ron Stone Bank founded with a vision to revolutionize digital banking" },
    { year: "2017", event: "Reached 100,000 customers and launched multi-currency accounts" },
    { year: "2019", event: "Expanded to 50+ countries and introduced business banking" },
    { year: "2021", event: "Crossed 1 million active users milestone" },
    { year: "2023", event: "Launched premium cards and advanced investment features" },
    { year: "2024", event: "Serving 1.5M+ customers across 120+ countries" },
  ];

  const team = [
    { name: "Ron Stone", role: "Founder & CEO", avatar: "RS" },
    { name: "Sarah Johnson", role: "Chief Technology Officer", avatar: "SJ" },
    { name: "Michael Chen", role: "Chief Financial Officer", avatar: "MC" },
    { name: "Emma Williams", role: "Chief Product Officer", avatar: "EW" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-navy-light to-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-accent">Ron Stone Bank</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              We're on a mission to make banking simple, accessible, and fair for everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              Our <span className="text-gradient-gold">Story</span>
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Ron Stone Bank was founded in 2015 with a simple but powerful idea: banking should work for people, 
                not the other way around. Frustrated by hidden fees, poor customer service, and outdated technology, 
                our founders set out to build a bank that puts customers first.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Today, we serve over 1.5 million customers across 120+ countries. From sending money to family abroad 
                to managing multi-currency business accounts, we've become the trusted financial partner for individuals 
                and businesses who demand better.
              </p>
              <p className="text-lg leading-relaxed">
                But we're just getting started. Our vision is to create a world where everyone has access to the 
                financial tools they need to thrive, regardless of where they live or what currency they use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Our <span className="text-gradient-gold">Values</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Our <span className="text-gradient-gold">Journey</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8">
                <div className="flex-shrink-0 w-20">
                  <span className="font-bold text-accent text-lg">{milestone.year}</span>
                </div>
                <div className="flex-grow pb-8 border-l-2 border-accent/30 pl-6 relative">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-accent rounded-full" />
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Leadership <span className="text-gradient-gold">Team</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-foreground">{member.avatar}</span>
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience banking the way it should be. Open your free account in minutes.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold" asChild>
              <Link to="/signup">Open Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
