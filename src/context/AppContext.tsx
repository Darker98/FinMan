import React, { createContext, useContext, useReducer } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Landmark, 
  PiggyBank, 
  DollarSign,
  TrendingUp 
} from 'lucide-react';

import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { FinancialGoal } from '../models/FinancialGoal';
import { Recommendation } from '../models/Recommendation';
import { BudgetStrategy } from '../models/BudgetStrategy';
import { FinancialState } from '../models/FinancialState';

// Import the strategy implementations
import { 
  FiftyThirtyTwentyStrategy, 
  ZeroBasedStrategy, 
  EnvelopeStrategy 
} from '../models/BudgetStrategy';

// Import the state implementations
import {
  BudgetingState,
  SavingState,
  InvestingState,
  DebtReductionState
} from '../models/FinancialState';

// Create the application state
interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  goals: FinancialGoal[];
  recommendations: Recommendation[];
  budgetStrategy: BudgetStrategy;
  currentFinancialState: FinancialState;
}

// Initial sample data
const initialState: AppState = {
  accounts: [
    {
      id: 'acc-1',
      name: 'Checking Account',
      type: 'CHECKING',
      accountNumber: 'xxxx-1234',
      balance: 2580.45,
      iconType: 'Wallet',
      changePercent: -3.2,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'acc-2',
      name: 'Savings Account',
      type: 'SAVINGS',
      accountNumber: 'xxxx-5678',
      balance: 15750.00,
      iconType: 'PiggyBank',
      changePercent: 2.5,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'acc-3',
      name: 'Investment Portfolio',
      type: 'INVESTMENT',
      accountNumber: 'xxxx-9012',
      balance: 32145.78,
      iconType: 'TrendingUp',
      changePercent: 7.8,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'acc-4',
      name: 'Credit Card',
      type: 'CREDIT_CARD',
      accountNumber: 'xxxx-3456',
      balance: -1245.36,
      iconType: 'CreditCard',
      changePercent: 1.5,
      lastUpdated: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      description: 'Salary Deposit',
      amount: 3500.00,
      date: '2023-10-01',
      category: 'Income',
      accountId: 'acc-1'
    },
    {
      id: 'tx-2',
      description: 'Rent Payment',
      amount: -1200.00,
      date: '2023-10-03',
      category: 'Rent',
      accountId: 'acc-1'
    },
    {
      id: 'tx-3',
      description: 'Grocery Shopping',
      amount: -85.43,
      date: '2023-10-05',
      category: 'Groceries',
      accountId: 'acc-1'
    },
    {
      id: 'tx-4',
      description: 'Electric Bill',
      amount: -75.00,
      date: '2023-10-10',
      category: 'Utilities',
      accountId: 'acc-1'
    },
    {
      id: 'tx-5',
      description: 'Restaurant Dinner',
      amount: -52.30,
      date: '2023-10-12',
      category: 'Dining Out',
      accountId: 'acc-1'
    },
    {
      id: 'tx-6',
      description: 'Transfer to Savings',
      amount: -500.00,
      date: '2023-10-15',
      category: 'Transfer',
      accountId: 'acc-1'
    },
    {
      id: 'tx-7',
      description: 'Transfer from Checking',
      amount: 500.00,
      date: '2023-10-15',
      category: 'Transfer',
      accountId: 'acc-2'
    },
    {
      id: 'tx-8',
      description: 'Dividend Payment',
      amount: 125.78,
      date: '2023-10-18',
      category: 'Investment',
      accountId: 'acc-3'
    },
    {
      id: 'tx-9',
      description: 'Credit Card Payment',
      amount: -250.00,
      date: '2023-10-20',
      category: 'Debt Payment',
      accountId: 'acc-1'
    },
    {
      id: 'tx-10',
      description: 'Gym Membership',
      amount: -45.00,
      date: '2023-10-21',
      category: 'Health & Fitness',
      accountId: 'acc-4'
    }
  ],
  goals: [
    {
      id: 'goal-1',
      name: 'Emergency Fund',
      targetAmount: 10000.00,
      currentAmount: 5000.00,
      targetDate: '2024-06-30',
      createdAt: '2023-01-15'
    },
    {
      id: 'goal-2',
      name: 'New Car',
      targetAmount: 25000.00,
      currentAmount: 8500.00,
      targetDate: '2025-12-31',
      createdAt: '2023-03-10'
    },
    {
      id: 'goal-3',
      name: 'Vacation',
      targetAmount: 3000.00,
      currentAmount: 1500.00,
      targetDate: '2024-08-15',
      createdAt: '2023-05-22'
    }
  ],
  recommendations: [
    {
      id: 'rec-1',
      title: 'Reduce dining out expenses',
      description: 'You spent $320 on dining out last month, which is 15% higher than your monthly average. Consider cooking at home more often to save money.',
      type: 'saving',
      impact: 150.00,
      steps: [
        'Set a weekly dining out budget',
        'Prepare lunch at home to take to work',
        'Try meal prepping on weekends'
      ]
    },
    {
      id: 'rec-2',
      title: 'Increase retirement contributions',
      description: 'Based on your income and age, you could optimize your retirement savings by increasing your 401(k) contributions by at least 3%.',
      type: 'investing',
      impact: 15000.00,
      steps: [
        'Contact your HR department to update 401(k) contribution',
        'Aim for at least employer match plus 3%',
        'Consider diversifying with a Roth IRA'
      ]
    },
    {
      id: 'rec-3',
      title: 'Refinance your mortgage',
      description: 'Current mortgage rates are lower than your existing rate. Refinancing could save you significant money over the life of your loan.',
      type: 'saving',
      impact: 250.00,
      steps: [
        'Research current mortgage rates',
        'Contact at least 3 lenders for quotes',
        'Calculate the break-even point for refinancing costs'
      ]
    },
    {
      id: 'rec-4',
      title: 'Adjust your budget allocation',
      description: 'Your entertainment spending has consistently exceeded your budget. Consider reallocating funds from other categories or increasing this category.',
      type: 'budgeting',
      impact: 15.00,
      steps: [
        'Review your entertainment transactions from the past 3 months',
        'Set a more realistic entertainment budget',
        'Look for free or low-cost entertainment alternatives'
      ]
    }
  ],
  budgetStrategy: new FiftyThirtyTwentyStrategy(),
  currentFinancialState: new SavingState()
};

