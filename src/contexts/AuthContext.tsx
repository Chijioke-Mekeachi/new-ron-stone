import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (!mounted) return;

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          
          // If there's a refresh token error, clear auth state
          if (error.message?.includes('Invalid Refresh Token')) {
            console.log('Clearing invalid refresh token...');
            await supabase.auth.signOut();
          }
        }
        
        if (mounted) {
          setSession(session);
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);
      setSession(session);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          setIsLoading(false);
          // Clear any stored signup attempts on logout
          signupAttemptsRef.current = {};
          break;
          
        case 'USER_UPDATED':
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
          break;
          
        case 'INITIAL_SESSION':
          // Session initialized
          break;
          
        default:
          if (mounted) setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, retryCount = 0): Promise<void> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Profile not found
        if (error.code === 'PGRST116') {
          if (retryCount < MAX_RETRIES) {
            console.log(`Profile not found for ${userId}, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
            
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
            return fetchUserProfile(userId, retryCount + 1);
          }
          
          console.log('Profile not found after retries. User may need to complete registration.');
          toast.error('Profile not found. Please contact support if this persists.');
        } else {
          console.error('Error fetching user profile:', error);
          toast.error('Error loading profile');
        }
        return;
      }

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
          isActive: data.is_active,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
    // Prevent concurrent signups
    if (signupLockRef.current) {
      return { 
        success: false, 
        error: 'Signup already in progress. Please wait.' 
      };
    }

    // Rate limiting by IP and email (simple client-side)
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    // Clean old attempts
    Object.keys(signupAttemptsRef.current).forEach(key => {
      if (parseInt(key) < oneHourAgo) {
        delete signupAttemptsRef.current[key];
      }
    });

    const recentAttempts = Object.values(signupAttemptsRef.current).reduce((sum, count) => sum + count, 0);
    
    if (recentAttempts >= 5) {
      toast.error('Too many signup attempts. Please wait an hour before trying again.');
      return {
        success: false,
        error: 'Too many signup attempts. Please try again later.'
      };
    }

    // Track this attempt
    signupAttemptsRef.current[now.toString()] = (signupAttemptsRef.current[now.toString()] || 0) + 1;

    signupLockRef.current = true;
    setIsSigningUp(true);

    try {
      console.log(`Signup attempt for: ${email}`);

      // Clear any existing session first
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.log('No existing session to clear');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            signup_timestamp: new Date().toISOString(),
          },
        },
      });

      if (error) {
        // Handle rate limit error
        if (error.status === 429) {
          toast.error('Too many requests. Please wait 30 minutes before trying again.');
          return { 
            success: false, 
            error: 'Too many signup attempts. Please wait and try again later.' 
          };
        }
        
        // Handle already registered
        if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
          toast.error('This email is already registered. Try logging in instead.');
          return { 
            success: false, 
            error: 'This email is already registered. Please login instead.' 
          };
        }
        
        // Handle invalid email
        if (error.message?.includes('Invalid email')) {
          toast.error('Please enter a valid email address.');
          return { 
            success: false, 
            error: 'Please enter a valid email address.' 
          };
        }
        
        // Handle weak password
        if (error.message?.includes('password')) {
          toast.error('Password must be at least 6 characters long.');
          return { 
            success: false, 
            error: 'Password must be at least 6 characters long.' 
          };
        }
        
        // Handle refresh token error
        if (error.message?.includes('Invalid Refresh Token')) {
          console.log('Refresh token error during signup, clearing auth state');
          try {
            await supabase.auth.signOut();
          } catch (e) {
            // Ignore signout errors
          }
          
          toast.error('Session error. Please try again.');
          return { 
            success: false, 
            error: 'Session error. Please refresh the page and try again.' 
          };
        }
        
        // Generic error
        console.error('Signup error:', error);
        toast.error('Signup failed. Please try again.');
        return { 
          success: false, 
          error: error.message || 'Signup failed. Please try again.' 
        };
      }

      if (data.user) {
        // Show success message
        if (data.session) {
          // Auto-confirmed (email confirmations disabled)
          toast.success('Account created successfully!');
        } else {
          // Email confirmation required
          toast.success('Check your email to confirm your account.');
        }

        // Wait for database trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // If auto-signed in, fetch profile
        if (data.session) {
          setSession(data.session);
          await fetchUserProfile(data.user.id);
        }

        return { success: true };
      }

      return { 
        success: false, 
        error: 'Signup process did not complete.' 
      };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        toast.error('Network error. Please check your connection.');
        return { 
          success: false, 
          error: 'Network error. Please check your connection and try again.' 
        };
      }
      
      toast.error('An unexpected error occurred.');
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      // Reset signup lock with delay
      setTimeout(() => {
        signupLockRef.current = false;
        setIsSigningUp(false);
      }, 3000);
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

      if (error) {
        // Handle rate limiting
        if (error.status === 429) {
          toast.error('Too many login attempts. Please wait before trying again.');
          return { 
            success: false, 
            error: 'Too many login attempts. Please wait and try again.' 
          };
        }
        
        // Handle invalid credentials
        if (error.message?.includes('Invalid login credentials')) {
          toast.error('Email or password is incorrect.');
          return { 
            success: false, 
            error: 'Email or password is incorrect.' 
          };
        }
        
        // Handle email not confirmed
        if (error.message?.includes('Email not confirmed')) {
          toast.error('Please check your email to confirm your account.');
          return { 
            success: false, 
            error: 'Please confirm your email address before logging in.' 
          };
        }
        
        // Handle refresh token error
        if (error.message?.includes('Invalid Refresh Token')) {
          console.log('Refresh token error during login');
          try {
            await supabase.auth.signOut();
          } catch (e) {
            // Ignore
          }
          
          toast.error('Session error. Please refresh the page and try again.');
          return { 
            success: false, 
            error: 'Session error. Please refresh the page and try again.' 
          };
        }
        
        // Generic error
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        
        // Check if user is active
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('id', data.user.id)
          .single();
        
        if (profile && !profile.is_active) {
          toast.error('Your account is suspended. Please contact support.');
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'Account is suspended. Please contact support.' 
          };
        }
        
        toast.success('Login successful!');
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
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
    if (!user) {
      toast.error('You must be logged in to update your profile.');
      return;
    }

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
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update profile');
      throw error;
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