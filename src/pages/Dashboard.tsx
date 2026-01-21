import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { databaseService, type Transaction, type Card, type SavingsGoal, type Notification } from "@/lib/databaseService";
import { formatCurrency } from "@/lib/demoData";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Home,
  CreditCard,
  Send,
  ArrowDownToLine,
  PiggyBank,
  User,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Wallet,
  Moon,
  Sun,
  Download,
  Shield,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import TransactionExport from "@/components/dashboard/TransactionExport";
import PushNotifications from "@/components/dashboard/PushNotifications";
import TransferForm from "@/components/dashboard/TransferForm";
import TransactionPinSetup from "@/components/dashboard/TransactionPinSetup";
import PinVerificationModal from "@/components/dashboard/PinVerificationModal";

type DashboardSection = 'overview' | 'transactions' | 'transfer' | 'withdraw' | 'savings' | 'cards' | 'profile' | 'notifications' | 'support';

const Dashboard = () => {
  const { user, logout, updateUser, updateBalance } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [balance, setBalance] = useState(user?.balance || 25000);
  const [isLoading, setIsLoading] = useState({
    transactions: false,
    cards: false,
    savings: false,
    notifications: false,
    profile: false
  });

  // Loading and modal states
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    amount?: string;
  }>({ isOpen: false, title: '', message: '' });

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    recipientName: '',
    recipientAccount: '',
    amount: '',
    currency: 'USD',
    narrative: ''
  });

  // Withdraw form state
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    destination: 'bank',
    // Bank details
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    // Card details
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  // PIN verification for withdraw
  const [showWithdrawPinModal, setShowWithdrawPinModal] = useState(false);
  
  // Cards state
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardType, setNewCardType] = useState<'Virtual' | 'Physical'>('Virtual');

  // Profile state
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    },
    employment: user?.employment || {
      occupation: '',
      employer: '',
      incomeRange: '',
      sourceOfFunds: ''
    },
    identification: user?.identification || {
      type: '',
      number: '',
      issueDate: '',
      expiryDate: ''
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data on component mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchAllData();
      setBalance(user.balance);
      if (user.profilePicture) {
        setProfilePicture(user.profilePicture);
      }
    }
  }, [user?.id]);

  const fetchAllData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(prev => ({ ...prev, transactions: true }));
      const transactionsData = await databaseService.getTransactions(user.id);
      setTransactions(transactionsData);

      setIsLoading(prev => ({ ...prev, cards: true }));
      const cardsData = await databaseService.getCards(user.id);
      setUserCards(cardsData.map(card => ({
        id: card.id,
        type: card.type as 'Virtual' | 'Physical',
        number: `**** **** **** ${card.last_four}`,
        expires: card.expires,
        status: card.status as 'active' | 'frozen',
        last_four: card.last_four
      })));

      setIsLoading(prev => ({ ...prev, savings: true }));
      const savingsData = await databaseService.getSavingsGoals(user.id);
      setSavingsGoals(savingsData);

      setIsLoading(prev => ({ ...prev, notifications: true }));
      const notificationsData = await databaseService.getNotifications(user.id);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading({
        transactions: false,
        cards: false,
        savings: false,
        notifications: false,
        profile: false
      });
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        toast({ 
          title: "File too large", 
          description: "Please select an image under 5MB", 
          variant: "destructive" 
        });
        return;
      }

      setIsLoading(prev => ({ ...prev, profile: true }));
      const publicUrl = await databaseService.uploadProfilePicture(user.id, file);
      
      await updateUser({ profilePicture: publicUrl });
      setProfilePicture(publicUrl);
      
      toast({ 
        title: "Profile picture updated!", 
        description: "Your new profile picture has been saved." 
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleProfileUpdate = async (section: 'personal' | 'address' | 'employment' | 'identification') => {
    if (!user?.id) return;

    try {
      setIsLoading(prev => ({ ...prev, profile: true }));
      
      let updates: any = {};
      
      switch (section) {
        case 'personal':
          updates = {
            first_name: profileForm.firstName,
            last_name: profileForm.lastName,
            email: profileForm.email,
            phone: profileForm.phone
          };
          break;
        case 'address':
          updates = { address: profileForm.address };
          break;
        case 'employment':
          updates = { employment: profileForm.employment };
          break;
        case 'identification':
          updates = { identification: profileForm.identification };
          break;
      }

      await updateUser(updates);
      
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const menuItems = [
    { id: 'overview', label: t('dashboard.overview'), icon: Home },
    { id: 'transactions', label: t('dashboard.transactions'), icon: Wallet },
    { id: 'transfer', label: t('dashboard.transfer'), icon: Send },
    { id: 'withdraw', label: t('dashboard.withdraw'), icon: ArrowDownToLine },
    { id: 'savings', label: t('dashboard.savings'), icon: PiggyBank },
    { id: 'cards', label: t('dashboard.cards'), icon: CreditCard },
    { id: 'profile', label: t('dashboard.profile'), icon: User },
    { id: 'notifications', label: t('dashboard.notifications'), icon: Bell },
    { id: 'support', label: t('dashboard.support'), icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const amount = parseFloat(transferForm.amount);
    if (amount > balance) {
      toast({ title: "Insufficient funds", variant: "destructive" });
      return;
    }

    setIsTransferLoading(true);

    try {
      // Create transaction in database
      const newTransaction = await databaseService.createTransaction({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        type: 'debit',
        amount: amount,
        currency: transferForm.currency,
        status: 'pending',
        description: `Transfer to ${transferForm.recipientName}`,
        recipient_name: transferForm.recipientName,
        recipient_account: transferForm.recipientAccount,
        bank_name: transferForm.narrative,
        metadata: {
          narrative: transferForm.narrative
        }
      });

      // Update balance
      const newBalance = balance - amount;
      await updateBalance(-amount);
      setBalance(newBalance);

      // Update transactions list
      setTransactions(prev => [newTransaction, ...prev]);

      // Send notification
      await databaseService.createNotification({
        user_id: user.id,
        title: 'Transfer Initiated',
        message: `Your transfer of ${formatCurrency(amount, transferForm.currency)} to ${transferForm.recipientName} is being processed.`,
        type: 'transfer',
        read: false
      });

      setSuccessModal({
        isOpen: true,
        title: "Transfer Initiated!",
        message: `Money transfer to ${transferForm.recipientName} has been initiated.`,
        amount: formatCurrency(amount, transferForm.currency)
      });

      setTransferForm({ 
        recipientName: '', 
        recipientAccount: '', 
        amount: '', 
        currency: 'USD', 
        narrative: '' 
      });
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer failed",
        description: "Failed to process transfer",
        variant: "destructive"
      });
    } finally {
      setIsTransferLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawForm.amount);
    if (amount > balance) {
      toast({ title: "Insufficient funds", variant: "destructive" });
      return;
    }
    if (amount <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    // Show PIN verification modal
    setShowWithdrawPinModal(true);
  };

  const handleWithdrawPinVerified = async () => {
    setShowWithdrawPinModal(false);
    const amount = parseFloat(withdrawForm.amount);
    
    setIsWithdrawLoading(true);

    try {
      // Create transaction in database
      const newTransaction = await databaseService.createTransaction({
        user_id: user!.id,
        date: new Date().toISOString().split('T')[0],
        type: 'debit',
        amount: amount,
        currency: 'USD',
        status: 'pending',
        description: `Withdrawal to ${withdrawForm.destination}`,
        metadata: {
          destination: withdrawForm.destination,
          bankName: withdrawForm.bankName,
          accountNumber: withdrawForm.accountNumber,
          cardLastFour: withdrawForm.cardNumber.slice(-4)
        }
      });

      // Update balance
      const newBalance = balance - amount;
      await updateBalance(-amount);
      setBalance(newBalance);

      // Update transactions list
      setTransactions(prev => [newTransaction, ...prev]);

      // Send notification
      await databaseService.createNotification({
        user_id: user!.id,
        title: 'Withdrawal Processing',
        message: `Your withdrawal of ${formatCurrency(amount, 'USD')} is being processed.`,
        type: 'withdrawal',
        read: false
      });

      setSuccessModal({
        isOpen: true,
        title: "Withdrawal Processing!",
        message: `Your withdrawal is being processed and will be sent to your ${withdrawForm.destination === 'bank' ? 'bank account' : 'card'}`,
        amount: formatCurrency(amount, 'USD')
      });

      setWithdrawForm({ 
        amount: '', 
        destination: 'bank',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountHolderName: '',
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal failed",
        description: "Failed to process withdrawal",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawLoading(false);
    }
  };

  const toggleCardStatus = async (cardId: string) => {
    try {
      const card = userCards.find(c => c.id === cardId);
      if (!card) return;

      const newStatus = card.status === 'active' ? 'frozen' : 'active';
      const updatedCard = await databaseService.updateCardStatus(cardId, newStatus);
      
      setUserCards(prev => prev.map(c => 
        c.id === cardId ? { 
          ...c, 
          status: newStatus,
          last_four: updatedCard.last_four 
        } : c
      ));

      // Send notification
      await databaseService.createNotification({
        user_id: user!.id,
        title: `Card ${newStatus === 'frozen' ? 'Frozen' : 'Activated'}`,
        message: `Your ${card.type} card ending in ${card.number.slice(-4)} has been ${newStatus === 'frozen' ? 'frozen' : 'activated'}.`,
        type: 'card',
        read: false
      });

      toast({
        title: newStatus === 'frozen' ? "Card Frozen" : "Card Activated",
        description: `Your card has been ${newStatus === 'frozen' ? 'frozen' : 'activated'}.`
      });
    } catch (error) {
      console.error('Error updating card status:', error);
      toast({
        title: "Error",
        description: "Failed to update card status",
        variant: "destructive"
      });
    }
  };

  const requestNewCard = async () => {
    if (!user?.id) return;

    try {
      const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
      const expires = `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear() + 3).slice(-2)}`;
      
      const newCard = await databaseService.createCard({
        user_id: user.id,
        type: newCardType,
        last_four: lastFour,
        expires: expires,
        status: 'active'
      });

      const formattedCard = {
        id: newCard.id,
        type: newCardType,
        number: `**** **** **** ${lastFour}`,
        expires: expires,
        status: 'active' as const,
        last_four: lastFour
      };

      setUserCards(prev => [...prev, formattedCard]);
      setShowNewCardModal(false);

      // Send notification
      await databaseService.createNotification({
        user_id: user.id,
        title: 'New Card Requested',
        message: `Your ${newCardType} card ending in ${lastFour} has been requested.`,
        type: 'card',
        read: false
      });

      toast({
        title: "Card Requested",
        description: `Your new ${newCardType} card has been requested and will be ready shortly.`
      });
    } catch (error) {
      console.error('Error requesting card:', error);
      toast({
        title: "Request failed",
        description: "Failed to request new card",
        variant: "destructive"
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await databaseService.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary to-navy-light p-6 rounded-2xl text-primary-foreground">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-primary-foreground/70 text-sm">{t('dashboard.accountBalance')}</p>
                    <p className="text-3xl font-bold mt-1">
                      {showBalance ? formatCurrency(balance, user?.currency || 'USD') : '••••••'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-primary-foreground/70">
                  {t('dashboard.accountNumber')}: {user?.accountNumber}
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm">{t('dashboard.savingsBalance')}</p>
                  <PiggyBank className="w-5 h-5 text-accent" />
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0) || 5000, 
                    'USD'
                  )}
                </p>
                <p className="text-sm text-green-500 mt-1">+2.5% APY</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm">This Month</p>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(
                    transactions
                      .filter(tx => tx.type === 'credit')
                      .reduce((sum, tx) => sum + tx.amount, 0),
                    'USD'
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Income</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Send, label: t('dashboard.transfer'), section: 'transfer' as DashboardSection },
                { icon: ArrowDownToLine, label: t('dashboard.withdraw'), section: 'withdraw' as DashboardSection },
                { icon: CreditCard, label: t('dashboard.cards'), section: 'cards' as DashboardSection },
                { icon: PiggyBank, label: t('dashboard.savings'), section: 'savings' as DashboardSection },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(action.section)}
                  className="p-4 bg-card rounded-xl border border-border hover:border-accent/50 transition-all group"
                >
                  <action.icon className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm">{action.label}</p>
                </button>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{t('dashboard.recentTransactions')}</h3>
                {isLoading.transactions ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <button 
                    onClick={() => setActiveSection('transactions')}
                    className="text-accent text-sm hover:underline"
                  >
                    {t('dashboard.viewAll')}
                  </button>
                )}
              </div>
              {isLoading.transactions ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          {tx.type === 'credit' ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                        </p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {tx.status}
                          </span>
                          {getStatusIcon(tx.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            {/* Export Section */}
            <TransactionExport 
              transactions={transactions}
              userName={`${user?.firstName} ${user?.lastName}`}
              accountNumber={user?.accountNumber || ''}
            />
            
            {/* Transactions Table */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">{t('dashboard.transactions')}</h3>
                {isLoading.transactions && <LoadingSpinner size="sm" />}
              </div>
              {isLoading.transactions ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-muted-foreground font-medium">{t('dashboard.date')}</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">{t('dashboard.description')}</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">{t('dashboard.type')}</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">{t('dashboard.amount')}</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">{t('dashboard.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                          <td className="py-4">{tx.date}</td>
                          <td className="py-4">{tx.description}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {tx.type === 'credit' ? t('dashboard.credit') : t('dashboard.debit')}
                            </span>
                          </td>
                          <td className={`py-4 font-semibold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-red-500/10 text-red-500'
                              }`}>
                                {tx.status}
                              </span>
                              {getStatusIcon(tx.status)}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'transfer':
        return (
          <TransferForm 
            balance={balance}
            onTransferComplete={async (transfer) => {
              if (!user?.id) return;

              try {
                setIsTransferLoading(true);
                
                const newTransaction = await databaseService.createTransaction({
                  user_id: user.id,
                  date: new Date().toISOString().split('T')[0],
                  type: 'debit',
                  amount: transfer.amount,
                  currency: 'USD',
                  status: 'pending',
                  description: `Transfer to ${transfer.recipientName}`,
                  recipient_name: transfer.recipientName,
                  bank_name: transfer.bankName,
                  metadata: {
                    bankName: transfer.bankName,
                    swiftCode: transfer.swiftCode
                  }
                });
                
                setTransactions(prev => [newTransaction, ...prev]);
                const newBalance = balance - transfer.amount;
                setBalance(newBalance);
                await updateUser({ balance: newBalance });
                
                // Send notification
                await databaseService.createNotification({
                  user_id: user.id,
                  title: 'Transfer Initiated',
                  message: `Your transfer to ${transfer.recipientName} at ${transfer.bankName} is being processed.`,
                  type: 'transfer',
                  read: false
                });
                
                setSuccessModal({
                  isOpen: true,
                  title: "Transfer Initiated!",
                  message: `Your transfer to ${transfer.recipientName} at ${transfer.bankName} is being processed.`,
                  amount: formatCurrency(transfer.amount, 'USD')
                });
              } catch (error) {
                console.error('Transfer error:', error);
                toast({
                  title: "Transfer failed",
                  description: "Failed to process transfer",
                  variant: "destructive"
                });
              } finally {
                setIsTransferLoading(false);
              }
            }}
          />
        );

      case 'withdraw':
        return (
          <div className="max-w-xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">{t('dashboard.withdraw')}</h3>
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('dashboard.withdrawAmount')}</label>
                  <Input 
                    type="number"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                    placeholder="0.00"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('dashboard.destination')}</label>
                  <select 
                    value={withdrawForm.destination}
                    onChange={(e) => setWithdrawForm({...withdrawForm, destination: e.target.value})}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="bank">{t('dashboard.bankAccount')}</option>
                    <option value="card">{t('dashboard.card')}</option>
                  </select>
                </div>

                {/* Bank Details Form */}
                {withdrawForm.destination === 'bank' && (
                  <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
                    <h4 className="font-medium text-sm text-muted-foreground">Bank Account Details</h4>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bank Name</label>
                      <Input 
                        value={withdrawForm.bankName}
                        onChange={(e) => setWithdrawForm({...withdrawForm, bankName: e.target.value})}
                        placeholder="Enter bank name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                      <Input 
                        value={withdrawForm.accountHolderName}
                        onChange={(e) => setWithdrawForm({...withdrawForm, accountHolderName: e.target.value})}
                        placeholder="Enter account holder name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Number</label>
                      <Input 
                        value={withdrawForm.accountNumber}
                        onChange={(e) => setWithdrawForm({...withdrawForm, accountNumber: e.target.value})}
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Routing Number</label>
                      <Input 
                        value={withdrawForm.routingNumber}
                        onChange={(e) => setWithdrawForm({...withdrawForm, routingNumber: e.target.value})}
                        placeholder="Enter routing number"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Card Details Form */}
                {withdrawForm.destination === 'card' && (
                  <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
                    <h4 className="font-medium text-sm text-muted-foreground">Card Details</h4>
                    <div>
                      <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                      <Input 
                        value={withdrawForm.cardHolderName}
                        onChange={(e) => setWithdrawForm({...withdrawForm, cardHolderName: e.target.value})}
                        placeholder="Enter name on card"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <Input 
                        value={withdrawForm.cardNumber}
                        onChange={(e) => setWithdrawForm({...withdrawForm, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <Input 
                          value={withdrawForm.expiryDate}
                          onChange={(e) => setWithdrawForm({...withdrawForm, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <Input 
                          type="password"
                          value={withdrawForm.cvv}
                          onChange={(e) => setWithdrawForm({...withdrawForm, cvv: e.target.value})}
                          placeholder="***"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  disabled={isWithdrawLoading}
                >
                  {isWithdrawLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <ArrowDownToLine className="w-4 h-4 mr-2" />
                      {t('dashboard.processWithdraw')}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        );

      case 'savings':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-accent to-accent/70 p-6 rounded-2xl text-accent-foreground">
                <p className="text-accent-foreground/80 text-sm">{t('dashboard.savingsBalance')}</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(
                    savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0) || 5000, 
                    'USD'
                  )}
                </p>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border">
                <p className="text-muted-foreground text-sm">{t('dashboard.interestRate')}</p>
                <p className="text-3xl font-bold mt-1 text-green-500">
                  {savingsGoals[0]?.interest_rate || 2.5}%
                </p>
                <p className="text-sm text-muted-foreground">APY</p>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border">
                <p className="text-muted-foreground text-sm">{t('dashboard.totalEarned')}</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(
                    savingsGoals.reduce((sum, goal) => sum + (goal.current_amount * (goal.interest_rate || 2.5) / 100 / 12), 0) || 125,
                    'USD'
                  )}
                </p>
                <p className="text-sm text-muted-foreground">This year</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Savings Goals</h3>
                {isLoading.savings && <LoadingSpinner size="sm" />}
              </div>
              {isLoading.savings ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {(savingsGoals.length > 0 ? savingsGoals : [
                    { id: '1', name: 'Vacation Fund', current_amount: 2500, target_amount: 5000, interest_rate: 2.5 },
                    { id: '2', name: 'Emergency Fund', current_amount: 8000, target_amount: 10000, interest_rate: 2.5 },
                    { id: '3', name: 'New Car', current_amount: 3000, target_amount: 15000, interest_rate: 2.5 },
                  ]).map((goal) => (
                    <div key={goal.id} className="p-4 bg-secondary/30 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(goal.current_amount, 'USD')} / {formatCurrency(goal.target_amount, 'USD')}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{((goal.current_amount / goal.target_amount) * 100).toFixed(1)}% complete</span>
                        <span>{goal.interest_rate}% APY</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">{t('dashboard.cards')}</h3>
              <div className="flex items-center gap-2">
                {isLoading.cards && <LoadingSpinner size="sm" />}
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setShowNewCardModal(true)}
                  disabled={isLoading.cards}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Request New Card
                </Button>
              </div>
            </div>

            {isLoading.cards ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {userCards.map((card) => (
                  <div 
                    key={card.id} 
                    className={`relative p-6 rounded-2xl text-primary-foreground overflow-hidden transition-all ${
                      card.status === 'frozen' 
                        ? 'bg-gradient-to-br from-gray-500 to-gray-700 opacity-75' 
                        : 'bg-gradient-to-br from-primary to-navy-light'
                    }`}
                  >
                    <div className="absolute top-4 right-4">
                      <CreditCard className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-primary-foreground/70">{card.type} Card</p>
                      {card.status === 'frozen' && (
                        <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full">
                          Frozen
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-mono mt-4 tracking-wider">{card.number}</p>
                    <div className="flex justify-between items-end mt-6">
                      <div>
                        <p className="text-xs text-primary-foreground/70">{t('dashboard.expires')}</p>
                        <p className="font-medium">{card.expires}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 ${
                          card.status === 'frozen' ? 'border-blue-300 text-blue-200' : ''
                        }`}
                        onClick={() => toggleCardStatus(card.id)}
                      >
                        {card.status === 'active' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            {t('dashboard.freeze')}
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            {t('dashboard.unfreeze')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                {userCards.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No cards yet. Request your first card!</p>
                  </div>
                )}
              </div>
            )}

            {/* New Card Request Modal */}
            {showNewCardModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full">
                  <h3 className="font-bold text-xl mb-4">Request New Card</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Choose the type of card you'd like to request. Virtual cards are available instantly, 
                    while physical cards will be delivered to your registered address.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <button
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        newCardType === 'Virtual' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setNewCardType('Virtual')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          newCardType === 'Virtual' ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                        }`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Virtual Card</p>
                          <p className="text-sm text-muted-foreground">Instant access for online purchases</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        newCardType === 'Physical' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setNewCardType('Physical')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          newCardType === 'Physical' ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                        }`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Physical Card</p>
                          <p className="text-sm text-muted-foreground">Delivered to your address in 5-7 days</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowNewCardModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={requestNewCard}
                    >
                      Request Card
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent/30 group-hover:border-accent transition-colors duration-300">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent to-gold-light flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {user?.firstName[0]}{user?.lastName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading.profile}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    {isLoading.profile ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    disabled={isLoading.profile}
                  />
                </div>
                <div>
                  <p className="font-medium text-lg">{user?.firstName} {user?.lastName}</p>
                  <p className="text-muted-foreground text-sm">Click the camera icon to upload a new photo</p>
                  <p className="text-muted-foreground text-xs mt-1">Maximum file size: 5MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">{t('dashboard.personal')}</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('auth.firstName')}</label>
                    <Input 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('auth.lastName')}</label>
                    <Input 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
                  <Input 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    type="email" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('dashboard.phone')}</label>
                  <Input 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => handleProfileUpdate('personal')}
                  disabled={isLoading.profile}
                >
                  {isLoading.profile ? <LoadingSpinner size="sm" /> : t('dashboard.updateProfile')}
                </Button>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input 
                    value={profileForm.address?.street || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      address: {...profileForm.address, street: e.target.value}
                    })}
                    placeholder="123 Main Street" 
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input 
                      value={profileForm.address?.city || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        address: {...profileForm.address, city: e.target.value}
                      })}
                      placeholder="New York" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State/Province</label>
                    <Input 
                      value={profileForm.address?.state || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        address: {...profileForm.address, state: e.target.value}
                      })}
                      placeholder="NY" 
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
                    <Input 
                      value={profileForm.address?.zip || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        address: {...profileForm.address, zip: e.target.value}
                      })}
                      placeholder="10001" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select 
                      value={profileForm.address?.country || 'US'}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        address: {...profileForm.address, country: e.target.value}
                      })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => handleProfileUpdate('address')}
                  disabled={isLoading.profile}
                >
                  {isLoading.profile ? <LoadingSpinner size="sm" /> : 'Update Address'}
                </Button>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">Employment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Occupation</label>
                  <Input 
                    value={profileForm.employment?.occupation || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      employment: {...profileForm.employment, occupation: e.target.value}
                    })}
                    placeholder="Software Engineer" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Employer Name</label>
                  <Input 
                    value={profileForm.employment?.employer || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      employment: {...profileForm.employment, employer: e.target.value}
                    })}
                    placeholder="Company Name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Income Range</label>
                  <select 
                    value={profileForm.employment?.incomeRange || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      employment: {...profileForm.employment, incomeRange: e.target.value}
                    })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="">Select income range</option>
                    <option value="0-25000">$0 - $25,000</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000-75000">$50,000 - $75,000</option>
                    <option value="75000-100000">$75,000 - $100,000</option>
                    <option value="100000-150000">$100,000 - $150,000</option>
                    <option value="150000+">$150,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source of Funds</label>
                  <select 
                    value={profileForm.employment?.sourceOfFunds || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      employment: {...profileForm.employment, sourceOfFunds: e.target.value}
                    })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="">Select source</option>
                    <option value="salary">Salary/Employment</option>
                    <option value="business">Business Income</option>
                    <option value="investments">Investments</option>
                    <option value="inheritance">Inheritance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => handleProfileUpdate('employment')}
                  disabled={isLoading.profile}
                >
                  {isLoading.profile ? <LoadingSpinner size="sm" /> : 'Update Employment Info'}
                </Button>
              </div>
            </div>

            {/* Identification */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">Identification Documents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ID Type</label>
                  <select 
                    value={profileForm.identification?.type || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      identification: {...profileForm.identification, type: e.target.value}
                    })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="">Select ID type</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                    <option value="ssn">Social Security Number</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ID Number</label>
                  <Input 
                    type="password"
                    value={profileForm.identification?.number || ''}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      identification: {...profileForm.identification, number: e.target.value}
                    })}
                    placeholder="••••••••••" 
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Date</label>
                    <Input 
                      type="date"
                      value={profileForm.identification?.issueDate || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        identification: {...profileForm.identification, issueDate: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <Input 
                      type="date"
                      value={profileForm.identification?.expiryDate || ''}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        identification: {...profileForm.identification, expiryDate: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Your identification documents are encrypted and stored securely. We only use this information for verification purposes.
                  </p>
                </div>
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => handleProfileUpdate('identification')}
                  disabled={isLoading.profile}
                >
                  {isLoading.profile ? <LoadingSpinner size="sm" /> : 'Update ID Information'}
                </Button>
              </div>
            </div>

            {/* Transaction PIN Setup */}
            <TransactionPinSetup />

            {/* Preferences */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">{t('dashboard.preferences')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span>{t('dashboard.darkMode')}</span>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent' : 'bg-secondary'}`}
                  >
                    <div className={`w-5 h-5 bg-foreground rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5" />
                    <span>Email Notifications</span>
                  </div>
                  <button className="w-12 h-6 rounded-full transition-colors bg-accent">
                    <div className="w-5 h-5 bg-foreground rounded-full translate-x-6 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>SMS Alerts</span>
                  </div>
                  <button className="w-12 h-6 rounded-full transition-colors bg-accent">
                    <div className="w-5 h-5 bg-foreground rounded-full translate-x-6 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            {/* Push Notification Settings */}
            <PushNotifications />
            
            {/* Recent Notifications */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">{t('dashboard.notifications')}</h3>
                {isLoading.notifications && <LoadingSpinner size="sm" />}
              </div>
              {isLoading.notifications ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 rounded-xl border cursor-pointer hover:bg-secondary/50 transition-colors ${
                        notif.read ? 'border-border bg-secondary/30' : 'border-accent/30 bg-accent/5'
                      }`}
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{notif.title}</p>
                          <p className="text-muted-foreground text-sm mt-1">{notif.message}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                          {!notif.read && (
                            <span className="mt-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl mb-6">{t('dashboard.helpCenter')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-6 flex flex-col items-start">
                  <HelpCircle className="w-6 h-6 text-accent mb-2" />
                  <span className="font-medium">{t('dashboard.faq')}</span>
                  <span className="text-sm text-muted-foreground">Find quick answers</span>
                </Button>
                <Button variant="outline" className="h-auto p-6 flex flex-col items-start">
                  <Send className="w-6 h-6 text-accent mb-2" />
                  <span className="font-medium">{t('dashboard.contactSupport')}</span>
                  <span className="text-sm text-muted-foreground">Get help from our team</span>
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-light rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">RS</span>
            </div>
            <span className="text-lg font-bold">Ron Stone Bank</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as DashboardSection);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeSection === item.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold">{t('dashboard.welcome')}, {user.firstName}!</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <LanguageSelector />
              <button 
                onClick={() => {
                  setActiveSection('notifications');
                  // Mark all as read when clicking bell
                  notifications.forEach(async (n) => {
                    if (!n.read) {
                      await markNotificationAsRead(n.id);
                    }
                  });
                }}
                className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
              <button 
                onClick={() => setActiveSection('profile')}
                className="flex items-center space-x-2"
              >
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-accent/30 hover:border-accent transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                    <span className="text-sm font-bold text-accent-foreground">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title={successModal.title}
        message={successModal.message}
        amount={successModal.amount}
      />

      {/* Withdraw PIN Verification Modal */}
      <PinVerificationModal
        isOpen={showWithdrawPinModal}
        onClose={() => setShowWithdrawPinModal(false)}
        onVerified={handleWithdrawPinVerified}
        title="Verify Withdrawal"
        description="Enter your PIN to authorize this withdrawal"
      />
    </div>
  );
};

export default Dashboard;