import { redis } from '@devvit/web/server';
import { UserAnimeStats, BadgeLevel, AnimeLeaderboard, BadgeInfo } from '../../shared/types/leaderboard';
import { ANIME_PUZZLES } from './puzzles';

// Badge system configuration
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

export function getBadgeInfo(level: BadgeLevel): BadgeInfo {
  return BADGE_LEVELS.find(b => b.level === level) || BADGE_LEVELS[0];
}

export async function updateUserAnimeStats(
  username: string, 
  anime: string, 
  score: number
): Promise<void> {
  const statsKey = `anime_stats:${username}:${anime}`;
  const existingData = await redis.get(statsKey);
  
  let stats: UserAnimeStats;
  
  if (existingData) {
    stats = JSON.parse(existingData);
    stats.puzzlesSolved += 1;
    stats.totalScore += score;
    stats.averageScore = Math.round(stats.totalScore / stats.puzzlesSolved);
  } else {
    stats = {
      username,
      anime,
      puzzlesSolved: 1,
      totalScore: score,
      averageScore: score,
      badgeLevel: 'bronze',
      lastPlayed: new Date().toISOString()
    };
  }
  
  // Update badge level
  stats.badgeLevel = calculateBadgeLevel(stats.puzzlesSolved, stats.averageScore);
  stats.lastPlayed = new Date().toISOString();
  
  await redis.set(statsKey, JSON.stringify(stats));
  
  // Update leaderboard
  await updateLeaderboard(anime, stats);
}

async function updateLeaderboard(anime: string, userStats: UserAnimeStats): Promise<void> {
  const leaderboardKey = `leaderboard:${anime}`;
  const existingData = await redis.get(leaderboardKey);
  
  let leaderboard: UserAnimeStats[] = existingData ? JSON.parse(existingData) : [];
  
  // Remove existing entry for this user
  leaderboard = leaderboard.filter(entry => entry.username !== userStats.username);
  
  // Add updated stats
  leaderboard.push(userStats);
  
  // Sort by average score (descending), then by puzzles solved (descending)
  leaderboard.sort((a, b) => {
    if (a.averageScore !== b.averageScore) {
      return b.averageScore - a.averageScore;
    }
    return b.puzzlesSolved - a.puzzlesSolved;
  });
  
  // Keep top 50 users
  leaderboard = leaderboard.slice(0, 50);
  
  await redis.set(leaderboardKey, JSON.stringify(leaderboard));
}

export async function getAnimeLeaderboard(anime: string, username?: string): Promise<AnimeLeaderboard> {
  const leaderboardKey = `leaderboard:${anime}`;
  const leaderboardData = await redis.get(leaderboardKey);
  
  const topUsers: UserAnimeStats[] = leaderboardData ? JSON.parse(leaderboardData) : [];
  const totalPuzzles = ANIME_PUZZLES.filter(p => p.anime === anime).length;
  
  let userRank: number | undefined;
  let userStats: UserAnimeStats | undefined;
  
  if (username) {
    const userIndex = topUsers.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      userRank = userIndex + 1;
      userStats = topUsers[userIndex];
    } else {
      // Check if user has stats but not in top 50
      const statsKey = `anime_stats:${username}:${anime}`;
      const userData = await redis.get(statsKey);
      if (userData) {
        userStats = JSON.parse(userData);
        userRank = 51; // Indicate they're not in top 50
      }
    }
  }
  
  return {
    anime,
    totalPuzzles,
    topUsers: topUsers.slice(0, 10), // Show top 10
    userRank,
    userStats
  };
}

export async function getAllLeaderboards(username?: string): Promise<AnimeLeaderboard[]> {
  // Get unique anime from puzzles
  const animeList = [...new Set(ANIME_PUZZLES.map(p => p.anime))];
  
  const leaderboards = await Promise.all(
    animeList.map(anime => getAnimeLeaderboard(anime, username))
  );
  
  return leaderboards;
}

export async function getUserBadges(username: string): Promise<{ [anime: string]: BadgeLevel }> {
  const animeList = [...new Set(ANIME_PUZZLES.map(p => p.anime))];
  const badges: { [anime: string]: BadgeLevel } = {};
  
  for (const anime of animeList) {
    const statsKey = `anime_stats:${username}:${anime}`;
    const userData = await redis.get(statsKey);
    
    if (userData) {
      const stats: UserAnimeStats = JSON.parse(userData);
      badges[anime] = stats.badgeLevel;
    }
  }
  
  return badges;
}
