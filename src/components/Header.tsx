import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FinancialState } from '../models/FinancialState';

interface HeaderProps {
  currentState: FinancialState;
}

const Header: React.FC<HeaderProps> = ({ currentState }) => {
  const { dispatch } = useAppContext();
  
  const toggleSidebar = () => {
    // This would be implemented to show/hide the sidebar on mobile
  };

  const stateColors = {
    BUDGETING: 'bg-amber-500',
    SAVING: 'bg-green-600',
    INVESTING: 'bg-blue-600',
    DEBT_REDUCTION: 'bg-red-500'
  };

  const stateColor = stateColors[currentState.name] || 'bg-gray-500';

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-gray-600 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {currentState.greeting}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className={`${stateColor} text-white text-sm px-3 py-1 rounded-full`}>
          {currentState.name.replace('_', ' ')}
        </div>
        <button className="text-gray-600 hover:text-gray-900" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
          <User size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;