import React from 'react';
import { BadgeLevel } from '../../shared/types/leaderboard';
import { getBadgeInfo, getNextBadgeInfo } from '../utils/badgeUtils';

interface BadgeDisplayProps {
  anime: string;
  badgeLevel?: BadgeLevel;
  puzzlesSolved: number;
  averageScore: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  anime,
  badgeLevel,
  puzzlesSolved,
  averageScore,
  showProgress = false,
  size = 'medium'
}) => {
  const currentBadge = badgeLevel ? getBadgeInfo(badgeLevel) : null;
  const nextBadge = badgeLevel ? getNextBadgeInfo(badgeLevel) : getBadgeInfo('bronze');

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const emojiSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  if (!currentBadge && !nextBadge) {
    return null;
  }

  return (
    <div className={`${sizeClasses[size]}`}>
      {currentBadge ? (
        <div className="flex items-center space-x-2">
          <span className={emojiSizes[size]}>{currentBadge.emoji}</span>
          <div>
            <div className={`font-medium ${currentBadge.color}`}>
              {currentBadge.name}
            </div>
            {size !== 'small' && (
              <div className="text-xs text-gray-500">
                {anime} Master
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 opacity-60">
          <span className={`${emojiSizes[size]} grayscale`}>🎌</span>
          <div>
            <div className="font-medium text-gray-500">
              No Badge Yet
            </div>
            {size !== 'small' && (
              <div className="text-xs text-gray-400">
                Solve puzzles to earn badges
              </div>
            )}
          </div>
        </div>
      )}

      {showProgress && nextBadge && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Next: {nextBadge.name} {nextBadge.emoji}
            </span>
            <span className="text-xs text-gray-500">
              {nextBadge.requirement}
            </span>
          </div>
          
          <div className="space-y-2">
            {/* Puzzles Progress */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Puzzles Solved</span>
                <span>{puzzlesSolved}/{nextBadge.minPuzzles}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((puzzlesSolved / nextBadge.minPuzzles) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Average Score Progress */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Average Score</span>
                <span>{averageScore}/{nextBadge.minAvgScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((averageScore / nextBadge.minAvgScore) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
