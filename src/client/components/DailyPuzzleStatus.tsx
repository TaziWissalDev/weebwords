import React, { useState, useEffect } from 'react';
import { DailyPuzzleService } from '../services/dailyPuzzleService';

interface DailyPuzzleStatusProps {
  onToggleDailyMode?: (enabled: boolean) => void;
  dailyModeEnabled?: boolean;
}

export const DailyPuzzleStatus: React.FC<DailyPuzzleStatusProps> = ({
  onToggleDailyMode,
  dailyModeEnabled = false
}) => {
  const [status, setStatus] = useState<{
    available: boolean;
    hasToday?: boolean;
    totalPuzzles?: number;
    lastGenerated?: string;
    nextGeneration?: string;
    reason?: string;
  }>({ available: false });
  
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const statusData = await DailyPuzzleService.getDailyPuzzleStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Error checking daily puzzle status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const result = await DailyPuzzleService.regenerateDailyPuzzles();
      if (result.success) {
        await checkStatus(); // Refresh status
        alert(`✅ ${result.message}\nGenerated ${result.totalPuzzles} puzzles!`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      alert('❌ Failed to regenerate puzzles');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="anime-card rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!status.available) {
    return (
      <div className="anime-card rounded-lg p-4 border-l-4 border-yellow-500">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xl">⚠️</span>
          <h3 className="font-semibold text-gray-800">AI Puzzles Unavailable</h3>
        </div>
        <p className="text-sm text-gray-600">
          {status.reason || 'Daily puzzle generation is not configured'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Using static puzzle collection instead
        </p>
      </div>
    );
  }

  return (
    <div className="anime-card rounded-lg p-4 border-l-4 border-green-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-semibold text-gray-800">AI Daily Puzzles</h3>
        </div>
        
        {onToggleDailyMode && (
          <button
            onClick={() => onToggleDailyMode(!dailyModeEnabled)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              dailyModeEnabled
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {dailyModeEnabled ? '✅ Enabled' : '⭕ Disabled'}
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Today's Puzzles:</span>
          <span className="font-medium">
            {status.hasToday ? (
              <span className="text-green-600">
                ✅ {status.totalPuzzles} available
              </span>
            ) : (
              <span className="text-orange-600">⏳ Generating...</span>
            )}
          </span>
        </div>

        {status.lastGenerated && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last Generated:</span>
            <span className="font-medium">
              {DailyPuzzleService.formatLastGenerated(status.lastGenerated)}
            </span>
          </div>
        )}

        {status.nextGeneration && (
          <div className="flex justify-between">
            <span className="text-gray-600">Next Refresh:</span>
            <span className="font-medium">
              {DailyPuzzleService.formatNextGeneration(status.nextGeneration)}
            </span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={checkStatus}
          disabled={loading}
          className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium disabled:opacity-50"
        >
          🔄 Refresh Status
        </button>
        
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex-1 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {regenerating ? '⏳ Generating...' : '🎲 Regenerate'}
        </button>
      </div>

      {dailyModeEnabled && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 font-medium">
            🤖 AI Mode Active: Fresh puzzles generated daily by AI!
          </p>
        </div>
      )}
    </div>
  );
};
