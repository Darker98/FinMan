import React from 'react';

// Define account types using enum for type safety
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  CREDIT_CARD = 'CREDIT_CARD',
  LOAN = 'LOAN'
}

// Base Account interface
export interface Account {
  id: string;
  name: string;
  type: string;
  accountNumber: string;
  balance: number;
  iconType: string;
  changePercent: number;
  lastUpdated: string;
}

// Implementation of the Composite pattern:
// Account implementations for different types

// CheckingAccount - basic day-to-day transactions
export class CheckingAccount implements Account {
  id: string;
  name: string;
  type: string = AccountType.CHECKING;
  accountNumber: string;
  balance: number;
  iconType: string;
  changePercent: number;
  lastUpdated: string;
  
  constructor(id: string, name: string, accountNumber: string, balance: number, iconType: string) {
    this.id = id;
    this.name = name;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.iconType = iconType;
    this.changePercent = 0;
    this.lastUpdated = new Date().toISOString();
  }
  
  // Methods specific to checking accounts
  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    this.balance += amount;
    this.lastUpdated = new Date().toISOString();
  }
  
  withdraw(amount: number): void {
    if (amount <= 0) throw new Error('Withdrawal amount must be positive');
    if (amount > this.balance) throw new Error('Insufficient funds');
    this.balance -= amount;
    this.lastUpdated = new Date().toISOString();
  }
}

// SavingsAccount - interest-bearing savings
export class SavingsAccount implements Account {
  id: string;
  name: string;
  type: string = AccountType.SAVINGS;
  accountNumber: string;
  balance: number;
  iconType: string;
  changePercent: number;
  lastUpdated: string;
  interestRate: number;
  
  constructor(id: string, name: string, accountNumber: string, balance: number, iconType: string, interestRate: number = 0.01) {
    this.id = id;
    this.name = name;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.iconType = iconType;
    this.changePercent = 0;
    this.lastUpdated = new Date().toISOString();
    this.interestRate = interestRate;
  }
  
  // Methods specific to savings accounts
  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    this.balance += amount;
    this.lastUpdated = new Date().toISOString();
  }
  
  withdraw(amount: number): void {
    if (amount <= 0) throw new Error('Withdrawal amount must be positive');
    if (amount > this.balance) throw new Error('Insufficient funds');
    this.balance -= amount;
    this.lastUpdated = new Date().toISOString();
  }
  
  applyInterest(): void {
    const interest = this.balance * this.interestRate;
    this.balance += interest;
    this.lastUpdated = new Date().toISOString();
  }
}

// InvestmentAccount - stocks, bonds, etc.
export class InvestmentAccount implements Account {
  id: string;
  name: string;
  type: string = AccountType.INVESTMENT;
  accountNumber: string;
  balance: number;
  iconType: string;
  changePercent: number;
  lastUpdated: string;
  holdings: { symbol: string, shares: number, value: number }[];
  
  constructor(id: string, name: string, accountNumber: string, balance: number, iconType: string) {
    this.id = id;
    this.name = name;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.iconType = iconType;
    this.changePercent = 0;
    this.lastUpdated = new Date().toISOString();
    this.holdings = [];
  }
  
  // Methods specific to investment accounts
  buy(symbol: string, shares: number, pricePerShare: number): void {
    const cost = shares * pricePerShare;
    if (cost > this.balance) throw new Error('Insufficient funds for this purchase');
    
    // Update cash balance
    this.balance -= cost;
    
    // Update or add holding
    const existingHolding = this.holdings.find(h => h.symbol === symbol);
    if (existingHolding) {
      existingHolding.shares += shares;
      existingHolding.value += cost;
    } else {
      this.holdings.push({ symbol, shares, value: cost });
    }
    
    this.lastUpdated = new Date().toISOString();
  }
  
