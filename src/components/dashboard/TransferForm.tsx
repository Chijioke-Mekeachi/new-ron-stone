import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Shield,
  Building2,
  ChevronRight,
  Lock,
  Info
} from "lucide-react";
import { formatCurrency } from "@/lib/demoData";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TransferFormProps {
  balance: number;
  onTransferComplete: (transaction: {
    recipientName: string;
    amount: number;
    bankName: string;
    accountNumber: string;
  }) => void;
}

type VerificationStatus = 'idle' | 'verifying' | 'verified' | 'warning' | 'error';
type TransferStep = 'form' | 'confirmation' | 'processing' | 'complete';

const US_BANKS = [
  { name: 'Chase Bank', routingPrefix: '021' },
  { name: 'Bank of America', routingPrefix: '026' },
  { name: 'Wells Fargo', routingPrefix: '121' },
  { name: 'Citibank', routingPrefix: '021' },
  { name: 'US Bank', routingPrefix: '091' },
  { name: 'PNC Bank', routingPrefix: '043' },
  { name: 'Capital One', routingPrefix: '056' },
  { name: 'TD Bank', routingPrefix: '031' },
  { name: 'Fifth Third Bank', routingPrefix: '042' },
  { name: 'Regions Bank', routingPrefix: '062' },
];

