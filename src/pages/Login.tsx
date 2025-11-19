import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/LanguageSelector";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(email, password)) {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold-light rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">RS</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Ron Stone Bank</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground text-center mb-2">
            {t('auth.login.title')}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {t('auth.login.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.email')}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.password')}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {t('auth.login')}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="text-accent hover:underline">
              {t('auth.signupLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
