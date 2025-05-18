import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { FinancialGoal } from '../models/FinancialGoal';

const Goals: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { goals } = state;
  
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  
  const handleAddGoal = (goal: FinancialGoal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
    setIsAddingGoal(false);
  };
  
  const handleUpdateGoal = (goal: FinancialGoal) => {
    dispatch({ type: 'UPDATE_GOAL', payload: goal });
  };
  
  const handleDeleteGoal = (id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Financial Goals</h2>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Goal</span>
        </button>
      </div>
      
      {/* Goals summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Target size={16} />
            </div>
            <h3 className="font-medium text-gray-800">Active Goals</h3>
          </div>
          <p className="text-2xl font-semibold">{goals.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <TrendingUp size={16} />
            </div>
            <h3 className="font-medium text-gray-800">Total Progress</h3>
          </div>
          <p className="text-2xl font-semibold">
            {goals.length > 0 ? 
              `${Math.round((goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / 
                goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) * 100)}%` : 
              '0%'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Calendar size={16} />
            </div>
            <h3 className="font-medium text-gray-800">Next Goal Due</h3>
          </div>
          {goals.length > 0 ? (
            <p className="text-lg font-semibold">
              {new Date(Math.min(...goals.map(g => new Date(g.targetDate).getTime()))).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-lg text-gray-500">No goals yet</p>
          )}
        </div>
      </div>
      
      {/* Goals list */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
            <Target size={32} />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Financial Goals Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first financial goal to start tracking your progress towards financial freedom!
          </p>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add Your First Goal</span>
          </button>
        </div>
      )}
      
      {/* Add goal modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Add New Goal</h3>
            </div>
            <GoalForm 
              onSubmit={handleAddGoal}
              onCancel={() => setIsAddingGoal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;