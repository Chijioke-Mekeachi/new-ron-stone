import { supabase } from './supabaseClient';

export interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  recipient_name?: string;
  recipient_account?: string;
  bank_name?: string;
  category?: string;
  metadata?: any;
}

export interface Card {
  id: string;
  type: 'Virtual' | 'Physical';
  last_four: string;
  expires: string;
  status: 'active' | 'frozen';
}

export interface SavingsGoal {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number;
  interest_rate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export const databaseService = {
  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createTransaction(transaction: Omit<Transaction, 'id'> & { user_id: string }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Cards
  async getCards(userId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCard(card: Omit<Card, 'id'> & { user_id: string }) {
    const { data, error } = await supabase
      .from('cards')
      .insert([card])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCardStatus(cardId: string, status: 'active' | 'frozen') {
    const { data, error } = await supabase
      .from('cards')
      .update({ status })
      .eq('id', cardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Savings Goals
  async getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSavingsGoal(goal: Omit<SavingsGoal, 'id'> & { user_id: string }) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([goal])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSavingsGoal(goalId: string, updates: Partial<SavingsGoal>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createNotification(notification: Omit<Notification, 'id'> & { user_id: string }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Profile Picture
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  // Export data
  async exportTransactions(userId: string, format: 'csv' | 'pdf' = 'csv') {
    const transactions = await this.getTransactions(userId);
    
    if (format === 'csv') {
      const headers = ['Date', 'Description', 'Type', 'Amount', 'Currency', 'Status', 'Recipient'];
      const rows = transactions.map(t => [
        t.date,
        t.description,
        t.type,
        t.amount,
        t.currency,
        t.status,
        t.recipient_name || ''
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    return transactions;
  }
};

// Create storage bucket for profile pictures
export const initializeStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'profile-pictures');
    
    if (!bucketExists) {
      await supabase.storage.createBucket('profile-pictures', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};