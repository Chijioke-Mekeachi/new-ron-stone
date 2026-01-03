import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: t('nav.personal'), href: "/personal" },
    { name: t('nav.business'), href: "/business" },
    { name: t('nav.features'), href: "#features" },
    { name: t('nav.about'), href: "/about" },
    { name: t('nav.support'), href: "/support" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-light rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">RS</span>
            </div>
            <span className="text-xl font-bold text-foreground">Ron Stone Bank</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.href.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-foreground/80 hover:text-accent transition-colors duration-200 font-medium"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            {user ? (
              <>
                <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
                  <Link to="/dashboard">{t('nav.dashboard')}</Link>
                </Button>
                <Button 
                  onClick={handleLogout}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold"
                >
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-foreground hover:text-accent" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold" asChild>
                  <Link to="/signup">{t('nav.openAccount')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border py-4 space-y-4">
            {navLinks.map((link) => (
              link.href.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block px-4 py-2 text-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-4 py-2 text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="px-4 space-y-2">
              {user ? (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/dashboard">{t('nav.dashboard')}</Link>
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">{t('nav.login')}</Link>
                  </Button>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link to="/signup">{t('nav.openAccount')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
