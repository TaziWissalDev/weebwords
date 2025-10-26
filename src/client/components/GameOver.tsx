import React from 'react';
import { GameStats } from '../../shared/types/puzzle';

interface GameOverProps {
  gameStats: GameStats;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  gameStats,
  onRestart,
  onBackToMenu
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center text-white">
        {/* Game Over Animation */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">💔</div>
          <h1 className="text-4xl font-bold mb-2">Game Over!</h1>
          <p className="text-xl opacity-90">You ran out of hearts</p>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Your Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Puzzles Solved:</span>
              <span className="font-bold">{gameStats.totalPuzzlesSolved}</span>
            </div>
            <div className="flex justify-between">
              <span>Best Streak:</span>
              <span className="font-bold">{gameStats.currentStreak}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Hints Used:</span>
              <span className="font-bold">{gameStats.averageHintsUsed.toFixed(1)}</span>
            </div>
            {gameStats.favoriteAnime && (
              <div className="flex justify-between">
                <span>Favorite Anime:</span>
                <span className="font-bold">{gameStats.favoriteAnime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-green-300 hover:to-green-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🔄 Try Again
          </button>
          
          <button
            onClick={onBackToMenu}
            className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/30"
          >
            🏠 Back to Menu
          </button>
        </div>

        {/* Encouragement */}
        <div className="mt-8 text-sm opacity-75">
          <p>Don't give up! Every anime expert started as a beginner 🌟</p>
        </div>
      </div>
    </div>
  );
};
