import React, { useState, useEffect } from 'react';

interface TimerProps {
  timeLimit: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onTimeUpdate?: (timeRemaining: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ 
  timeLimit, 
  onTimeUp, 
  isActive, 
  onTimeUpdate 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        onTimeUpdate?.(newTime);
        
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTimerAnimation = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage <= 10) return 'animate-pulse';
    if (percentage <= 25) return 'animate-bounce';
    return '';
  };

  return (
    <div className="neon-card p-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-2xl">⏰</span>
        <div className={`anime-text-pixel text-2xl font-bold ${getTimerColor()} ${getTimerAnimation()}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeRemaining <= timeLimit * 0.25 ? 'bg-red-500' :
            timeRemaining <= timeLimit * 0.5 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
        />
      </div>
      
      {timeRemaining <= 10 && (
        <div className="mt-2 anime-text-pixel text-red-400 text-xs animate-pulse">
          HURRY UP! ⚡
        </div>
      )}
    </div>
  );
};
