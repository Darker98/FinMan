// Define the basic transaction interface
export interface Transaction {
  id: string;
  description: string;
  amount: number;  // Positive for income, negative for expenses
  date: string;  // ISO date string
  category: string;
  accountId: string;
  tags?: string[];
  notes?: string;
}

// TransactionFactory - A factory for creating different transaction types
export class TransactionFactory {
  createIncomeTransaction(
    description: string,
    amount: number,
    date: string,
    category: string,
    accountId: string,
    tags?: string[],
    notes?: string
  ): Transaction {
    if (amount <= 0) throw new Error('Income amount must be positive');
    
    return {
      id: `tx-${Date.now()}`,
      description,
      amount,  // Positive amount for income
      date,
      category,
      accountId,
      tags,
      notes
    };
  }
  
  createExpenseTransaction(
    description: string,
    amount: number,
    date: string,
    category: string,
    accountId: string,
    tags?: string[],
    notes?: string
  ): Transaction {
    if (amount <= 0) throw new Error('Expense amount must be positive');
    
    return {
      id: `tx-${Date.now()}`,
      description,
      amount: -amount,  // Negative amount for expenses
      date,
      category,
      accountId,
      tags,
      notes
    };
  }
  
  createTransferTransaction(
    amount: number,
    date: string,
    fromAccountId: string,
    toAccountId: string,
    notes?: string
  ): Transaction[] {
    if (amount <= 0) throw new Error('Transfer amount must be positive');
    
    // Create two transactions: one withdrawal and one deposit
    const withdrawal: Transaction = {
      id: `tx-${Date.now()}-from`,
      description: `Transfer to account ${toAccountId}`,
      amount: -amount, // Negative for withdrawal
      date,
      category: 'Transfer',
      accountId: fromAccountId,
      notes
    };
    
    const deposit: Transaction = {
      id: `tx-${Date.now()}-to`,
      description: `Transfer from account ${fromAccountId}`,
      amount: amount, // Positive for deposit
      date,
      category: 'Transfer',
      accountId: toAccountId,
      notes
    };
    
    return [withdrawal, deposit];
  }
}

// TransactionCategorizer - Categorizes transactions based on description
export class TransactionCategorizer {
  private categoryRules: { [key: string]: RegExp[] } = {
    'Groceries': [
      /grocery/i, /supermarket/i, /food/i, /market/i,
      /walmart/i, /target/i, /kroger/i, /safeway/i, /whole foods/i
    ],
    'Dining Out': [
      /restaurant/i, /cafe/i, /coffee/i, /bar/i, /pub/i,
      /mcdonald/i, /burger/i, /pizza/i, /subway/i, /starbucks/i
    ],
    'Transportation': [
      /gas/i, /fuel/i, /uber/i, /lyft/i, /taxi/i, /parking/i,
      /transit/i, /train/i, /bus/i, /airline/i, /flight/i
    ],
    'Utilities': [
      /electric/i, /water/i, /gas bill/i, /utility/i, /phone/i,
      /internet/i, /cable/i, /netflix/i, /spotify/i
    ],
    'Rent': [
      /rent/i, /lease/i, /apartment/i, /housing/i
    ],
    'Entertainment': [
      /movie/i, /theater/i, /cinema/i, /concert/i, /ticket/i,
      /game/i, /subscription/i, /netflix/i, /spotify/i, /hulu/i
    ],
    'Shopping': [
      /amazon/i, /ebay/i, /store/i, /mall/i, /shop/i,
      /clothing/i, /electronics/i
    ],
    'Healthcare': [
      /doctor/i, /hospital/i, /clinic/i, /medical/i, /pharmacy/i,
      /prescription/i, /health/i
    ],
    'Income': [
      /salary/i, /deposit/i, /income/i, /paycheck/i, /interest/i,
      /dividend/i, /refund/i, /payment received/i
    ]
  };
  
  categorizeTransaction(description: string): string {
    for (const [category, patterns] of Object.entries(this.categoryRules)) {
      if (patterns.some(pattern => pattern.test(description))) {
        return category;
      }
    }
    
    // Default category if no match is found
    return 'Other';
  }
  
  addCategoryRule(category: string, pattern: RegExp): void {
    if (!this.categoryRules[category]) {
      this.categoryRules[category] = [];
    }
    this.categoryRules[category].push(pattern);
  }
}

// TransactionAnalyzer - Analyzes transaction data to extract insights
export class TransactionAnalyzer {
  getMonthlySpending(transactions: Transaction[], month: number, year: number): number {
    const expenses = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && 
             txDate.getFullYear() === year &&
             tx.amount < 0;
    });
    
    return Math.abs(expenses.reduce((sum, tx) => sum + tx.amount, 0));
  }
  
  getMonthlyIncome(transactions: Transaction[], month: number, year: number): number {
    const income = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && 
             txDate.getFullYear() === year &&
             tx.amount > 0;
    });
    
    return income.reduce((sum, tx) => sum + tx.amount, 0);
  }
  
  getSpendingByCategory(transactions: Transaction[], month: number, year: number): { [category: string]: number } {
    const expenses = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && 
             txDate.getFullYear() === year &&
             tx.amount < 0;
    });
    
    return expenses.reduce((categories, tx) => {
      const category = tx.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += Math.abs(tx.amount);
      return categories;
    }, {} as { [category: string]: number });
  }
  
  compareMonthlySpending(transactions: Transaction[], month1: number, year1: number, month2: number, year2: number): { [category: string]: number } {
    const spending1 = this.getSpendingByCategory(transactions, month1, year1);
    const spending2 = this.getSpendingByCategory(transactions, month2, year2);
    
    const result: { [category: string]: number } = {};
    
    // Get all unique categories
    const allCategories = [...new Set([...Object.keys(spending1), ...Object.keys(spending2)])];
    
    // Calculate percentage changes
    allCategories.forEach(category => {
      const amount1 = spending1[category] || 0;
      const amount2 = spending2[category] || 0;
      
      if (amount1 === 0) {
        result[category] = 100; // New category with 100% increase
      } else {
        const percentChange = ((amount2 - amount1) / amount1) * 100;
        result[category] = percentChange;
      }
    });
    
    return result;
  }
}