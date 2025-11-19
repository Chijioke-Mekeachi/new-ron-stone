export interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export const getDemoTransactions = (userId: string): Transaction[] => {
  const stored = localStorage.getItem('transactions');
  if (stored) {
    const allTransactions = JSON.parse(stored);
    return allTransactions[userId] || getDefaultTransactions();
  }
  return getDefaultTransactions();
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

const getDefaultTransactions = (): Transaction[] => [
  {
    id: '1',
    date: new Date().toISOString(),
    type: 'credit',
    amount: 5000.00,
    status: 'completed',
    description: 'Salary Payment'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'debit',
    amount: 150.00,
    status: 'completed',
    description: 'Online Shopping'
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString(),
    type: 'credit',
    amount: 1200.00,
    status: 'completed',
    description: 'Freelance Project'
  },
  {
    id: '4',
    date: new Date(Date.now() - 259200000).toISOString(),
    type: 'debit',
    amount: 85.50,
    status: 'completed',
    description: 'Restaurant'
  },
  {
    id: '5',
    date: new Date(Date.now() - 345600000).toISOString(),
    type: 'debit',
    amount: 200.00,
    status: 'pending',
    description: 'Utility Bill'
  },
  {
    id: '6',
    date: new Date(Date.now() - 432000000).toISOString(),
    type: 'credit',
    amount: 3500.00,
    status: 'completed',
    description: 'Investment Return'
  },
  {
    id: '7',
    date: new Date(Date.now() - 518400000).toISOString(),
    type: 'debit',
    amount: 120.00,
    status: 'completed',
    description: 'Gas Station'
  },
  {
    id: '8',
    date: new Date(Date.now() - 604800000).toISOString(),
    type: 'credit',
    amount: 800.00,
    status: 'completed',
    description: 'Refund'
  },
];
