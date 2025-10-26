import React, { useState } from 'react';
import { Badge, GameStats } from '../../shared/types/puzzle';

interface BadgeSystemProps {
  gameStats: GameStats;
  onClose: () => void;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  gameStats,
  onClose
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const allBadges: Badge[] = [
    {
      id: 'first_puzzle',
      name: 'First Steps',
      description: 'Complete your first puzzle',
      icon: '🌟',
      requirement: 1,
      type: 'puzzles',
      reward: { hearts: 1 }
    },
    {
      id: 'puzzle_master',
      name: 'Puzzle Master',
      description: 'Complete 10 puzzles',
      icon: '🧩',
      requirement: 10,
      type: 'puzzles',
      reward: { maxHearts: 1, energy: 2 }
    },
    {
      id: 'streak_warrior',
      name: 'Streak Warrior',
      description: 'Get a 5-puzzle streak',
      icon: '🔥',
      requirement: 5,
      type: 'streak',
      reward: { maxEnergy: 1 }
    },
    {
      id: 'energy_saver',
      name: 'Energy Saver',
      description: 'Complete 3 puzzles without losing energy',
      icon: '⚡',
      requirement: 3,
      type: 'energy',
      reward: { energy: 3 }
    },
    {
      id: 'heart_collector',
      name: 'Heart Collector',
      description: 'Maintain full hearts for 5 puzzles',
      icon: '💖',
      requirement: 5,
      type: 'hearts',
      reward: { maxHearts: 1 }
    },
    {
      id: 'naruto_fan',
      name: 'Naruto Expert',
      description: 'Complete 5 Naruto puzzles',
      icon: '🍃',
      requirement: 5,
      type: 'anime',
      reward: { hearts: 2, energy: 1 }
    },
    {
      id: 'onepiece_fan',
      name: 'Pirate King',
      description: 'Complete 5 One Piece puzzles',
      icon: '🏴‍☠️',
      requirement: 5,
      type: 'anime',
      reward: { hearts: 2, energy: 1 }
    },
    {
      id: 'legendary',
      name: 'Legendary Otaku',
      description: 'Complete 50 puzzles',
      icon: '👑',
      requirement: 50,
      type: 'puzzles',
      reward: { maxHearts: 2, maxEnergy: 2 }
    }
  ];

  const isUnlocked = (badge: Badge) => {
    return gameStats.unlockedBadges.includes(badge.id);
  };

  const getProgress = (badge: Badge) => {
    switch (badge.type) {
      case 'puzzles':
        return Math.min(gameStats.totalPuzzlesSolved, badge.requirement);
      case 'streak':
        return Math.min(gameStats.currentStreak, badge.requirement);
      case 'hearts':
      case 'energy':
        // These would need additional tracking in game stats
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Badge Collection</h2>
              <p className="opacity-90">
                {gameStats.unlockedBadges.length}/{allBadges.length} badges unlocked
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge) => {
              const unlocked = isUnlocked(badge);
              const progress = getProgress(badge);
              const progressPercentage = (progress / badge.requirement) * 100;

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    unlocked
                      ? 'border-green-300 bg-green-50 hover:bg-green-100'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Badge Icon */}
                  <div className="text-center mb-3">
                    <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </div>
                    <h3 className={`font-bold ${unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                      {badge.name}
                    </h3>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          unlocked ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {progress}/{badge.requirement}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center mb-2">
                    {badge.description}
                  </p>

                  {/* Reward */}
                  {badge.reward && (
                    <div className="text-xs text-center">
                      <span className="text-purple-600 font-medium">Reward: </span>
                      {badge.reward.hearts && `+${badge.reward.hearts}❤️ `}
                      {badge.reward.energy && `+${badge.reward.energy}⚡ `}
                      {badge.reward.maxHearts && `+${badge.reward.maxHearts} Max Hearts `}
                      {badge.reward.maxEnergy && `+${badge.reward.maxEnergy} Max Energy`}
                    </div>
                  )}

                  {/* Unlocked Status */}
                  {unlocked && (
                    <div className="text-center mt-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Unlocked
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
