import { redis } from '@devvit/web/server';

// Database service using Redis as the storage layer
// Since we're in a serverless environment, we'll use Redis with structured keys

export class DatabaseService {
  // User management
  static async createOrUpdateUser(username: string, userData: any) {
    const userKey = `user:${username}`;
    const existingUser = await redis.get(userKey);
    
    if (existingUser) {
      const user = JSON.parse(existingUser);
      const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() };
      await redis.set(userKey, JSON.stringify(updatedUser));
      return updatedUser;
    } else {
      const newUser = {
        username,
        hearts: 3,
        max_hearts: 3,
        energy: 5,
        max_energy: 5,
        last_energy_reset: new Date().toISOString(),
        total_score: 0,
        total_puzzles_solved: 0,
        current_streak: 0,
        best_streak: 0,
        favorite_anime: '',
        level: 1,
        experience: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...userData
      };
      await redis.set(userKey, JSON.stringify(newUser));
      return newUser;
    }
  }

  static async getUser(username: string) {
    const userKey = `user:${username}`;
    const userData = await redis.get(userKey);
    return userData ? JSON.parse(userData) : null;
  }

  static async updateUserHearts(username: string, hearts: number) {
    const user = await this.getUser(username);
    if (user) {
      user.hearts = hearts;
      user.updated_at = new Date().toISOString();
      await redis.set(`user:${username}`, JSON.stringify(user));
    }
    return user;
  }

  static async updateUserEnergy(username: string, energy: number) {
    const user = await this.getUser(username);
    if (user) {
      user.energy = energy;
      user.last_energy_reset = new Date().toISOString();
      user.updated_at = new Date().toISOString();
      await redis.set(`user:${username}`, JSON.stringify(user));
    }
    return user;
  }

  // Badge management
  static async updateUserBadge(username: string, anime: string, badgeData: any) {
    const badgeKey = `badge:${username}:${anime}`;
    const existingBadge = await redis.get(badgeKey);
    
    const badge = existingBadge ? JSON.parse(existingBadge) : {
      username,
      anime,
      badge_level: 'bronze',
      puzzles_solved: 0,
      total_score: 0,
      average_score: 0,
      best_score: 0,
      earned_at: new Date().toISOString()
    };

    const updatedBadge = {
      ...badge,
      ...badgeData,
      updated_at: new Date().toISOString()
    };

    await redis.set(badgeKey, JSON.stringify(updatedBadge));
    
    // Update user's badges list
    const userBadgesKey = `user_badges:${username}`;
    const userBadges = await redis.get(userBadgesKey);
    const badges = userBadges ? JSON.parse(userBadges) : {};
    badges[anime] = updatedBadge.badge_level;
    await redis.set(userBadgesKey, JSON.stringify(badges));

    return updatedBadge;
  }

  static async getUserBadges(username: string) {
    const userBadgesKey = `user_badges:${username}`;
    const badges = await redis.get(userBadgesKey);
    return badges ? JSON.parse(badges) : {};
  }

  // Score tracking
  static async addPuzzleScore(username: string, scoreData: any) {
    const scoreId = `${username}_${scoreData.puzzle_id}_${Date.now()}`;
    const scoreKey = `score:${scoreId}`;
    
    const score = {
      id: scoreId,
      username,
      ...scoreData,
      created_at: new Date().toISOString()
    };

    await redis.set(scoreKey, JSON.stringify(score));

    // Update user's total score and stats
    const user = await this.getUser(username);
    if (user) {
      user.total_score += scoreData.score;
      user.total_puzzles_solved += 1;
      user.experience += scoreData.score;
      
      // Update streak
      if (scoreData.score > 0) {
        user.current_streak += 1;
        user.best_streak = Math.max(user.best_streak, user.current_streak);
      } else {
        user.current_streak = 0;
      }

      // Update favorite anime
      if (!user.favorite_anime || Math.random() > 0.7) {
        user.favorite_anime = scoreData.anime;
      }

      await this.createOrUpdateUser(username, user);
    }

    // Update anime leaderboard
    await this.updateAnimeLeaderboard(username, scoreData.anime, scoreData.score);

    return score;
  }

  // Leaderboard management
  static async updateAnimeLeaderboard(username: string, anime: string, score: number) {
    const leaderboardKey = `anime_leaderboard:${anime}`;
    const userStatsKey = `anime_stats:${username}:${anime}`;
    
    // Get or create user's anime stats
    const existingStats = await redis.get(userStatsKey);
    const stats = existingStats ? JSON.parse(existingStats) : {
      username,
      anime,
      total_score: 0,
      puzzles_solved: 0,
      average_score: 0,
      best_score: 0,
      badge_level: 'bronze',
      last_played: new Date().toISOString()
    };

    // Update stats
    stats.total_score += score;
    stats.puzzles_solved += 1;
    stats.average_score = Math.round(stats.total_score / stats.puzzles_solved);
    stats.best_score = Math.max(stats.best_score, score);
    stats.last_played = new Date().toISOString();

    // Calculate badge level
    stats.badge_level = this.calculateBadgeLevel(stats.puzzles_solved, stats.average_score);

    await redis.set(userStatsKey, JSON.stringify(stats));

    // Update leaderboard
    const leaderboard = await redis.get(leaderboardKey);
    const leaderboardData = leaderboard ? JSON.parse(leaderboard) : [];
    
    // Remove existing entry
    const filteredLeaderboard = leaderboardData.filter((entry: any) => entry.username !== username);
    
    // Add updated entry
    filteredLeaderboard.push(stats);
    
    // Sort by average score, then by total score
    filteredLeaderboard.sort((a: any, b: any) => {
      if (a.average_score !== b.average_score) {
        return b.average_score - a.average_score;
      }
      return b.total_score - a.total_score;
    });

    // Keep top 50
    const topLeaderboard = filteredLeaderboard.slice(0, 50);
    
    // Update rank positions
    topLeaderboard.forEach((entry: any, index: number) => {
      entry.rank_position = index + 1;
    });

    await redis.set(leaderboardKey, JSON.stringify(topLeaderboard));

    // Update badge
    await this.updateUserBadge(username, anime, {
      badge_level: stats.badge_level,
      puzzles_solved: stats.puzzles_solved,
      total_score: stats.total_score,
      average_score: stats.average_score,
      best_score: stats.best_score
    });

    return stats;
  }

  static async getAnimeLeaderboard(anime: string, limit: number = 10) {
    const leaderboardKey = `anime_leaderboard:${anime}`;
    const leaderboard = await redis.get(leaderboardKey);
    const data = leaderboard ? JSON.parse(leaderboard) : [];
    return data.slice(0, limit);
  }

  // Daily challenge management
  static async addDailyChallengeScore(username: string, challengeDate: string, scoreData: any) {
    const challengeScoreKey = `daily_challenge:${challengeDate}:${username}`;
    
    const challengeScore = {
      username,
      challenge_date: challengeDate,
      ...scoreData,
      created_at: new Date().toISOString()
    };

    await redis.set(challengeScoreKey, JSON.stringify(challengeScore));

    // Update daily leaderboard
    await this.updateDailyLeaderboard(challengeDate, username, scoreData.score);

    return challengeScore;
  }

  static async updateDailyLeaderboard(challengeDate: string, username: string, score: number) {
    const dailyLeaderboardKey = `daily_leaderboard:${challengeDate}`;
    const leaderboard = await redis.get(dailyLeaderboardKey);
    const leaderboardData = leaderboard ? JSON.parse(leaderboard) : [];

    // Remove existing entry
    const filteredLeaderboard = leaderboardData.filter((entry: any) => entry.username !== username);
    
    // Add new entry
    filteredLeaderboard.push({
      username,
      score,
      challenge_date: challengeDate,
      updated_at: new Date().toISOString()
    });

    // Sort by score descending
    filteredLeaderboard.sort((a: any, b: any) => b.score - a.score);

    // Update rank positions
    filteredLeaderboard.forEach((entry: any, index: number) => {
      entry.rank_position = index + 1;
    });

    await redis.set(dailyLeaderboardKey, JSON.stringify(filteredLeaderboard));

    // Cache today's top scorer for home page
    if (challengeDate === new Date().toISOString().split('T')[0]) {
      const topScorer = filteredLeaderboard[0];
      if (topScorer) {
        await redis.set('home_stats:daily_top_scorer', JSON.stringify(topScorer));
      }
    }

    return filteredLeaderboard;
  }

  static async getDailyLeaderboard(challengeDate: string, limit: number = 10) {
    const dailyLeaderboardKey = `daily_leaderboard:${challengeDate}`;
    const leaderboard = await redis.get(dailyLeaderboardKey);
    const data = leaderboard ? JSON.parse(leaderboard) : [];
    return data.slice(0, limit);
  }

  // Global leaderboard
  static async updateGlobalLeaderboard(username: string) {
    const user = await this.getUser(username);
    if (!user) return;

    const globalLeaderboardKey = 'global_leaderboard';
    const leaderboard = await redis.get(globalLeaderboardKey);
    const leaderboardData = leaderboard ? JSON.parse(leaderboard) : [];

    // Remove existing entry
    const filteredLeaderboard = leaderboardData.filter((entry: any) => entry.username !== username);
    
    // Add updated entry
    const badges = await this.getUserBadges(username);
    const totalBadges = Object.keys(badges).length;

    filteredLeaderboard.push({
      username,
      total_score: user.total_score,
      total_puzzles: user.total_puzzles_solved,
      average_score: user.total_puzzles_solved > 0 ? Math.round(user.total_score / user.total_puzzles_solved) : 0,
      best_streak: user.best_streak,
      favorite_anime: user.favorite_anime,
      total_badges: totalBadges,
      last_updated: new Date().toISOString()
    });

    // Sort by total score, then by average score
    filteredLeaderboard.sort((a: any, b: any) => {
      if (a.total_score !== b.total_score) {
        return b.total_score - a.total_score;
      }
      return b.average_score - a.average_score;
    });

    // Keep top 100
    const topLeaderboard = filteredLeaderboard.slice(0, 100);
    
    // Update rank positions
    topLeaderboard.forEach((entry: any, index: number) => {
      entry.rank_position = index + 1;
    });

    await redis.set(globalLeaderboardKey, JSON.stringify(topLeaderboard));

    return topLeaderboard;
  }

  static async getGlobalLeaderboard(limit: number = 20) {
    const globalLeaderboardKey = 'global_leaderboard';
    const leaderboard = await redis.get(globalLeaderboardKey);
    const data = leaderboard ? JSON.parse(leaderboard) : [];
    return data.slice(0, limit);
  }

  // Home page statistics
  static async getHomePageStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const [
      dailyTopScorer,
      globalLeaderboard,
      totalUsers,
      todaysPuzzlesSolved
    ] = await Promise.all([
      redis.get('home_stats:daily_top_scorer'),
      this.getGlobalLeaderboard(5),
      redis.scard('all_users'),
      redis.get(`daily_stats:${today}:puzzles_solved`)
    ]);

    return {
      dailyTopScorer: dailyTopScorer ? JSON.parse(dailyTopScorer) : null,
      globalTop5: globalLeaderboard,
      totalUsers: totalUsers || 0,
      todaysPuzzlesSolved: todaysPuzzlesSolved ? parseInt(todaysPuzzlesSolved) : 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Utility functions
  static calculateBadgeLevel(puzzlesSolved: number, averageScore: number): string {
    if (puzzlesSolved >= 15 && averageScore >= 200) return 'master';
    if (puzzlesSolved >= 12 && averageScore >= 150) return 'platinum';
    if (puzzlesSolved >= 8 && averageScore >= 100) return 'gold';
    if (puzzlesSolved >= 5 && averageScore >= 75) return 'silver';
    return 'bronze';
  }

  // Track daily statistics
  static async incrementDailyStats(statType: string, value: number = 1) {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_stats:${today}:${statType}`;
    await redis.incrBy(key, value);
    await redis.expire(key, 86400 * 7); // Keep for 7 days
  }

  // User registration tracking
  static async registerUser(username: string) {
    await redis.sadd('all_users', username);
    await this.incrementDailyStats('new_users');
  }
}
