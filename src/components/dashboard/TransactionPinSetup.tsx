import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, Check, Lock, AlertTriangle } from "lucide-react";

const TransactionPinSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'view' | 'change' | 'create'>('view');

  // Check if user has a PIN
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = users.find((u: any) => u.email === user?.email);
  const hasPin = !!currentUser?.transactionPin;

  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast({ title: "Error", description: "PIN must be exactly 4 digits", variant: "destructive" });
      return;
    }
    
    if (newPin !== confirmPin) {
      toast({ title: "Error", description: "PINs do not match", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save PIN to localStorage
    const updatedUsers = users.map((u: any) => 
      u.email === user?.email ? { ...u, transactionPin: newPin } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setIsLoading(false);
    setMode('view');
    setNewPin("");
    setConfirmPin("");
    
    toast({ title: "Success", description: "Transaction PIN created successfully!" });
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPin !== currentUser?.transactionPin) {
      toast({ title: "Error", description: "Current PIN is incorrect", variant: "destructive" });
      return;
    }
    
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast({ title: "Error", description: "New PIN must be exactly 4 digits", variant: "destructive" });
      return;
    }
    
    if (newPin !== confirmPin) {
      toast({ title: "Error", description: "New PINs do not match", variant: "destructive" });
      return;
    }

    if (newPin === currentPin) {
      toast({ title: "Error", description: "New PIN must be different from current PIN", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update PIN in localStorage
    const updatedUsers = users.map((u: any) => 
      u.email === user?.email ? { ...u, transactionPin: newPin } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setIsLoading(false);
    setMode('view');
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    
    toast({ title: "Success", description: "Transaction PIN changed successfully!" });
  };

  if (mode === 'view') {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Transaction PIN</h3>
            <p className="text-sm text-muted-foreground">Secure your outgoing transfers</p>
          </div>
        </div>

        {hasPin ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Check className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-500">PIN Active</p>
                <p className="text-sm text-muted-foreground">Your transaction PIN is set up and active</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">PIN: ••••</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setMode('change')}>
                Change PIN
              </Button>
            </div>

            <div className="bg-accent/5 border border-accent/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Security Tip</p>
                  <p className="text-muted-foreground">Never share your transaction PIN with anyone, including bank staff.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-500">PIN Not Set</p>
                <p className="text-sm text-muted-foreground">Set up a transaction PIN to secure your transfers</p>
              </div>
            </div>

            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setMode('create')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Create Transaction PIN
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Create Transaction PIN</h3>
            <p className="text-sm text-muted-foreground">Set up a 4-digit PIN for transfers</p>
          </div>
        </div>

        <form onSubmit={handleCreatePin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New 4-Digit PIN</label>
            <div className="relative">
              <Input
                type={showNewPin ? "text" : "password"}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                className="h-12 text-center text-2xl tracking-[0.5em] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm PIN</label>
            <Input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="h-12 text-center text-2xl tracking-[0.5em]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMode('view');
                setNewPin("");
                setConfirmPin("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || newPin.length !== 4}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? "Creating..." : "Create PIN"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Change PIN mode
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Change Transaction PIN</h3>
          <p className="text-sm text-muted-foreground">Update your 4-digit PIN</p>
        </div>
      </div>

      <form onSubmit={handleChangePin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current PIN</label>
          <div className="relative">
            <Input
              type={showCurrentPin ? "text" : "password"}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="h-12 text-center text-2xl tracking-[0.5em] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPin(!showCurrentPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">New 4-Digit PIN</label>
          <div className="relative">
            <Input
              type={showNewPin ? "text" : "password"}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="h-12 text-center text-2xl tracking-[0.5em] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPin(!showNewPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confirm New PIN</label>
          <Input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="••••"
            maxLength={4}
            className="h-12 text-center text-2xl tracking-[0.5em]"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMode('view');
              setCurrentPin("");
              setNewPin("");
              setConfirmPin("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || currentPin.length !== 4 || newPin.length !== 4}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isLoading ? "Updating..." : "Update PIN"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionPinSetup;
