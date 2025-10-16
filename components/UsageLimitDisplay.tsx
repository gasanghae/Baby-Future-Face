import React from 'react';
import { getUsageInfo } from '../services/usageLimitService';

interface UsageLimitDisplayProps {
  className?: string;
}

const UsageLimitDisplay: React.FC<UsageLimitDisplayProps> = ({ className = '' }) => {
  const usageInfo = getUsageInfo();
  const percentage = (usageInfo.count / 10) * 100;

  return (
    <div className={`bg-pink-50 border border-pink-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-pink-700">일일 사용량</span>
        <span className="text-sm text-pink-600">
          {usageInfo.count}/10회
        </span>
      </div>
      
      <div className="w-full bg-pink-200 rounded-full h-2 mb-2">
        <div 
          className="bg-pink-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-pink-600">
        남은 사용 가능 횟수: <span className="font-semibold">{usageInfo.remaining}회</span>
      </p>
    </div>
  );
};

export default UsageLimitDisplay;
