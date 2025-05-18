// State Pattern implementation for different financial states
// Each state changes the system's behavior and recommendations

// Base FinancialState interface
export interface FinancialState {
  name: string;
  greeting: string;
  getPriorities(): string[];
  getRecommendationTypes(): string[];
}

// BudgetingState: Focus on tracking and reducing expenses
export class BudgetingState implements FinancialState {
  name = 'BUDGETING';
  greeting = 'Let\'s focus on your budget!';
  
  getPriorities(): string[] {
    return [
      'Track all expenses carefully',
      'Identify areas to cut spending',
      'Create and stick to a monthly budget',
      'Avoid unnecessary purchases'
    ];
  }
  
  getRecommendationTypes(): string[] {
    return ['budgeting', 'saving'];
  }
}

// SavingState: Focus on building up savings
export class SavingState implements FinancialState {
  name = 'SAVING';
  greeting = 'Building your savings!';
  
  getPriorities(): string[] {
    return [
      'Build emergency fund',
      'Save for short-term goals',
      'Increase income through side hustles',
      'Automate savings transfers'
    ];
  }
  
  getRecommendationTypes(): string[] {
    return ['saving', 'budgeting'];
  }
}

// InvestingState: Focus on investment growth
export class InvestingState implements FinancialState {
  name = 'INVESTING';
  greeting = 'Grow your investments!';
  
  getPriorities(): string[] {
    return [
      'Maximize retirement contributions',
      'Diversify investment portfolio',
      'Research new investment opportunities',
      'Regular portfolio rebalancing'
    ];
  }
  
  getRecommendationTypes(): string[] {
    return ['investing', 'saving', 'general'];
  }
}

// DebtReductionState: Focus on paying down debt
export class DebtReductionState implements FinancialState {
  name = 'DEBT_REDUCTION';
  greeting = 'Let\'s tackle your debt!';
  
  getPriorities(): string[] {
    return [
      'Pay high-interest debt first',
      'Negotiate lower interest rates',
      'Consider debt consolidation',
      'Stop accumulating new debt'
    ];
  }
  
  getRecommendationTypes(): string[] {
    return ['debt', 'budgeting', 'saving'];
  }
}

// FinancialStateContext: Manages state transitions and context
export class FinancialStateContext {
  private currentState: FinancialState;
  
  constructor(initialState: FinancialState = new BudgetingState()) {
    this.currentState = initialState;
  }
  
  changeState(newState: FinancialState): void {
    this.currentState = newState;
  }
  
  getCurrentState(): FinancialState {
    return this.currentState;
  }
  
  // Returns recommendations prioritized based on current state
  getRecommendations(recommendations: any[]): any[] {
    const priorityTypes = this.currentState.getRecommendationTypes();
    
    // Sort recommendations by priority type
    return [...recommendations].sort((a, b) => {
      const aTypeIndex = priorityTypes.indexOf(a.type);
      const bTypeIndex = priorityTypes.indexOf(b.type);
      
      // If both types are in priority list
      if (aTypeIndex !== -1 && bTypeIndex !== -1) {
        return aTypeIndex - bTypeIndex;
      }
      
      // If only a's type is in priority list
      if (aTypeIndex !== -1) return -1;
      
      // If only b's type is in priority list
      if (bTypeIndex !== -1) return 1;
      
      // If neither type is in priority list
      return 0;
    });
  }
  
  // Returns the greeting based on current state
  getGreeting(): string {
    return this.currentState.greeting;
  }
  
  // Returns the priorities based on current state
  getPriorities(): string[] {
    return this.currentState.getPriorities();
  }
}