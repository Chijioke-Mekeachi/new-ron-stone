import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Blog", href: "#blog" },
    ],
    products: [
      { name: "Personal Banking", href: "#personal" },
      { name: "Business Banking", href: "#business" },
      { name: "Cards", href: "#cards" },
      { name: "Investments", href: "#investments" },
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "Security", href: "#security" },
      { name: "Status", href: "#status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Licenses", href: "#licenses" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10" id="support">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-light rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">RS</span>
              </div>
              <span className="text-xl font-bold">Ron Stone Bank</span>
            </div>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Your trusted partner in modern digital banking. Empowering millions worldwide with secure, 
              fast, and borderless financial services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-primary-foreground/10 pt-10 pb-8">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-semibold mb-1">Email Us</p>
                <a href="mailto:support@ronstonebank.com" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  support@ronstonebank.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-semibold mb-1">Call Us</p>
                <a href="tel:+1-800-RON-BANK" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  +1 (800) RON-BANK
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-semibold mb-1">Visit Us</p>
                <p className="text-primary-foreground/70">
                  123 Banking Street, Finance District, New York, NY 10004
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-primary-foreground/60 text-sm">
            <p className="mb-2">
              Ron Stone Bank is a licensed financial institution. Deposits are insured up to applicable limits.
            </p>
            <p>
              © {currentYear} Ron Stone Bank. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
