import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  amount?: string;
}

const SuccessModal = ({ isOpen, onClose, title, message, amount }: SuccessModalProps) => {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowCheckmark(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowCheckmark(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Animated checkmark circle */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--accent) / 0.2)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={showCheckmark ? "0" : "283"}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          
          {amount && (
            <p className="text-3xl font-bold text-accent mb-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              {amount}
            </p>
          )}
          
          <p className="text-muted-foreground mb-6">{message}</p>

          <Button 
            onClick={onClose}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
