import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Save, 
  BarChart, 
  CreditCard, 
  User, 
  Bell, 
  Shield, 
  RefreshCw, 
  ChevronRight 
} from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  const [budgetStrategy, setBudgetStrategy] = useState(state.budgetStrategy.name);
  const [financialState, setFinancialState] = useState(state.currentFinancialState.name);
  
  const handleSaveSettings = () => {
    // Update budgeting strategy
    dispatch({ 
      type: 'SET_BUDGET_STRATEGY', 
      payload: budgetStrategy
    });
    
    // Update financial state
    dispatch({ 
      type: 'SET_FINANCIAL_STATE', 
      payload: financialState
    });
  };

  // Categories for transactions
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    'Groceries', 'Rent', 'Utilities', 'Entertainment', 
    'Dining Out', 'Transportation', 'Healthcare', 'Shopping'
  ]);
  
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };
  
  const handleRemoveCategory = (category) => {
    setCategories(categories.filter(c => c !== category));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Settings</h2>
        <p className="text-gray-500">Customize your financial management experience</p>
      </div>
      
      <div className="space-y-6">
        {/* Budgeting Strategy */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Budgeting Strategy</h3>
            <p className="text-sm text-gray-500">Select the budgeting strategy that fits your needs</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="50-30-20"
                  name="budgetStrategy"
                  value="FIFTY_THIRTY_TWENTY"
                  checked={budgetStrategy === 'FIFTY_THIRTY_TWENTY'}
                  onChange={() => setBudgetStrategy('FIFTY_THIRTY_TWENTY')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="50-30-20" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">50/30/20 Rule</span>
                  <span className="block text-sm text-gray-500">
                    50% needs, 30% wants, 20% savings and debt repayment
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="zero-based"
                  name="budgetStrategy"
                  value="ZERO_BASED"
                  checked={budgetStrategy === 'ZERO_BASED'}
                  onChange={() => setBudgetStrategy('ZERO_BASED')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="zero-based" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Zero-Based Budgeting</span>
                  <span className="block text-sm text-gray-500">
                    Allocate every dollar of income until you reach zero
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="envelope"
                  name="budgetStrategy"
                  value="ENVELOPE"
                  checked={budgetStrategy === 'ENVELOPE'}
                  onChange={() => setBudgetStrategy('ENVELOPE')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="envelope" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Envelope Method</span>
                  <span className="block text-sm text-gray-500">
                    Divide cash into different categories (envelopes)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financial State */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Financial State</h3>
            <p className="text-sm text-gray-500">Your current financial focus area</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="budgeting"
                  name="financialState"
                  value="BUDGETING"
                  checked={financialState === 'BUDGETING'}
                  onChange={() => setFinancialState('BUDGETING')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="budgeting" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Budgeting Mode</span>
                  <span className="block text-sm text-gray-500">
                    Focus on getting expenses under control
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="saving"
                  name="financialState"
                  value="SAVING"
                  checked={financialState === 'SAVING'}
                  onChange={() => setFinancialState('SAVING')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saving" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Saving Mode</span>
                  <span className="block text-sm text-gray-500">
                    Focus on building up savings and emergency fund
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="investing"
                  name="financialState"
                  value="INVESTING"
                  checked={financialState === 'INVESTING'}
                  onChange={() => setFinancialState('INVESTING')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="investing" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Investing Mode</span>
                  <span className="block text-sm text-gray-500">
                    Focus on growing wealth through investments
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="debt"
                  name="financialState"
                  value="DEBT_REDUCTION"
                  checked={financialState === 'DEBT_REDUCTION'}
                  onChange={() => setFinancialState('DEBT_REDUCTION')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="debt" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Debt Reduction Mode</span>
                  <span className="block text-sm text-gray-500">
                    Focus on paying down high-interest debt
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction Categories */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Transaction Categories</h3>
            <p className="text-sm text-gray-500">Manage the categories used to classify your transactions</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                    <span>{category}</span>
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Other Settings (Not fully implemented) */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Other Settings</h3>
            <p className="text-sm text-gray-500">Configure additional options</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span>Account Information</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <span>Notifications</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-gray-400 mr-3" />
                <span>Data Synchronization</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;