  sell(symbol: string, shares: number, pricePerShare: number): void {
    const existingHolding = this.holdings.find(h => h.symbol === symbol);
    if (!existingHolding) throw new Error(`No holding found for ${symbol}`);
    if (existingHolding.shares < shares) throw new Error(`Not enough shares of ${symbol} to sell`);
    
    const saleValue = shares * pricePerShare;
    
    // Update cash balance
    this.balance += saleValue;
    
    // Update holding
    existingHolding.shares -= shares;
    existingHolding.value = existingHolding.shares * pricePerShare; // Recalculate value
    
    // Remove holding if no shares left
    if (existingHolding.shares === 0) {
      this.holdings = this.holdings.filter(h => h.symbol !== symbol);
    }
    
    this.lastUpdated = new Date().toISOString();
  }
  
  updatePrices(priceUpdates: { symbol: string, price: number }[]): void {
    priceUpdates.forEach(update => {
      const holding = this.holdings.find(h => h.symbol === update.symbol);
      if (holding) {
        const oldValue = holding.value;
        holding.value = holding.shares * update.price;
        this.changePercent = (holding.value - oldValue) / oldValue * 100;
      }
    });
    
    this.lastUpdated = new Date().toISOString();
  }
}

// CreditCardAccount - credit accounts with negative balances
export class CreditCardAccount implements Account {
  id: string;
  name: string;
  type: string = AccountType.CREDIT_CARD;
  accountNumber: string;
  balance: number; // Usually negative
  iconType: string;
  changePercent: number;
  lastUpdated: string;
  creditLimit: number;
  interestRate: number;
  
  constructor(id: string, name: string, accountNumber: string, balance: number, iconType: string, creditLimit: number, interestRate: number) {
    this.id = id;
    this.name = name;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.iconType = iconType;
    this.changePercent = 0;
    this.lastUpdated = new Date().toISOString();
    this.creditLimit = creditLimit;
    this.interestRate = interestRate;
  }
  
  // Methods specific to credit card accounts
  charge(amount: number): void {
    if (amount <= 0) throw new Error('Charge amount must be positive');
    if (Math.abs(this.balance) + amount > this.creditLimit) throw new Error('This would exceed your credit limit');
    
    this.balance -= amount; // Credit card balance goes more negative
    this.lastUpdated = new Date().toISOString();
  }
  
  payment(amount: number): void {
    if (amount <= 0) throw new Error('Payment amount must be positive');
    this.balance += amount; // Payment makes balance less negative
    this.lastUpdated = new Date().toISOString();
  }
  
  applyInterest(): void {
    if (this.balance < 0) {
      const interest = Math.abs(this.balance) * this.interestRate;
      this.balance -= interest; // More negative
      this.lastUpdated = new Date().toISOString();
    }
  }
  
  availableCredit(): number {
    return this.creditLimit - Math.abs(this.balance);
  }
}

// AccountGroup - Composite class that can contain other accounts
export class AccountGroup implements Account {
  id: string;
  name: string;
  type: string = 'GROUP';
  accountNumber: string;
  accounts: Account[];
  iconType: string;
  changePercent: number;
  lastUpdated: string;
  
  constructor(id: string, name: string, iconType: string) {
    this.id = id;
    this.name = name;
    this.accountNumber = 'GROUP';
    this.accounts = [];
    this.iconType = iconType;
    this.changePercent = 0;
    this.lastUpdated = new Date().toISOString();
  }
  
  addAccount(account: Account): void {
    this.accounts.push(account);
    this.lastUpdated = new Date().toISOString();
  }
  
  removeAccount(accountId: string): void {
    this.accounts = this.accounts.filter(a => a.id !== accountId);
    this.lastUpdated = new Date().toISOString();
  }
  
  // Calculate the total balance of all accounts in the group
  get balance(): number {
    return this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }
  
  // This is a required property for the Account interface
  set balance(value: number) {
    // Cannot directly set the balance of a group
    console.warn('Cannot directly set the balance of an account group');
  }
}