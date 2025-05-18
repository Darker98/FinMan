import React from 'react';
import { ThumbsUp, ThumbsDown, Lightbulb, TrendingUp, PiggyBank, BarChart2 } from 'lucide-react';
import { Recommendation } from '../models/Recommendation';

interface RecommendationCardProps {
  recommendation: Recommendation;
  showActions?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation,
  showActions = false
}) => {
  const getIconByType = () => {
    switch(recommendation.type) {
      case 'saving':
        return <PiggyBank size={20} />;
      case 'investing':
        return <TrendingUp size={20} />;
      case 'budgeting':
        return <BarChart2 size={20} />;
      default:
        return <Lightbulb size={20} />;
    }
  };
  
  const getColorByType = () => {
    switch(recommendation.type) {
      case 'saving':
        return 'bg-green-100 text-green-600';
      case 'investing':
        return 'bg-amber-100 text-amber-600';
      case 'budgeting':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };
  
  const getTypeLabel = () => {
    switch(recommendation.type) {
      case 'saving':
        return 'Saving Tip';
      case 'investing':
        return 'Investment Advice';
      case 'budgeting':
        return 'Budgeting Tip';
      default:
        return 'Recommendation';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${getColorByType()} flex items-center justify-center`}>
            {getIconByType()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{recommendation.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getColorByType()} bg-opacity-20`}>
              {getTypeLabel()}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{recommendation.description}</p>
        
        {recommendation.impact > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Potential Impact</span>
            </div>
            <p className="text-blue-800 mt-1">
              {recommendation.type === 'saving' && `Save up to $${recommendation.impact.toFixed(2)} per month`}
              {recommendation.type === 'investing' && `Grow your investments by ~$${recommendation.impact.toFixed(2)} per year`}
              {recommendation.type === 'budgeting' && `Improve budget efficiency by ${recommendation.impact.toFixed(0)}%`}
            </p>
          </div>
        )}
        
        {recommendation.steps && recommendation.steps.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Next Steps:</h4>
            <ul className="space-y-2">
              {recommendation.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="min-w-5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-600">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showActions && (
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              <ThumbsUp size={16} />
              <span>Helpful</span>
            </button>
            <button className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              <ThumbsDown size={16} />
              <span>Not Useful</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;