// Actions
type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: FinancialGoal }
  | { type: 'UPDATE_GOAL'; payload: FinancialGoal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_BUDGET_STRATEGY'; payload: string }
  | { type: 'SET_FINANCIAL_STATE'; payload: string };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
      
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(tx => tx.id !== action.payload)
      };
      
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
      
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? action.payload : goal
        )
      };
      
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };
      
    case 'SET_BUDGET_STRATEGY':
      let newStrategy: BudgetStrategy;
      
      switch (action.payload) {
        case 'FIFTY_THIRTY_TWENTY':
          newStrategy = new FiftyThirtyTwentyStrategy();
          break;
        case 'ZERO_BASED':
          newStrategy = new ZeroBasedStrategy();
          break;
        case 'ENVELOPE':
          newStrategy = new EnvelopeStrategy();
          break;
        default:
          newStrategy = state.budgetStrategy;
      }
      
      return {
        ...state,
        budgetStrategy: newStrategy
      };
      
    case 'SET_FINANCIAL_STATE':
      let newState: FinancialState;
      
      switch (action.payload) {
        case 'BUDGETING':
          newState = new BudgetingState();
          break;
        case 'SAVING':
          newState = new SavingState();
          break;
        case 'INVESTING':
          newState = new InvestingState();
          break;
        case 'DEBT_REDUCTION':
          newState = new DebtReductionState();
          break;
        default:
          newState = state.currentFinancialState;
      }
      
      return {
        ...state,
        currentFinancialState: newState
      };
      
    default:
      return state;
  }
};

// Create context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};