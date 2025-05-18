// Define the recommendation interface
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'saving' | 'investing' | 'budgeting' | 'debt' | 'general';
  impact: number;
  confidence?: number;  // 0-100% confidence level
  steps?: string[];
}

// AI Recommendation Engine
export class RecommendationEngine {
  analyzeSpendingPatterns(transactions: any[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Sample logic for spending categories analysis
    const categorySpending = this.getCategorySpending(transactions);
    const highSpendingCategories = this.findHighSpendingCategories(categorySpending);
    
    // Generate savings recommendations for high-spending categories
    highSpendingCategories.forEach(category => {
      recommendations.push({
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `Reduce ${category.name} expenses`,
        description: `You're spending more on ${category.name} than most people with similar income. Consider reducing your spending in this category.`,
        type: 'saving',
        impact: category.amount * 0.2, // Suggest 20% reduction
        steps: [
          `Set a budget for ${category.name} that is 20% less than your current spending`,
          `Track your ${category.name} expenses weekly`,
          `Look for alternatives or ways to reduce costs in this category`
        ]
      });
    });
    
    return recommendations;
  }
  
  analyzeIncomeTrends(transactions: any[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Sample income trend analysis
    const incomeData = this.getMonthlyIncome(transactions, 6); // Last 6 months
    const averageIncome = incomeData.reduce((sum, month) => sum + month.amount, 0) / incomeData.length;
    
    // If income is inconsistent, suggest income stability strategies
    const incomeVariance = this.calculateVariance(incomeData.map(m => m.amount));
    if (incomeVariance > 0.2 * averageIncome) { // High variance
      recommendations.push({
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: 'Stabilize your income',
        description: 'Your income varies significantly month to month. Consider ways to create more income stability.',
        type: 'general',
        impact: 0, // Hard to quantify impact
        steps: [
          'Look for steady side income opportunities',
          'Build an emergency fund of at least 3 months of expenses',
          'Create a budget based on your lowest monthly income'
        ]
      });
    }
    
    return recommendations;
  }
  
  analyzeInvestmentOpportunities(accounts: any[], transactions: any[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Check if user has savings but no investments
    const savingsAccounts = accounts.filter(a => a.type === 'SAVINGS');
    const investmentAccounts = accounts.filter(a => a.type === 'INVESTMENT');
    
    const totalSavings = savingsAccounts.reduce((sum, account) => sum + account.balance, 0);
    
    if (totalSavings > 10000 && investmentAccounts.length === 0) {
      recommendations.push({
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: 'Start investing your savings',
        description: 'You have significant savings that could be earning higher returns through investments.',
        type: 'investing',
        impact: totalSavings * 0.05, // Assume 5% annual return difference
        steps: [
          'Research investment options like index funds or ETFs',
          'Consider opening a brokerage account',
          'Start with a small percentage of your savings to get comfortable with investing'
        ]
      });
    }
    
    return recommendations;
  }
  
  // Helper methods
  private getCategorySpending(transactions: any[]): { name: string, amount: number }[] {
    // Group transactions by category and sum amounts
    const categories = {};
    
    transactions
      .filter(t => t.amount < 0) // Only consider expenses
      .forEach(transaction => {
        const category = transaction.category;
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category] += Math.abs(transaction.amount);
      });
    
    // Convert to array
    return Object.keys(categories).map(name => ({
      name,
      amount: categories[name]
    }));
  }
  
  private findHighSpendingCategories(categorySpending: { name: string, amount: number }[]): { name: string, amount: number }[] {
    // Sort categories by amount (highest first)
    const sortedCategories = [...categorySpending].sort((a, b) => b.amount - a.amount);
    
    // Return top 3 categories as "high spending"
    // In a real system, this would be more sophisticated and compare to benchmarks
    return sortedCategories.slice(0, 3);
  }
  
  private getMonthlyIncome(transactions: any[], months: number): { month: string, amount: number }[] {
    const result = [];
    const now = new Date();
    
    for (let i = 0; i < months; i++) {
      const targetMonth = new Date(now);
      targetMonth.setMonth(now.getMonth() - i);
      
      const monthIncome = transactions
        .filter(t => {
          const txDate = new Date(t.date);
          return txDate.getMonth() === targetMonth.getMonth() && 
                 txDate.getFullYear() === targetMonth.getFullYear() &&
                 t.amount > 0;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        month: targetMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
        amount: monthIncome
      });
    }
    
    return result;
  }
  
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return variance;
  }
}