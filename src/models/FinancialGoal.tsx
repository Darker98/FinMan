// Define the financial goal interface
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;  // ISO date string
  createdAt: string;  // ISO date string
  description?: string;
  category?: string;
}

// GoalFactory - Factory for creating different types of financial goals
export class GoalFactory {
  createEmergencyFundGoal(
    targetAmount: number,
    currentAmount: number,
    targetDate: string
  ): FinancialGoal {
    return {
      id: `goal-${Date.now()}`,
      name: 'Emergency Fund',
      targetAmount,
      currentAmount,
      targetDate,
      createdAt: new Date().toISOString(),
      description: 'Build an emergency fund to cover 3-6 months of expenses.',
      category: 'Saving'
    };
  }
  
  createVacationGoal(
    name: string,
    targetAmount: number,
    currentAmount: number,
    targetDate: string,
    description?: string
  ): FinancialGoal {
    return {
      id: `goal-${Date.now()}`,
      name,
      targetAmount,
      currentAmount,
      targetDate,
      createdAt: new Date().toISOString(),
      description: description || `Save for a vacation to ${name}.`,
      category: 'Vacation'
    };
  }
  
  createDebtPayoffGoal(
    name: string,
    targetAmount: number,
    currentAmount: number,
    targetDate: string
  ): FinancialGoal {
    return {
      id: `goal-${Date.now()}`,
      name,
      targetAmount,
      currentAmount,
      targetDate,
      createdAt: new Date().toISOString(),
      description: `Pay off ${name}.`,
      category: 'Debt Payoff'
    };
  }
  
  createPurchaseGoal(
    name: string,
    targetAmount: number,
    currentAmount: number,
    targetDate: string
  ): FinancialGoal {
    return {
      id: `goal-${Date.now()}`,
      name,
      targetAmount,
      currentAmount,
      targetDate,
      createdAt: new Date().toISOString(),
      description: `Save to purchase ${name}.`,
      category: 'Purchase'
    };
  }
  
  createCustomGoal(
    name: string,
    targetAmount: number,
    currentAmount: number,
    targetDate: string,
    description?: string,
    category?: string
  ): FinancialGoal {
    return {
      id: `goal-${Date.now()}`,
      name,
      targetAmount,
      currentAmount,
      targetDate,
      createdAt: new Date().toISOString(),
      description,
      category: category || 'Other'
    };
  }
}

// GoalTracker - Tracks progress towards financial goals
export class GoalTracker {
  calculateProgress(goal: FinancialGoal): number {
    return (goal.currentAmount / goal.targetAmount) * 100;
  }
  
  isGoalOnTrack(goal: FinancialGoal): boolean {
    const targetDate = new Date(goal.targetDate);
    const createdDate = new Date(goal.createdAt);
    const currentDate = new Date();
    
    // Calculate elapsed time as a fraction of total time
    const totalTimespan = targetDate.getTime() - createdDate.getTime();
    const elapsedTimespan = currentDate.getTime() - createdDate.getTime();
    const timeFraction = elapsedTimespan / totalTimespan;
    
    // Calculate progress as a fraction of target
    const progressFraction = goal.currentAmount / goal.targetAmount;
    
    // If progress percentage >= time percentage, goal is on track
    return progressFraction >= timeFraction;
  }
  
  calculateMonthlyContributionNeeded(goal: FinancialGoal): number {
    const targetDate = new Date(goal.targetDate);
    const currentDate = new Date();
    
    // If target date is in the past, return remaining amount
    if (targetDate <= currentDate) {
      return goal.targetAmount - goal.currentAmount;
    }
    
    // Calculate months remaining
    const monthsRemaining = 
      (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (targetDate.getMonth() - currentDate.getMonth());
    
    // Calculate amount still needed
    const amountNeeded = goal.targetAmount - goal.currentAmount;
    
    // Return monthly contribution needed
    return amountNeeded / Math.max(1, monthsRemaining);
  }
  
  getGoalPriorities(goals: FinancialGoal[]): FinancialGoal[] {
    // Sort goals by:
    // 1. Goals that are not on track (higher priority)
    // 2. Goals with closer target dates
    return [...goals].sort((a, b) => {
      const aOnTrack = this.isGoalOnTrack(a);
      const bOnTrack = this.isGoalOnTrack(b);
      
      // Prioritize goals that are not on track
      if (aOnTrack && !bOnTrack) return 1;
      if (!aOnTrack && bOnTrack) return -1;
      
      // If both are on track or both are off track, sort by target date
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });
  }
}