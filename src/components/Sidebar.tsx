import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  BarChart, 
  Lightbulb, 
  Settings,
  Wallet
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <CreditCard size={20} /> },
    { path: '/goals', label: 'Goals', icon: <Target size={20} /> },
    { path: '/reports', label: 'Reports', icon: <BarChart size={20} /> },
    { path: '/recommendations', label: 'Insights', icon: <Lightbulb size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-blue-800 md:text-white">
      <div className="p-4 flex items-center gap-2 border-b border-blue-700">
        <Wallet size={24} />
        <span className="text-xl font-semibold">FinanceAI</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 text-sm text-blue-200 border-t border-blue-700">
        <div className="mb-1">Financial State:</div>
        <div className="bg-green-600 text-white py-1 px-3 rounded font-medium inline-block">
          Saving Mode
        </div>
      </div>
    </div>
  );
};

export default Sidebar;