const TransferForm = ({ balance, onTransferComplete }: TransferFormProps) => {
  const [step, setStep] = useState<TransferStep>('form');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [maskedName, setMaskedName] = useState('');
  
  const [form, setForm] = useState({
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
    recipientName: '',
    amount: '',
    memo: '',
    transferSpeed: 'ach',
    authorized: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateRoutingNumber = (routing: string) => {
    if (routing.length !== 9) return false;
    // ABA routing number checksum validation
    const digits = routing.split('').map(Number);
    const checksum = 
      3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      1 * (digits[2] + digits[5] + digits[8]);
    return checksum % 10 === 0;
  };

  const handleVerifyAccount = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.bankName) newErrors.bankName = 'Please select a bank';
    if (!form.routingNumber || form.routingNumber.length !== 9) {
      newErrors.routingNumber = 'Enter a valid 9-digit routing number';
    } else if (!validateRoutingNumber(form.routingNumber)) {
      newErrors.routingNumber = 'Invalid routing number';
    }
    if (!form.accountNumber || form.accountNumber.length < 8) {
      newErrors.accountNumber = 'Enter a valid account number';
    }
    if (!form.recipientName) newErrors.recipientName = 'Enter recipient name';
    if (!form.amount || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    } else if (parseFloat(form.amount) > balance) {
      newErrors.amount = 'Insufficient funds';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setVerificationStatus('verifying');

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate different verification outcomes based on account number
    const lastDigit = parseInt(form.accountNumber.slice(-1));
    if (lastDigit === 0) {
      setVerificationStatus('error');
    } else if (lastDigit === 9) {
      setVerificationStatus('warning');
      // Generate masked name
      const nameParts = form.recipientName.split(' ');
      setMaskedName(`${nameParts[0][0]}. ${nameParts[nameParts.length - 1][0]}.`);
    } else {
      setVerificationStatus('verified');
      const nameParts = form.recipientName.split(' ');
      setMaskedName(`${nameParts[0][0]}. ${nameParts[nameParts.length - 1][0]}.`);
    }
  };

  const handleProceedToConfirmation = () => {
    if (verificationStatus === 'verified' || verificationStatus === 'warning') {
      setStep('confirmation');
    }
  };

  const handleConfirmTransfer = async () => {
    if (!form.authorized) {
      setErrors({ authorized: 'Please authorize this transfer' });
      return;
    }

    setStep('processing');

    // Simulate transfer processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    setStep('complete');
    
    onTransferComplete({
      recipientName: form.recipientName,
      amount: parseFloat(form.amount),
      bankName: form.bankName,
      accountNumber: form.accountNumber
    });
  };

  const handleNewTransfer = () => {
    setStep('form');
    setVerificationStatus('idle');
    setForm({
      bankName: '',
      routingNumber: '',
      accountNumber: '',
      accountType: 'checking',
      recipientName: '',
      amount: '',
      memo: '',
      transferSpeed: 'ach',
      authorized: false
    });
    setErrors({});
    setMaskedName('');
  };

  const maskAccountNumber = (num: string) => {
    return `****${num.slice(-4)}`;
  };

  if (step === 'complete') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Transfer Initiated</h3>
          <p className="text-muted-foreground mb-6">
            Your transfer of {formatCurrency(parseFloat(form.amount), 'USD')} to {form.recipientName} has been initiated.
          </p>
          <div className="bg-secondary/30 rounded-xl p-4 mb-6 text-sm">
            <p className="text-muted-foreground">
              {form.transferSpeed === 'ach' ? 
                'ACH transfers typically take 1-3 business days to complete.' :
                'Wire transfers are typically processed within 24 hours.'
              }
            </p>
          </div>
          <Button onClick={handleNewTransfer} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Make Another Transfer
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <LoadingSpinner size="lg" />
          <h3 className="text-xl font-bold mt-6 mb-2">Processing Transfer</h3>
          <p className="text-muted-foreground">
            Please wait while we securely process your transfer...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-accent" />
            <h3 className="font-bold text-xl">Review Transfer Details</h3>
          </div>

          {/* Transfer Summary */}
          <div className="space-y-4 mb-6">
            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-2xl font-bold">{formatCurrency(parseFloat(form.amount), 'USD')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">{form.recipientName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium">{form.bankName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Account</span>
                <span className="font-mono">{maskAccountNumber(form.accountNumber)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Speed</span>
                <span className="font-medium">
                  {form.transferSpeed === 'ach' ? 'ACH (1-3 days)' : 'Wire (Same day)'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Warnings */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Transfers may not be reversible. Only send money to people you trust.
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg">
              <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                We'll never show full recipient details for your security.
              </p>
            </div>
          </div>

          {/* Authorization Checkbox */}
          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.authorized}
                onChange={(e) => setForm({ ...form, authorized: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-input accent-accent"
              />
              <span className="text-sm">
                I authorize this transfer and confirm that the recipient details are correct. 
                I understand that this transaction may not be reversible.
              </span>
            </label>
            {errors.authorized && (
              <p className="text-red-500 text-sm mt-2">{errors.authorized}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setStep('form')}
            >
              Go Back
            </Button>
            <Button
              onClick={handleConfirmTransfer}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Confirm Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-card rounded-2xl border border-border p-8">
        <div className="flex items-center space-x-3 mb-2">
          <Building2 className="w-6 h-6 text-accent" />
          <h3 className="font-bold text-xl">Send Money</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Enter recipient bank details to initiate a secure transfer
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleVerifyAccount(); }} className="space-y-5">
          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <select
              value={form.bankName}
              onChange={(e) => {
                const bank = US_BANKS.find(b => b.name === e.target.value);
                setForm({ 
                  ...form, 
                  bankName: e.target.value,
                  routingNumber: bank ? bank.routingPrefix + '000000' : ''
                });
                setVerificationStatus('idle');
              }}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
            >
              <option value="">Select a bank</option>
              {US_BANKS.map(bank => (
                <option key={bank.name} value={bank.name}>{bank.name}</option>
              ))}
            </select>
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          {/* Routing & Account Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ABA Routing Number</label>
              <Input
                value={form.routingNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setForm({ ...form, routingNumber: value });
                  setVerificationStatus('idle');
                }}
                placeholder="9 digits"
                maxLength={9}
                className="font-mono"
              />
              {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <Input
                type="password"
                value={form.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 17);
                  setForm({ ...form, accountNumber: value });
                  setVerificationStatus('idle');
                }}
                placeholder="••••••••"
                maxLength={17}
              />
              {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Account Type</label>
            <div className="flex space-x-4">
              {['checking', 'savings'].map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value={type}
                    checked={form.accountType === type}
                    onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                    className="accent-accent"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Name</label>
            <Input
              value={form.recipientName}
              onChange={(e) => {
                setForm({ ...form, recipientName: e.target.value });
                setVerificationStatus('idle');
              }}
              placeholder="Full name as it appears on account"
            />
            {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
          </div>

          {/* Amount & Transfer Speed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transfer Speed</label>
              <select
                value={form.transferSpeed}
                onChange={(e) => setForm({ ...form, transferSpeed: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background"
              >
                <option value="ach">ACH (1-3 days) - Free</option>
                <option value="wire">Wire (Same day) - $25</option>
              </select>
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Memo (Optional)
              <span className="text-muted-foreground font-normal ml-1">- visible to recipient</span>
            </label>
            <Input
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="Payment for..."
              maxLength={100}
            />
          </div>

          {/* Verification Status */}
          {verificationStatus !== 'idle' && (
            <div className={`p-4 rounded-xl border ${
              verificationStatus === 'verifying' ? 'border-border bg-secondary/30' :
              verificationStatus === 'verified' ? 'border-green-500/30 bg-green-500/10' :
              verificationStatus === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
              'border-red-500/30 bg-red-500/10'
            }`}>
              <div className="flex items-center space-x-3">
                {verificationStatus === 'verifying' && (
                  <>
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    <span className="text-muted-foreground">Verifying account details...</span>
                  </>
                )}
                {verificationStatus === 'verified' && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <span className="text-green-700 dark:text-green-400 font-medium">Account details verified</span>
                      {maskedName && (
                        <span className="text-muted-foreground ml-2">({maskedName})</span>
                      )}
                    </div>
                  </>
                )}
                {verificationStatus === 'warning' && (
                  <>
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                        Unable to fully verify account
                      </span>
                      <p className="text-sm text-muted-foreground">Please confirm details before proceeding</p>
                    </div>
                  </>
                )}
                {verificationStatus === 'error' && (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <span className="text-red-700 dark:text-red-400 font-medium">Account verification failed</span>
                      <p className="text-sm text-muted-foreground">Please check the account details and try again</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start space-x-2 text-xs text-muted-foreground">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Only send money to people you trust. Ron Stone Bank will never ask you to send money for prizes or to verify your account.</p>
          </div>

          {/* Submit Buttons */}
          <div className="space-y-3">
            {verificationStatus === 'idle' || verificationStatus === 'error' ? (
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Verify Account
              </Button>
            ) : verificationStatus === 'verifying' ? (
              <Button disabled className="w-full">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleProceedToConfirmation}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Continue to Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;
