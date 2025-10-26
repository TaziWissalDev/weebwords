import React from 'react';

interface ScoreDisplayProps {
  score: number;
  hintsUsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  anime: string;
  character: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  hintsUsed,
  difficulty,
  anime,
  character
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyEmoji = (diff: string) => {
    switch (diff) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left side - Anime info */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          
          <div className="h-8 w-px bg-gray-300"></div>
          
          <div>
            <div className="font-semibold text-gray-800">{anime}</div>
            <div className="text-sm text-gray-600">{character}</div>
          </div>
        </div>
        
        {/* Right side - Stats */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">{hintsUsed}</div>
            <div className="text-xs text-gray-500">Hints</div>
          </div>
          
          <div className="h-8 w-px bg-gray-300"></div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {getDifficultyEmoji(difficulty)} {difficulty.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
