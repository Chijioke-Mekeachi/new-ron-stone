import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Smartphone, Check, AlertCircle, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const PushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    { id: 'transactions', label: 'Transaction Alerts', description: 'Get notified for all incoming and outgoing transfers', enabled: true },
    { id: 'security', label: 'Security Alerts', description: 'Login attempts, password changes, and suspicious activity', enabled: true },
    { id: 'balance', label: 'Low Balance Alerts', description: 'Notify when balance falls below threshold', enabled: true },
    { id: 'promotions', label: 'Offers & Updates', description: 'New features, promotions, and banking tips', enabled: false },
  ]);

  useEffect(() => {
    // Check if Push notifications are supported
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      setIsSubscribed(Notification.permission === 'granted');
    }
    
    // Load saved preferences
    const savedPrefs = localStorage.getItem('notificationPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const requestPermission = async () => {
    setIsLoading(true);
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setIsSubscribed(true);
        
        // Show a demo notification
        new Notification('Ron Stone Bank', {
          body: 'Push notifications enabled! You\'ll now receive important banking alerts.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
        
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive important banking alerts"
        });
      } else if (result === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to enable push notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreference = (id: string) => {
    const updated = preferences.map(pref => 
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    );
    setPreferences(updated);
    localStorage.setItem('notificationPreferences', JSON.stringify(updated));
    
    toast({
      title: "Preference Updated",
      description: "Your notification settings have been saved"
    });
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is how your banking alerts will appear.',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Push Notifications Not Supported</p>
            <p className="text-sm">Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Safari.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Toggle Section */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSubscribed ? 'bg-green-500/10' : 'bg-secondary'
            }`}>
              {isSubscribed ? (
                <Bell className="w-6 h-6 text-green-500" />
              ) : (
                <BellOff className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">Push Notifications</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Receive real-time alerts about your account activity
              </p>
              {isSubscribed && (
                <div className="flex items-center space-x-2 mt-2 text-green-500 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Notifications are enabled</span>
                </div>
              )}
            </div>
          </div>
          
          {!isSubscribed ? (
            <Button
              onClick={requestPermission}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Enable
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={sendTestNotification}
              variant="outline"
              size="sm"
            >
              Test Alert
            </Button>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      {isSubscribed && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-lg">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div 
                key={pref.id}
                className="flex items-center justify-between py-4 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <button
                  onClick={() => togglePreference(pref.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    pref.enabled ? 'bg-accent' : 'bg-secondary'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${
                    pref.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-secondary/30 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          <Smartphone className="w-4 h-4 inline mr-1" />
          Push notifications work on mobile and desktop devices. 
          You can manage permissions in your browser settings at any time.
        </p>
      </div>
    </div>
  );
};

export default PushNotifications;
