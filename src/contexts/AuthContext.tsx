import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  profilePicture?: string;
  phone?: string;
  address?: any;
  employment?: any;
  identification?: any;
  transactionPin?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isSigningUp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const signupLockRef = useRef(false);
  const signupAttemptsRef = useRef<{ [key: string]: number }>({});
  const isLoggingOutRef = useRef(false);
  

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data.session);

      if (data.session?.user) {
        fetchUserProfile(data.session.user.id);
      }

      setIsLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setSession(session);

        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);


  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return;
      }

      setUser({
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        accountNumber: data.account_number,
        balance: Number(data.balance),
        currency: data.currency,
        profilePicture: data.profile_picture,
        phone: data.phone,
        address: data.address,
        employment: data.employment,
        identification: data.identification,
        transactionPin: data.transaction_pin,
        isActive: data.is_active,
      });
    } catch (err) {
      console.error('Unexpected profile error:', err);
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      setIsSigningUp(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        return { success: false, error: 'Signup failed' };
      }

      // Create profile immediately
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        balance: 0,
        currency: 'USD',
        is_active: true,
      });

      toast.success(
        data.session
          ? 'Account created successfully!'
          : 'Check your email to confirm your account.'
      );

      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
      return { success: false, error: err.message };
    } finally {
      setIsSigningUp(false);
    }
  };


  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        return { success: false, error: 'Login failed' };
      }

      fetchUserProfile(data.user.id);

      toast.success('Login successful');
      // router.push('/dashboard');
     
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  };


  const logout = async () => {
    try {
      setUser(null);
      setSession(null);

      await supabase.auth.signOut();
      toast.success('Logged out');
    } catch (err) {
      toast.error('Logout failed');
    }
  };


  const updateBalance = async (amount: number) => {
    if (!user) {
      toast.error('You must be logged in to update your balance.');
      return;
    }

    if (!user.isActive) {
      toast.error('Your account is suspended. Cannot update balance.');
      return;
    }

    try {
      const newBalance = user.balance + amount;

      const { error } = await supabase
        .from('profiles')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, balance: newBalance });
      toast.success(`Balance updated to $${newBalance.toFixed(2)}`);
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Failed to update balance');
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.profilePicture) dbUpdates.profile_picture = updates.profilePicture;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);

    if (error) throw error;

    setUser({ ...user, ...updates });
    toast.success('Profile updated');
  };


  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      signup,
      logout,
      updateBalance,
      updateUser,
      isLoading,
      isSigningUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};