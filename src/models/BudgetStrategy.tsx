import { Transaction } from './Transaction';

// BudgetStrategy interface - Strategy Pattern for different budgeting methods
export interface BudgetStrategy {
  name: string;
  description: string;
  allocateFunds: (income: number) => { [category: string]: number };
  evaluateBudget: (transactions: Transaction[], month: number, year: number) => { status: string, details: any };
}

// Fifty-thirty-twenty budget strategy (50% needs, 30% wants, 20% savings)
export class FiftyThirtyTwentyStrategy implements BudgetStrategy {
  name = 'FIFTY_THIRTY_TWENTY';
  description = '50% needs, 30% wants, 20% savings and debt repayment';
  
  allocateFunds(income: number): { [category: string]: number } {
    return {
      needs: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2
    };
  }
  
  evaluateBudget(transactions: Transaction[], month: number, year: number): { status: string, details: any } {
    // Get all transactions for the specified month
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && txDate.getFullYear() === year;
    });
    
    // Calculate total income
    const income = monthTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Get target allocations
    const budget = this.allocateFunds(income);
    
    // Categorize expenses
    const needsCategories = ['Rent', 'Utilities', 'Groceries', 'Transportation', 'Healthcare', 'Insurance', 'Debt Payment'];
    const wantsCategories = ['Dining Out', 'Entertainment', 'Shopping', 'Travel', 'Hobbies', 'Subscriptions'];
    const savingsCategories = ['Savings', 'Investment', 'Retirement'];
    
    // Calculate actual spending by category type
    const needs = monthTransactions
      .filter(tx => tx.amount < 0 && needsCategories.includes(tx.category))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    const wants = monthTransactions
      .filter(tx => tx.amount < 0 && wantsCategories.includes(tx.category))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    const savings = monthTransactions
      .filter(tx => tx.amount < 0 && savingsCategories.includes(tx.category))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    // Calculate percentages of actual spending
    const totalSpending = needs + wants + savings;
    const needsPercent = totalSpending > 0 ? (needs / totalSpending) * 100 : 0;
    const wantsPercent = totalSpending > 0 ? (wants / totalSpending) * 100 : 0;
    const savingsPercent = totalSpending > 0 ? (savings / totalSpending) * 100 : 0;
    
    // Determine status
    let status = 'on_track';
    if (needs > budget.needs) status = 'over_needs';
    if (wants > budget.wants) status = 'over_wants';
    if (savings < budget.savings) status = 'under_savings';
    
    return {
      status,
      details: {
        income,
        budget,
        actual: { needs, wants, savings },
        percentages: { needs: needsPercent, wants: wantsPercent, savings: savingsPercent }
      }
    };
  }
}

// Zero-based budget strategy (allocate every dollar)
export class ZeroBasedStrategy implements BudgetStrategy {
  name = 'ZERO_BASED';
  description = 'Allocate every dollar of income until you reach zero';
  categories: { [key: string]: number } = {
    'Rent': 0.30,
    'Utilities': 0.05,
    'Groceries': 0.10,
    'Transportation': 0.10,
    'Entertainment': 0.05,
    'Dining Out': 0.05,
    'Savings': 0.15,
    'Healthcare': 0.05,
    'Debt Payment': 0.10,
    'Other': 0.05
  };
  
  allocateFunds(income: number): { [category: string]: number } {
    const allocation: { [category: string]: number } = {};
    
    for (const [category, percentage] of Object.entries(this.categories)) {
      allocation[category] = income * percentage;
    }
    
    return allocation;
  }
  
  evaluateBudget(transactions: Transaction[], month: number, year: number): { status: string, details: any } {
    // Get all transactions for the specified month
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && txDate.getFullYear() === year;
    });
    
    // Calculate total income
    const income = monthTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Get target allocations
    const budget = this.allocateFunds(income);
    
    // Calculate actual spending by category
    const actualSpending: { [category: string]: number } = {};
    for (const category of Object.keys(this.categories)) {
      actualSpending[category] = 0;
    }
    
    // Sum up actual spending by category
    monthTransactions
      .filter(tx => tx.amount < 0)
      .forEach(tx => {
        const category = tx.category in actualSpending ? tx.category : 'Other';
        actualSpending[category] += Math.abs(tx.amount);
      });
    
    // Determine overspending categories
    const overspentCategories = Object.keys(budget).filter(
      category => actualSpending[category] > budget[category]
    );
    
    // Determine status
    const status = overspentCategories.length > 0 ? 'over_budget' : 'on_track';
    
    return {
      status,
      details: {
        income,
        budget,
        actual: actualSpending,
        overspentCategories
      }
    };
  }
  
  // Update category allocations
  updateCategoryAllocation(category: string, percentage: number): void {
    if (percentage < 0 || percentage > 1) {
      throw new Error('Percentage must be between 0 and 1');
    }
    
    this.categories[category] = percentage;
    
    // Ensure percentages still sum to 1
    const totalPercentage = Object.values(this.categories).reduce((sum, p) => sum + p, 0);
    if (Math.abs(totalPercentage - 1) > 0.01) {
      // Normalize if not close to 1
      for (const cat in this.categories) {
        this.categories[cat] = this.categories[cat] / totalPercentage;
      }
    }
  }
}

