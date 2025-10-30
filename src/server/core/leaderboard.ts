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
  score: number,
  difficulty?: string,
  puzzleType?: string
): Promise<void> {
  const statsKey = `anime_stats:${username}:${anime}`;
  const existingData = await redis.get(statsKey);
  
  let stats: UserAnimeStats;
  
  if (existingData) {
    stats = JSON.parse(existingData);
    stats.puzzlesSolved += 1;
    stats.totalScore += score;
    stats.averageScore = Math.round(stats.totalScore / stats.puzzlesSolved);
    
    // Track best score
    if (score > (stats.bestScore || 0)) {
      stats.bestScore = score;
    }
    
    // Track difficulty stats
    if (difficulty) {
      if (!stats.difficultyStats) {
        stats.difficultyStats = { easy: 0, medium: 0, hard: 0 };
      }
      stats.difficultyStats[difficulty as keyof typeof stats.difficultyStats] += 1;
    }
  } else {
    stats = {
      username,
      anime,
      puzzlesSolved: 1,
      totalScore: score,
      averageScore: score,
      bestScore: score,
      badgeLevel: 'bronze',
      lastPlayed: new Date().toISOString(),
      difficultyStats: difficulty ? { 
        easy: difficulty === 'easy' ? 1 : 0,
        medium: difficulty === 'medium' ? 1 : 0,
        hard: difficulty === 'hard' ? 1 : 0
      } : { easy: 0, medium: 0, hard: 0 }
    };
  }
  
  // Update badge level
  stats.badgeLevel = calculateBadgeLevel(stats.puzzlesSolved, stats.averageScore);
  stats.lastPlayed = new Date().toISOString();
  
  await redis.set(statsKey, JSON.stringify(stats));
  
  // Update leaderboards
  await updateLeaderboard(anime, stats);
  await updateGlobalLeaderboard(stats);
  
  // Track total players using sets stored as JSON
  const animePlayersKey = `players:${anime}`;
  const globalPlayersKey = 'players:global';
  
  // Get existing player sets
  const animePlayersData = await redis.get(animePlayersKey);
  const globalPlayersData = await redis.get(globalPlayersKey);
  
  const animePlayers = animePlayersData ? JSON.parse(animePlayersData) : [];
  const globalPlayers = globalPlayersData ? JSON.parse(globalPlayersData) : [];
  
  // Add player if not already in sets
  if (!animePlayers.includes(username)) {
    animePlayers.push(username);
    await redis.set(animePlayersKey, JSON.stringify(animePlayers));
  }
  
  if (!globalPlayers.includes(username)) {
    globalPlayers.push(username);
    await redis.set(globalPlayersKey, JSON.stringify(globalPlayers));
  }
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
// Global leaderboard functions
export async function updateGlobalLeaderboard(userStats: UserAnimeStats): Promise<void> {
  const globalKey = 'leaderboard:global';
  const existingData = await redis.get(globalKey);
  
  let globalLeaderboard: UserAnimeStats[] = existingData ? JSON.parse(existingData) : [];
  
  // Remove existing entry for this user and anime
  globalLeaderboard = globalLeaderboard.filter(
    entry => !(entry.username === userStats.username && entry.anime === userStats.anime)
  );
  
  // Add updated stats
  globalLeaderboard.push(userStats);
  
  // Sort by average score (descending), then by total score (descending)
  globalLeaderboard.sort((a, b) => {
    if (a.averageScore !== b.averageScore) {
      return b.averageScore - a.averageScore;
    }
    return b.totalScore - a.totalScore;
  });
  
  // Keep top 100 entries
  globalLeaderboard = globalLeaderboard.slice(0, 100);
  
  await redis.set(globalKey, JSON.stringify(globalLeaderboard));
}

export async function getGlobalLeaderboard(username?: string): Promise<{
  topUsers: UserAnimeStats[];
  userEntries: UserAnimeStats[];
  userRank?: number;
  totalPlayers: number;
}> {
  const globalKey = 'leaderboard:global';
  const globalData = await redis.get(globalKey);
  
  const allEntries: UserAnimeStats[] = globalData ? JSON.parse(globalData) : [];
  const globalPlayersData = await redis.get('players:global');
  const totalPlayers = globalPlayersData ? JSON.parse(globalPlayersData).length : 0;
  
  let userEntries: UserAnimeStats[] = [];
  let userRank: number | undefined;
  
  if (username) {
    // Find all entries for this user
    userEntries = allEntries.filter(entry => entry.username === username);
    
    // Find best rank for this user
    const userRanks = userEntries.map(entry => {
      const rank = allEntries.findIndex(e => e.username === entry.username && e.anime === entry.anime);
      return rank !== -1 ? rank + 1 : 999;
    });
    
    userRank = userRanks.length > 0 ? Math.min(...userRanks) : undefined;
  }
  
  return {
    topUsers: allEntries.slice(0, 20), // Top 20 for display
    userEntries,
    userRank,
    totalPlayers
  };
}

export async function getTotalPlayersForAnime(anime: string): Promise<number> {
  const animePlayersData = await redis.get(`players:${anime}`);
  return animePlayersData ? JSON.parse(animePlayersData).length : 0;
}

export async function getUserProfile(username: string): Promise<{
  username: string;
  totalPuzzlesSolved: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  animeStats: UserAnimeStats[];
  badges: { [anime: string]: BadgeLevel };
  globalRank?: number;
  favoriteAnime?: string;
}> {
  // Get all anime stats for user
  const animeList = [...new Set(ANIME_PUZZLES.map(p => p.anime))];
  const animeStats: UserAnimeStats[] = [];
  let totalPuzzlesSolved = 0;
  let totalScore = 0;
  let bestScore = 0;
  const badges: { [anime: string]: BadgeLevel } = {};
  
  for (const anime of animeList) {
    const statsKey = `anime_stats:${username}:${anime}`;
    const userData = await redis.get(statsKey);
    
    if (userData) {
      const stats: UserAnimeStats = JSON.parse(userData);
      animeStats.push(stats);
      totalPuzzlesSolved += stats.puzzlesSolved;
      totalScore += stats.totalScore;
      bestScore = Math.max(bestScore, stats.bestScore || 0);
      badges[anime] = stats.badgeLevel;
    }
  }
  
  const averageScore = totalPuzzlesSolved > 0 ? Math.round(totalScore / totalPuzzlesSolved) : 0;
  
  // Find favorite anime (most puzzles solved)
  const favoriteAnime = animeStats.length > 0 
    ? animeStats.reduce((prev, current) => 
        prev.puzzlesSolved > current.puzzlesSolved ? prev : current
      ).anime
    : undefined;
  
  // Get global rank
  const globalLeaderboard = await getGlobalLeaderboard(username);
  
  return {
    username,
    totalPuzzlesSolved,
    totalScore,
    averageScore,
    bestScore,
    animeStats,
    badges,
    globalRank: globalLeaderboard.userRank,
    favoriteAnime
  };
}

// Leaderboard management functions
export async function resetLeaderboard(anime?: string): Promise<void> {
  if (anime) {
    await redis.del(`leaderboard:${anime}`);
    await redis.del(`players:${anime}`);
  } else {
    // Reset all leaderboards
    const animeList = [...new Set(ANIME_PUZZLES.map(p => p.anime))];
    const keys = [
      'leaderboard:global',
      'players:global',
      ...animeList.map(a => `leaderboard:${a}`),
      ...animeList.map(a => `players:${a}`)
    ];
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

export async function getLeaderboardStats(): Promise<{
  totalPlayers: number;
  totalGames: number;
  animeStats: { [anime: string]: { players: number; games: number } };
}> {
  const animeList = [...new Set(ANIME_PUZZLES.map(p => p.anime))];
  const globalPlayersData = await redis.get('players:global');
  const totalPlayers = globalPlayersData ? JSON.parse(globalPlayersData).length : 0;
  
  const animeStats: { [anime: string]: { players: number; games: number } } = {};
  let totalGames = 0;
  
  for (const anime of animeList) {
    const animePlayersData = await redis.get(`players:${anime}`);
    const players = animePlayersData ? JSON.parse(animePlayersData).length : 0;
    
    // Count total games for this anime by summing all user stats
    const leaderboardKey = `leaderboard:${anime}`;
    const leaderboardData = await redis.get(leaderboardKey);
    const leaderboard: UserAnimeStats[] = leaderboardData ? JSON.parse(leaderboardData) : [];
    const games = leaderboard.reduce((sum, user) => sum + user.puzzlesSolved, 0);
    
    animeStats[anime] = { players, games };
    totalGames += games;
  }
  
  return {
    totalPlayers,
    totalGames,
    animeStats
  };
}
