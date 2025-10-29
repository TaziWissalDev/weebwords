import React, { useState, useEffect } from 'react';

interface EnergyDisplayProps {
  energy: number;
  maxEnergy: number;
  lastReset: number;
  className?: string;
}

export const EnergyDisplay: React.FC<EnergyDisplayProps> = ({
  energy,
  maxEnergy,
  lastReset,
  className = ''
}) => {
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  // Ensure we have valid numbers
  const safeEnergy = typeof energy === 'number' ? energy : 0;
  const safeMaxEnergy = typeof maxEnergy === 'number' ? maxEnergy : 5;
  const safeLastReset = typeof lastReset === 'number' ? lastReset : Date.now();

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const resetInterval = 10 * 60 * 1000; // 10 minutes in milliseconds
      const timeSinceReset = now - safeLastReset;
      const timeUntilNext = resetInterval - (timeSinceReset % resetInterval);
      
      const minutes = Math.floor(timeUntilNext / 60000);
      const seconds = Math.floor((timeUntilNext % 60000) / 1000);
      
      setTimeUntilReset(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [safeLastReset]);

  const energyPercentage = (safeEnergy / safeMaxEnergy) * 100;

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      {/* Energy Icon */}
      <div className="flex items-center space-x-1">
        <span className="text-lg sm:text-2xl">⚡</span>
        <span className="anime-text-pixel text-xs sm:text-sm text-white">ENERGY:</span>
      </div>

      {/* Energy Bar */}
      <div className="flex-1 max-w-16 sm:max-w-24">
        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 relative"
            style={{ width: `${energyPercentage}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="anime-text-pixel text-xs text-white mt-1 text-center">
          {safeEnergy}/{safeMaxEnergy}
        </div>
      </div>

      {/* Timer */}
      {safeEnergy < safeMaxEnergy && (
        <div className="anime-text-pixel text-xs text-gray-400 hidden sm:block">
          <div>Refill in:</div>
          <div className="font-mono font-bold text-orange-400">{timeUntilReset}</div>
        </div>
      )}
    </div>
  );
};
