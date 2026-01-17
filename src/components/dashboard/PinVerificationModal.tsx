import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, X, Eye, EyeOff, AlertTriangle, Lock } from "lucide-react";

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  title?: string;
  description?: string;
}

const PinVerificationModal = ({ 
  isOpen, 
  onClose, 
  onVerified,
  title = "Enter Transaction PIN",
  description = "Please enter your 4-digit transaction PIN to continue"
}: PinVerificationModalProps) => {
  const { user } = useAuth();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Get user's stored PIN
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = users.find((u: any) => u.email === user?.email);
  const hasPin = !!currentUser?.transactionPin;

  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockTimer, isLocked]);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError("");
    }
  }, [isOpen]);

  const handleVerify = () => {
    if (isLocked) return;

    if (pin === currentUser?.transactionPin) {
      setError("");
      setAttempts(0);
      onVerified();
      setPin("");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30); // Lock for 30 seconds
        setError("Too many failed attempts. Please wait 30 seconds.");
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
      setPin("");
    }
  };

  const handleClose = () => {
    setPin("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {!hasPin ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-500">No PIN Set</p>
                <p className="text-sm text-muted-foreground">
                  You need to set up a transaction PIN before making transfers or withdrawals.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleClose}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Go to Profile Settings
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Transaction PIN</label>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && pin.length === 4) {
                      handleVerify();
                    }
                  }}
                  placeholder="••••"
                  maxLength={4}
                  disabled={isLocked}
                  className="h-14 text-center text-2xl tracking-[0.5em] pr-12 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Lock Timer */}
            {isLocked && (
              <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Retry in {lockTimer} seconds
                </p>
              </div>
            )}

            {/* Security Note */}
            <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
              <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your PIN is encrypted and never shared. For security, accounts are temporarily locked after 3 failed attempts.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={pin.length !== 4 || isLocked}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Verify PIN
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinVerificationModal;
