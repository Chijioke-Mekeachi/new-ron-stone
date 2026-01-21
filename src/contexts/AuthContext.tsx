import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const userData: User = {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          accountNumber: data.account_number,
          balance: parseFloat(data.balance),
          currency: data.currency,
          profilePicture: data.profile_picture,
          phone: data.phone,
          address: data.address,
          employment: data.employment,
          identification: data.identification,
          transactionPin: data.transaction_pin,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateBalance = async (amount: number) => {
    if (!user) return;

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
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.balance !== undefined) updateData.balance = updates.balance;
      if (updates.profilePicture !== undefined) updateData.profile_picture = updates.profilePicture;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.employment !== undefined) updateData.employment = updates.employment;
      if (updates.identification !== undefined) updateData.identification = updates.identification;
      if (updates.transactionPin !== undefined) updateData.transaction_pin = updates.transactionPin;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Error updating user:', error);
    }
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
      isLoading 
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