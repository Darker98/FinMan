import React, { useState } from 'react';
import { Lightbulb, Filter, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import RecommendationCard from '../components/RecommendationCard';

const Recommendations: React.FC = () => {
  const { state } = useAppContext();
  const { recommendations } = state;
  
  const [filterType, setFilterType] = useState('all');
  
  // Filter recommendations by type
  const filteredRecommendations = recommendations.filter(recommendation => {
    if (filterType === 'all') return true;
    return recommendation.type === filterType;
  });
  
  // Calculate potential savings based on recommendations
  const potentialSavings = recommendations
    .filter(r => r.type === 'saving')
    .reduce((sum, r) => sum + r.impact, 0);
  
  // Calculate potential investment growth
  const potentialInvestmentGrowth = recommendations
    .filter(r => r.type === 'investing')
    .reduce((sum, r) => sum + r.impact, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">AI Recommendations</h2>
          <p className="text-gray-500">Personalized financial insights based on your spending patterns</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-2 inline-flex items-center gap-2">
          <Lightbulb size={18} className="text-blue-600" />
          <span className="text-blue-700 font-medium">AI Powered</span>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Active Recommendations</p>
          <p className="text-2xl font-semibold">{recommendations.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Potential Monthly Savings</p>
          <p className="text-2xl font-semibold text-green-500">
            ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Potential Investment Growth</p>
          <p className="text-2xl font-semibold text-blue-500">
            ${potentialInvestmentGrowth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-full ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Recommendations
        </button>
        <button
          onClick={() => setFilterType('saving')}
          className={`px-4 py-2 rounded-full ${
            filterType === 'saving'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Saving Tips
        </button>
        <button
          onClick={() => setFilterType('investing')}
          className={`px-4 py-2 rounded-full ${
            filterType === 'investing'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Investment Advice
        </button>
        <button
          onClick={() => setFilterType('budgeting')}
          className={`px-4 py-2 rounded-full ${
            filterType === 'budgeting'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Budgeting Tips
        </button>
      </div>
      
      {/* Recommendations list */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecommendations.map(recommendation => (
            <RecommendationCard 
              key={recommendation.id} 
              recommendation={recommendation} 
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
            <Lightbulb size={32} />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Recommendations Found</h3>
          <p className="text-gray-600">
            We don't have any {filterType !== 'all' ? filterType + ' ' : ''}recommendations at the moment.
            Check back after adding more transaction data!
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;