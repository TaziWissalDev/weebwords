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
      <span className="anime-text-pixel text-xs sm:text-sm text-white mr-1 sm:mr-2">LIVES:</span>
      <div className="flex space-x-1">
        {Array.from({ length: safeMaxHearts }, (_, index) => (
          <span
            key={index}
            className={`text-lg sm:text-2xl ${
              index < safeHearts 
                ? 'text-red-500' 
                : 'text-gray-600'
            } transition-colors duration-300`}
          >
            {index < safeHearts ? '❤️' : '🤍'}
          </span>
        ))}
      </div>
      <span className="anime-text-pixel text-xs sm:text-sm text-white ml-1 sm:ml-2">
        {safeHearts}/{safeMaxHearts}
      </span>
    </div>
  );
};
