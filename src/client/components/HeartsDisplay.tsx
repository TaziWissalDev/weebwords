import React from 'react';

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  className?: string;
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
  hearts,
  maxHearts,
  className = ''
}) => {
  // Ensure we have valid numbers
  const safeHearts = typeof hearts === 'number' ? hearts : 0;
  const safeMaxHearts = typeof maxHearts === 'number' ? maxHearts : 3;
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <span className="text-sm font-medium text-gray-600 mr-2">Lives:</span>
      {Array.from({ length: safeMaxHearts }, (_, index) => (
        <span
          key={index}
          className={`text-2xl ${
            index < safeHearts 
              ? 'text-red-500' 
              : 'text-gray-300'
          } transition-colors duration-300`}
        >
          {index < safeHearts ? '❤️' : '🤍'}
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-2">
        {safeHearts}/{safeMaxHearts}
      </span>
    </div>
  );
};