// Envelope budget strategy (cash allocation)
export class EnvelopeStrategy implements BudgetStrategy {
  name = 'ENVELOPE';
  description = 'Divide cash into different categories (envelopes)';
  envelopes: { name: string, amount: number }[] = [];
  
  constructor() {
    // Initialize with default envelopes
    this.envelopes = [
      { name: 'Groceries', amount: 0 },
      { name: 'Entertainment', amount: 0 },
      { name: 'Dining Out', amount: 0 },
      { name: 'Transportation', amount: 0 },
      { name: 'Shopping', amount: 0 },
      { name: 'Misc', amount: 0 }
    ];
  }
  
  allocateFunds(income: number): { [category: string]: number } {
    // This method should be called with specific envelope amounts
    // But for default implementation, split evenly
    const allocation: { [category: string]: number } = {};
    const amountPerEnvelope = income / this.envelopes.length;
    
    this.envelopes.forEach(envelope => {
      envelope.amount = amountPerEnvelope;
      allocation[envelope.name] = amountPerEnvelope;
    });
    
    return allocation;
  }
  
  // Custom method to set specific envelope amounts
  setEnvelopeAmounts(envelopeAmounts: { name: string, amount: number }[]): void {
    envelopeAmounts.forEach(envAmount => {
      const envelope = this.envelopes.find(e => e.name === envAmount.name);
      if (envelope) {
        envelope.amount = envAmount.amount;
      } else {
        this.envelopes.push({ name: envAmount.name, amount: envAmount.amount });
      }
    });
  }
  
  evaluateBudget(transactions: Transaction[], month: number, year: number): { status: string, details: any } {
    // Get all transactions for the specified month
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && txDate.getFullYear() === year;
    });
    
    // Current envelope amounts
    const envelopeBudget: { [name: string]: number } = {};
    this.envelopes.forEach(env => {
      envelopeBudget[env.name] = env.amount;
    });
    
    // Calculate actual spending by envelope category
    const envelopeSpending: { [name: string]: number } = {};
    this.envelopes.forEach(env => {
      envelopeSpending[env.name] = 0;
    });
    
    // Sum up actual spending by category
    monthTransactions
      .filter(tx => tx.amount < 0)
      .forEach(tx => {
        // Map transaction category to envelope
        let envelopeName = tx.category;
        if (!envelopeSpending.hasOwnProperty(envelopeName)) {
          envelopeName = 'Misc'; // Default to Misc if no matching envelope
        }
        
        envelopeSpending[envelopeName] += Math.abs(tx.amount);
      });
    
    // Determine overspent envelopes
    const overspentEnvelopes = Object.keys(envelopeBudget).filter(
      envelope => envelopeSpending[envelope] > envelopeBudget[envelope]
    );
    
    // Determine status
    const status = overspentEnvelopes.length > 0 ? 'over_budget' : 'on_track';
    
    return {
      status,
      details: {
        budget: envelopeBudget,
        actual: envelopeSpending,
        overspentEnvelopes,
        remainingAmounts: Object.keys(envelopeBudget).reduce((result, env) => {
          result[env] = envelopeBudget[env] - (envelopeSpending[env] || 0);
          return result;
        }, {})
      }
    };
  }
  
  // Add a new envelope
  addEnvelope(name: string, amount: number): void {
    if (this.envelopes.some(e => e.name === name)) {
      throw new Error(`Envelope with name ${name} already exists`);
    }
    
    this.envelopes.push({ name, amount });
  }
  
  // Remove an envelope
  removeEnvelope(name: string): void {
    this.envelopes = this.envelopes.filter(e => e.name !== name);
  }
}