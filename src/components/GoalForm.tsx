import React, { useState } from 'react';

interface GoalFormProps {
  onSubmit: (goal: any) => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount || !targetDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const parsedTargetAmount = parseFloat(targetAmount);
    const parsedCurrentAmount = currentAmount ? parseFloat(currentAmount) : 0;
    
    if (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) {
      alert('Please enter a valid positive target amount');
      return;
    }
    
    if (isNaN(parsedCurrentAmount) || parsedCurrentAmount < 0) {
      alert('Please enter a valid current amount (zero or positive)');
      return;
    }
    
    if (parsedCurrentAmount > parsedTargetAmount) {
      alert('Current amount cannot be greater than target amount');
      return;
    }
    
    const targetDateObj = new Date(targetDate);
    if (targetDateObj <= new Date()) {
      alert('Target date must be in the future');
      return;
    }
    
    const goal = {
      id: `goal-${Date.now()}`,
      name,
      targetAmount: parsedTargetAmount,
      currentAmount: parsedCurrentAmount,
      targetDate,
      createdAt: new Date().toISOString()
    };
    
    onSubmit(goal);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Emergency Fund, New Car, Vacation"
            required
          />
        </div>
        
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
            Target Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700">
            Current Amount (if any)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="currentAmount"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
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
          Create Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;