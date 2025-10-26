import { BadgeLevel, BadgeInfo } from '../../shared/types/leaderboard';

export const BADGE_LEVELS: BadgeInfo[] = [
  {
    level: 'bronze',
    name: 'Apprentice',
    emoji: '🥉',
    color: 'text-amber-600',
    requirement: 'Solve 3+ puzzles',
    minPuzzles: 3,
    minAvgScore: 50
  },
  {
    level: 'silver',
    name: 'Scholar',
    emoji: '🥈',
    color: 'text-gray-500',
    requirement: 'Solve 5+ puzzles with 75+ avg score',
    minPuzzles: 5,
    minAvgScore: 75
  },
  {
    level: 'gold',
    name: 'Expert',
    emoji: '🥇',
    color: 'text-yellow-500',
    requirement: 'Solve 8+ puzzles with 100+ avg score',
    minPuzzles: 8,
    minAvgScore: 100
  },
  {
    level: 'platinum',
    name: 'Master',
    emoji: '💎',
    color: 'text-blue-400',
    requirement: 'Solve 12+ puzzles with 150+ avg score',
    minPuzzles: 12,
    minAvgScore: 150
  },
  {
    level: 'master',
    name: 'Legendary',
    emoji: '👑',
    color: 'text-purple-500',
    requirement: 'Solve 15+ puzzles with 200+ avg score',
    minPuzzles: 15,
    minAvgScore: 200
  }
];

export function getBadgeInfo(level: BadgeLevel): BadgeInfo {
  return BADGE_LEVELS.find(b => b.level === level) || BADGE_LEVELS[0];
}

export function calculateBadgeLevel(puzzlesSolved: number, averageScore: number): BadgeLevel {
  // Check from highest to lowest
  for (let i = BADGE_LEVELS.length - 1; i >= 0; i--) {
    const badge = BADGE_LEVELS[i];
    if (puzzlesSolved >= badge.minPuzzles && averageScore >= badge.minAvgScore) {
      return badge.level;
    }
  }
  return 'bronze'; // Default to bronze
}

export function getNextBadgeInfo(currentLevel: BadgeLevel): BadgeInfo | null {
  const currentIndex = BADGE_LEVELS.findIndex(b => b.level === currentLevel);
  if (currentIndex === -1 || currentIndex === BADGE_LEVELS.length - 1) {
    return null; // Already at max level
  }
  return BADGE_LEVELS[currentIndex + 1];
}
