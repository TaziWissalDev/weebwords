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
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mx-2 sm:mx-0">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
        {/* Score and Anime Info */}
        <div className="flex items-center justify-between xs:justify-start xs:space-x-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          
          <div className="text-center xs:text-left">
            <div className="font-semibold text-gray-800 text-sm sm:text-base">{anime}</div>
            <div className="text-xs sm:text-sm text-gray-600">{character}</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-800">{hintsUsed}</div>
            <div className="text-xs text-gray-500">Hints</div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(difficulty)}`}>
            {getDifficultyEmoji(difficulty)} {difficulty.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
