export interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  recipient?: string;
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const demoTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    type: 'credit',
    amount: 5000.00,
    currency: 'USD',
    status: 'completed',
    description: 'Salary Payment'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    type: 'debit',
    amount: 150.00,
    currency: 'USD',
    status: 'completed',
    description: 'Online Shopping - Amazon'
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    type: 'credit',
    amount: 1200.00,
    currency: 'USD',
    status: 'completed',
    description: 'Freelance Project Payment'
  },
  {
    id: '4',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    type: 'debit',
    amount: 85.50,
    currency: 'USD',
    status: 'completed',
    description: 'Restaurant - The Italian Place'
  },
  {
    id: '5',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    type: 'debit',
    amount: 200.00,
    currency: 'USD',
    status: 'pending',
    description: 'Utility Bill - Electric'
  },
  {
    id: '6',
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
    type: 'credit',
    amount: 3500.00,
    currency: 'USD',
    status: 'completed',
    description: 'Investment Return'
  },
  {
    id: '7',
    date: new Date(Date.now() - 518400000).toISOString().split('T')[0],
    type: 'debit',
    amount: 120.00,
    currency: 'USD',
    status: 'completed',
    description: 'Gas Station - Shell'
  },
  {
    id: '8',
    date: new Date(Date.now() - 604800000).toISOString().split('T')[0],
    type: 'credit',
    amount: 800.00,
    currency: 'USD',
    status: 'completed',
    description: 'Refund - Electronics Store'
  },
  {
    id: '9',
    date: new Date(Date.now() - 691200000).toISOString().split('T')[0],
    type: 'debit',
    amount: 45.99,
    currency: 'USD',
    status: 'completed',
    description: 'Netflix Subscription'
  },
  {
    id: '10',
    date: new Date(Date.now() - 777600000).toISOString().split('T')[0],
    type: 'debit',
    amount: 299.00,
    currency: 'USD',
    status: 'completed',
    description: 'Transfer to John Doe'
  },
];

export const getDemoTransactions = (userId: string): Transaction[] => {
  const stored = localStorage.getItem('transactions');
  if (stored) {
    const allTransactions = JSON.parse(stored);
    return allTransactions[userId] || demoTransactions;
  }
  return demoTransactions;
};

export const addTransaction = (userId: string, transaction: Transaction) => {
  const stored = localStorage.getItem('transactions');
  const allTransactions = stored ? JSON.parse(stored) : {};
  
  if (!allTransactions[userId]) {
    allTransactions[userId] = [];
  }
  
  allTransactions[userId].unshift(transaction);
  localStorage.setItem('transactions', JSON.stringify(allTransactions));
};
