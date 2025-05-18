import React, { useState } from 'react';
import { Edit, Trash, Target, Plus } from 'lucide-react';
import { FinancialGoal } from '../models/FinancialGoal';

interface GoalCardProps {
  goal: FinancialGoal;
  onUpdate: (goal: FinancialGoal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const formattedProgress = Math.min(Math.round(progress), 100);
  
  const daysRemaining = () => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const handleAddContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    
    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + amount
    };
    
    onUpdate(updatedGoal);
    setContributionAmount('');
    setIsEditing(false);
  };
  
  const getStatusColor = () => {
    if (progress >= 75) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <Target size={20} />
            </div>
            <h3 className="font-medium text-gray-900">{goal.name}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditing(!isEditing)}
              aria-label="Edit goal"
            >
              <Edit size={18} />
            </button>
            <button
              className="p-1 text-gray-400 hover:text-red-600"
              onClick={() => onDelete(goal.id)}
              aria-label="Delete goal"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>${goal.currentAmount.toLocaleString('en-US')}</span>
            <span>${goal.targetAmount.toLocaleString('en-US')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getStatusColor()}`}
              style={{ width: `${formattedProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500">
              {formattedProgress}% complete
            </span>
            <span className="text-sm text-gray-500">
              {daysRemaining()} days left
            </span>
          </div>
        </div>
        
        {isEditing ? (
          <div className="mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                onClick={handleAddContribution}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 w-full flex items-center justify-center gap-1 text-blue-600 py-2 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            <Plus size={16} />
            <span>Add Contribution</span>
          </button>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Target Date</span>
          <span className="font-medium">{new Date(goal.targetDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;