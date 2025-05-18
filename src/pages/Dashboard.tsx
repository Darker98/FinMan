import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Target, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import AccountCard from '../components/AccountCard';
import RecommendationCard from '../components/RecommendationCard';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { accounts, transactions, goals, recommendations } = state;
  
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate income and expenses for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  const income = currentMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = currentMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Expense by category data for pie chart
  const expensesByCategory = currentMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((categories, t) => {
      const category = t.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += Math.abs(t.amount);
      return categories;
    }, {});
  
  const pieChartData = Object.keys(expensesByCategory).map(category => ({
    name: category,
    value: expensesByCategory[category]
  }));
  
  // Monthly spending data for bar chart
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return { month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear() };
  }).reverse();
  
  const barChartData = last6Months.map(({ month, year }) => {
    const monthlyExpenses = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
               d.getFullYear() === year &&
               t.amount < 0;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      name: month,
      expenses: monthlyExpenses
    };
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      
      {/* Financial summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-semibold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Wallet size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Income (This Month)</p>
              <p className="text-2xl font-semibold text-green-500">+${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expenses (This Month)</p>
              <p className="text-2xl font-semibold text-red-500">-${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <ArrowDownRight size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Accounts and Top Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Your Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accounts.map(account => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top Goal</h3>
          {goals.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{goals[0].name}</h4>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target size={16} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Target: ${goals[0].targetAmount.toLocaleString('en-US')}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(goals[0].currentAmount / goals[0].targetAmount) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>${goals[0].currentAmount.toLocaleString('en-US')}</span>
                <span className="text-gray-500">
                  {Math.round((goals[0].currentAmount / goals[0].targetAmount) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Expenses']} />
                <Bar dataKey="expenses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Personal Recommendations</h3>
          <Lightbulb size={20} className="text-amber-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;