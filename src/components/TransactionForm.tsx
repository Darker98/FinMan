import React, { useState } from 'react';
import { Account } from '../models/Account';

interface TransactionFormProps {
  onSubmit: (transaction: any) => void;
  onCancel: () => void;
  accounts: Account[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel, accounts }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState(accounts.length > 0 ? accounts[0].id : '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const categories = isIncome
    ? ['Salary', 'Investment', 'Gift', 'Other Income']
    : ['Groceries', 'Rent', 'Utilities', 'Entertainment', 'Dining Out', 
       'Transportation', 'Healthcare', 'Shopping', 'Other Expense'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !accountId || !date) {
      alert('Please fill in all required fields');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    
    const transaction = {
      id: `tx-${Date.now()}`,
      description,
      amount: isIncome ? parsedAmount : -parsedAmount,
      category,
      accountId,
      date,
    };
    
    onSubmit(transaction);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Grocery shopping at Safeway"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </legend>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="expense"
                  name="transactionType"
                  type="radio"
                  checked={!isIncome}
                  onChange={() => setIsIncome(false)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="expense" className="ml-2 block text-sm text-gray-700">
                  Expense
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="income"
                  name="transactionType"
                  type="radio"
                  checked={isIncome}
                  onChange={() => setIsIncome(true)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="income" className="ml-2 block text-sm text-gray-700">
                  Income
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">
            Account
          </label>
          <select
            id="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;