import React from 'react';
import { MoreVertical, TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { Account } from '../models/Account';

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const getIconClassName = () => {
    switch(account.type) {
      case 'CHECKING':
        return 'bg-blue-100 text-blue-600';
      case 'SAVINGS':
        return 'bg-green-100 text-green-600';
      case 'INVESTMENT':
        return 'bg-amber-100 text-amber-600';
      case 'CREDIT_CARD':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getIcon = () => {
    switch(account.iconType) {
      case 'Wallet':
        return <Wallet size={20} />;
      case 'PiggyBank':
        return <PiggyBank size={20} />;
      case 'CreditCard':
        return <CreditCard size={20} />;
      case 'TrendingUp':
        return <TrendingUpIcon size={20} />;
      default:
        return <Wallet size={20} />;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };
  
  // Determine if the account balance is positive or negative for styling
  const isNegativeBalance = account.balance < 0;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${getIconClassName()} flex items-center justify-center mr-3`}>
              {getIcon()}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{account.name}</h4>
              <p className="text-sm text-gray-500">{account.accountNumber}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <div className="mb-3">
          <span className="text-sm text-gray-500">Balance</span>
          <p className={`text-xl font-semibold ${isNegativeBalance ? 'text-red-500' : 'text-gray-900'}`}>
            {formatCurrency(account.balance)}
          </p>
        </div>
        
        <div className="flex items-center">
          {account.changePercent >= 0 ? (
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+{account.changePercent.toFixed(2)}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500 text-sm">
              <TrendingDown size={16} className="mr-1" />
              <span>{account.changePercent.toFixed(2)}%</span>
            </div>
          )}
          <span className="text-gray-500 text-sm ml-2">This month</span>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Last updated: {new Date(account.lastUpdated).toLocaleDateString()}
        </span>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          Details
        </button>
      </div>
    </div>
  );
};

export default AccountCard;