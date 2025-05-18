import React, { useState } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

const Reports: React.FC = () => {
  const { state } = useAppContext();
  const { transactions } = state;
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Get transactions for the selected month
  const monthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  // Calculate income and expenses
  const income = monthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = monthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Calculate net savings
  const netSavings = income - expenses;
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
  
  // Expenses by category
  const expensesByCategory = monthTransactions
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
  
  // Daily spending
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailySpending = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayExpenses = monthTransactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getDate() === day && t.amount < 0;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      day,
      amount: dayExpenses
    };
  });
  
  // Monthly spending trend (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    let month = currentMonth - i;
    let year = currentYear;
    
    if (month < 0) {
      month += 12;
      year -= 1;
    }
    
    return { month, year };
  }).reverse();
  
  const monthlyTrend = last6Months.map(({ month, year }) => {
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'short' });
    const monthExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month &&
               transactionDate.getFullYear() === year &&
               t.amount < 0;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const monthIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month &&
               transactionDate.getFullYear() === year &&
               t.amount > 0;
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      name: monthName,
      expenses: monthExpenses,
      income: monthIncome,
      savings: monthIncome - monthExpenses
    };
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long' });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Financial Reports</h2>
        
        <div className="flex items-center bg-white rounded-lg shadow">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-l-lg"
            aria-label="Previous month"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center px-4 py-2">
            <Calendar size={18} className="text-blue-600 mr-2" />
            <span className="font-medium">{monthName} {currentYear}</span>
          </div>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-r-lg"
            aria-label="Next month"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Income</p>
          <p className="text-2xl font-semibold text-green-500">
            ${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Expenses</p>
          <p className="text-2xl font-semibold text-red-500">
            ${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Net Savings</p>
          <p className={`text-2xl font-semibold ${netSavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
          <p className={`text-2xl font-semibold ${savingsRate >= 20 ? 'text-green-500' : savingsRate >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Spending by Category</h3>
            <button className="text-gray-500 hover:text-gray-700" aria-label="Download report">
              <Download size={18} />
            </button>
          </div>
          <div className="h-64">
            {pieChartData.length > 0 ? (
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
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No expense data available for this month
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Daily Spending</h3>
            <button className="text-gray-500 hover:text-gray-700" aria-label="Download report">
              <Download size={18} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Spending']} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Income vs Expenses Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">6-Month Financial Trend</h3>
          <button className="text-gray-500 hover:text-gray-700" aria-label="Download report">
            <Download size={18} />
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;