import React, { useState } from 'react';
import { Plus, Filter, Search, ChevronDown, Tag, Calendar, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import TransactionForm from '../components/TransactionForm';

const Transactions: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { transactions } = state;
  
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const handleAddTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    setIsAddingTransaction(false);
  };
  
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Get unique categories
  const categories = [...new Set(transactions.map(t => t.category))];
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? transaction.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Transactions</h2>
        <button
          onClick={() => setIsAddingTransaction(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={18} className="text-gray-400" />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort('date')}
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar size={16} />
              <span>Date</span>
              {sortBy === 'date' && (
                <ChevronDown 
                  size={16} 
                  className={`transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} 
                />
              )}
            </button>
            
            <button
              onClick={() => toggleSort('amount')}
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                sortBy === 'amount' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <DollarSign size={16} />
              <span>Amount</span>
              {sortBy === 'amount' && (
                <ChevronDown 
                  size={16} 
                  className={`transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} 
                />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Transaction list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map(transaction => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onDelete={(id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id })}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No transactions found. Add your first transaction to get started!
          </div>
        )}
      </div>
      
      {/* Add transaction modal */}
      {isAddingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Add New Transaction</h3>
            </div>
            <TransactionForm 
              onSubmit={handleAddTransaction}
              onCancel={() => setIsAddingTransaction(false)}
              accounts={state.accounts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;