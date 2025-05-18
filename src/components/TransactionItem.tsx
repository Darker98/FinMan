import React from 'react';
import { ArrowUpRight, ArrowDownRight, Trash, Edit } from 'lucide-react';
import { Transaction } from '../models/Transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const isIncome = transaction.amount > 0;
  
  const getCategoryColor = (category: string) => {
    const categoryColors = {
      'Groceries': 'bg-green-100 text-green-800',
      'Rent': 'bg-blue-100 text-blue-800',
      'Utilities': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Dining Out': 'bg-amber-100 text-amber-800',
      'Transportation': 'bg-indigo-100 text-indigo-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Shopping': 'bg-cyan-100 text-cyan-800',
      'Income': 'bg-emerald-100 text-emerald-800',
      'Salary': 'bg-emerald-100 text-emerald-800',
      'Investment': 'bg-amber-100 text-amber-800',
      'Transfer': 'bg-gray-100 text-gray-800',
    };
    
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
      <div className="flex items-center">
        <div className={`mr-4 w-10 h-10 rounded-full flex items-center justify-center ${
          isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
              {transaction.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </p>
        
        <div className="flex gap-2">
          <button 
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Edit transaction"
          >
            <Edit size={18} />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-red-600"
            onClick={() => onDelete(transaction.id)}
            aria-label="Delete transaction"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;