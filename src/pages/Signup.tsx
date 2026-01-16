import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/LanguageSelector";
import { Check, ChevronRight, ChevronLeft, User, Phone, Lock, Shield } from "lucide-react";

const countries = [
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "NG", name: "Nigeria", dialCode: "+234" },
  { code: "GH", name: "Ghana", dialCode: "+233" },
  { code: "KE", name: "Kenya", dialCode: "+254" },
  { code: "ZA", name: "South Africa", dialCode: "+27" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "BR", name: "Brazil", dialCode: "+55" },
  { code: "MX", name: "Mexico", dialCode: "+52" },
  { code: "JP", name: "Japan", dialCode: "+81" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
];

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("US");
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const { signup } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const selectedCountry = countries.find(c => c.code === country);

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Contact Details", icon: Phone },
    { number: 3, title: "Security", icon: Lock },
    { number: 4, title: "Transaction PIN", icon: Shield },
  ];

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: "Error", description: "Please enter your full name", variant: "destructive" });
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast({ title: "Error", description: "Please enter a valid email", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!phoneNumber.trim() || phoneNumber.length < 7) {
      toast({ title: "Error", description: "Please enter a valid phone number", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return false;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (transactionPin.length !== 4 || !/^\d+$/.test(transactionPin)) {
      toast({ title: "Error", description: "PIN must be exactly 4 digits", variant: "destructive" });
      return false;
    }
    if (transactionPin !== confirmPin) {
      toast({ title: "Error", description: "PINs do not match", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep4()) return;

    // Store additional user data
    const userData = {
      phoneNumber: `${selectedCountry?.dialCode}${phoneNumber}`,
      country,
      transactionPin,
    };

    if (signup(email, password, firstName, lastName)) {
      // Store PIN separately in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === email);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('users', JSON.stringify(users));
      }

      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "User already exists",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              <p className="text-muted-foreground text-sm">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('auth.firstName')}
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('auth.lastName')}
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.email')}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-12"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Contact Details</h2>
              <p className="text-muted-foreground text-sm">How can we reach you?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="w-24 h-12 px-3 rounded-md border border-input bg-muted flex items-center justify-center text-sm font-medium">
                  {selectedCountry?.dialCode}
                </div>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456789"
                  className="flex-1 h-12"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Create Password</h2>
              <p className="text-muted-foreground text-sm">Secure your account</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.password')}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('auth.confirmPassword')}
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Transaction PIN</h2>
              <p className="text-muted-foreground text-sm">Create a 4-digit PIN for transactions</p>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Security Notice</p>
                  <p className="text-xs text-muted-foreground">
                    Your transaction PIN will be required when sending money. Never share it with anyone.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                4-Digit PIN
              </label>
              <Input
                type="password"
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                className="h-12 text-center text-2xl tracking-[0.5em]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm PIN
              </label>
              <Input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                className="h-12 text-center text-2xl tracking-[0.5em]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-lg">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold-light rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">RS</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Ron Stone Bank</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-0.5 mx-1 transition-all ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-accent hover:underline">
              {t('auth.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
