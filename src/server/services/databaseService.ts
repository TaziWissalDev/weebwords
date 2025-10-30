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

  // Enhanced global leaderboard with user position
  static async getGlobalLeaderboardWithUser(username: string, limit: number = 20) {
    const globalLeaderboardKey = 'global_leaderboard';
    const leaderboard = await redis.get(globalLeaderboardKey);
    const allData = leaderboard ? JSON.parse(leaderboard) : [];
    
    // Find user's position in the full leaderboard
    const userIndex = allData.findIndex((entry: any) => entry.username === username);
    const userRank = userIndex !== -1 ? userIndex + 1 : null;
    const userEntry = userIndex !== -1 ? allData[userIndex] : null;
    
    return {
      topUsers: allData.slice(0, limit),
      userRank,
      userEntry,
      totalPlayers: allData.length
    };
  }

  // Home page statistics
  static async getHomePageStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const [
      dailyTopScorer,
      globalLeaderboard,
      totalUsers,
      todaysPuzzlesSolved,
      concurrentStats
    ] = await Promise.all([
      redis.get('home_stats:daily_top_scorer'),
      this.getGlobalLeaderboard(5),
      (async () => {
        const allUsersData = await redis.get('all_users');
        return allUsersData ? JSON.parse(allUsersData).length : 0;
      })(),
      redis.get(`daily_stats:${today}:puzzles_solved`),
      this.getMaxConcurrentPlayers()
    ]);

    return {
      dailyTopScorer: dailyTopScorer ? JSON.parse(dailyTopScorer) : null,
      globalTop5: globalLeaderboard,
      totalUsers: totalUsers || 0,
      todaysPuzzlesSolved: todaysPuzzlesSolved ? parseInt(todaysPuzzlesSolved) : 0,
      concurrentPlayers: concurrentStats,
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
    const allUsersData = await redis.get('all_users');
    const allUsers = allUsersData ? JSON.parse(allUsersData) : [];
    
    if (!allUsers.includes(username)) {
      allUsers.push(username);
      await redis.set('all_users', JSON.stringify(allUsers));
    }
    
    await this.incrementDailyStats('new_users');
  }

  // Active player tracking for concurrent users
  static async trackActivePlayer(username: string) {
    const activePlayersKey = 'active_players';
    const userActivityKey = `user_activity:${username}`;
    
    // Add user to active players set
    const activePlayersData = await redis.get(activePlayersKey);
    const activePlayers = activePlayersData ? JSON.parse(activePlayersData) : [];
    
    if (!activePlayers.includes(username)) {
      activePlayers.push(username);
      await redis.set(activePlayersKey, JSON.stringify(activePlayers));
    }
    
    // Set user activity timestamp with 5-minute expiration
    await redis.set(userActivityKey, Date.now().toString(), { expiration: new Date(Date.now() + 300 * 1000) });
    
    // Clean up inactive players (older than 5 minutes)
    await this.cleanupInactivePlayers();
  }

  static async cleanupInactivePlayers() {
    const activePlayersKey = 'active_players';
    const activePlayersData = await redis.get(activePlayersKey);
    const activeUsers = activePlayersData ? JSON.parse(activePlayersData) : [];
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    const stillActiveUsers = [];

    for (const username of activeUsers) {
      const userActivityKey = `user_activity:${username}`;
      const lastActivity = await redis.get(userActivityKey);
      
      if (lastActivity && parseInt(lastActivity) >= fiveMinutesAgo) {
        stillActiveUsers.push(username);
      }
    }
    
    await redis.set(activePlayersKey, JSON.stringify(stillActiveUsers));
  }

  static async getActivePlayersCount(): Promise<number> {
    await this.cleanupInactivePlayers();
    const activePlayersData = await redis.get('active_players');
    return activePlayersData ? JSON.parse(activePlayersData).length : 0;
  }

  static async getMaxConcurrentPlayers(): Promise<{
    current: number;
    todayMax: number;
    allTimeMax: number;
  }> {
    const current = await this.getActivePlayersCount();
    const today = new Date().toISOString().split('T')[0];
    
    const todayMaxKey = `max_concurrent:${today}`;
    const allTimeMaxKey = 'max_concurrent:all_time';
    
    const todayMax = await redis.get(todayMaxKey);
    const allTimeMax = await redis.get(allTimeMaxKey);
    
    const todayMaxNum = todayMax ? parseInt(todayMax) : 0;
    const allTimeMaxNum = allTimeMax ? parseInt(allTimeMax) : 0;
    
    // Update maximums if current is higher
    if (current > todayMaxNum) {
      await redis.set(todayMaxKey, current.toString(), { expiration: new Date(Date.now() + 86400 * 1000) }); // 24 hour expiration
    }
    
    if (current > allTimeMaxNum) {
      await redis.set(allTimeMaxKey, current.toString());
    }
    
    return {
      current,
      todayMax: Math.max(current, todayMaxNum),
      allTimeMax: Math.max(current, allTimeMaxNum)
    };
  }

  // Puzzle uniqueness tracking
  static async markPuzzleAsUsed(username: string, puzzleId: string) {
    const userPuzzlesKey = `user_puzzles:${username}`;
    const userPuzzlesData = await redis.get(userPuzzlesKey);
    const userPuzzles = userPuzzlesData ? JSON.parse(userPuzzlesData) : [];
    
    if (!userPuzzles.includes(puzzleId)) {
      userPuzzles.push(puzzleId);
      // Set expiration to 7 days to allow puzzle reuse after a week
      await redis.set(userPuzzlesKey, JSON.stringify(userPuzzles), { expiration: new Date(Date.now() + 86400 * 7 * 1000) });
    }
  }

  static async hasPuzzleBeenUsed(username: string, puzzleId: string): Promise<boolean> {
    const userPuzzlesKey = `user_puzzles:${username}`;
    const userPuzzlesData = await redis.get(userPuzzlesKey);
    const userPuzzles = userPuzzlesData ? JSON.parse(userPuzzlesData) : [];
    return userPuzzles.includes(puzzleId);
  }

  static async getUsedPuzzles(username: string): Promise<string[]> {
    const userPuzzlesKey = `user_puzzles:${username}`;
    const userPuzzlesData = await redis.get(userPuzzlesKey);
    return userPuzzlesData ? JSON.parse(userPuzzlesData) : [];
  }

  static async clearUsedPuzzles(username: string) {
    const userPuzzlesKey = `user_puzzles:${username}`;
    await redis.del(userPuzzlesKey);
  }

  // General score system - track maximum score achieved
  static async updateMaxScore(username: string, score: number, puzzleType: string, anime: string, difficulty: string) {
    const maxScoreKey = `max_score:${username}`;
    const currentMaxScore = await redis.get(maxScoreKey);
    const maxScore = currentMaxScore ? parseInt(currentMaxScore) : 0;

    if (score > maxScore) {
      await redis.set(maxScoreKey, score.toString());
      
      // Store details of the max score achievement
      const maxScoreDetailsKey = `max_score_details:${username}`;
      const maxScoreDetails = {
        score,
        puzzleType,
        anime,
        difficulty,
        achieved_at: new Date().toISOString()
      };
      await redis.set(maxScoreDetailsKey, JSON.stringify(maxScoreDetails));

      // Update global max score leaderboard
      await this.updateGlobalMaxScoreLeaderboard(username, score, maxScoreDetails);
      
      return { isNewRecord: true, previousMax: maxScore, newMax: score };
    }

    return { isNewRecord: false, currentMax: maxScore };
  }

  static async getMaxScore(username: string) {
    const maxScoreKey = `max_score:${username}`;
    const maxScoreDetailsKey = `max_score_details:${username}`;
    
    const [maxScore, details] = await Promise.all([
      redis.get(maxScoreKey),
      redis.get(maxScoreDetailsKey)
    ]);

    return {
      maxScore: maxScore ? parseInt(maxScore) : 0,
      details: details ? JSON.parse(details) : null
    };
  }

  // Global max score leaderboard
  static async updateGlobalMaxScoreLeaderboard(username: string, score: number, details: any) {
    const globalMaxScoreKey = 'global_max_score_leaderboard';
    const leaderboard = await redis.get(globalMaxScoreKey);
    const leaderboardData = leaderboard ? JSON.parse(leaderboard) : [];

    // Remove existing entry
    const filteredLeaderboard = leaderboardData.filter((entry: any) => entry.username !== username);
    
    // Add updated entry
    filteredLeaderboard.push({
      username,
      max_score: score,
      puzzle_type: details.puzzleType,
      anime: details.anime,
      difficulty: details.difficulty,
      achieved_at: details.achieved_at
    });

    // Sort by max score descending
    filteredLeaderboard.sort((a: any, b: any) => b.max_score - a.max_score);

    // Keep top 50
    const topLeaderboard = filteredLeaderboard.slice(0, 50);
    
    // Update rank positions
    topLeaderboard.forEach((entry: any, index: number) => {
      entry.rank_position = index + 1;
    });

    await redis.set(globalMaxScoreKey, JSON.stringify(topLeaderboard));

    return topLeaderboard;
  }

  static async getGlobalMaxScoreLeaderboard(limit: number = 10) {
    const globalMaxScoreKey = 'global_max_score_leaderboard';
    const leaderboard = await redis.get(globalMaxScoreKey);
    const data = leaderboard ? JSON.parse(leaderboard) : [];
    return data.slice(0, limit);
  }

  // Enhanced user profile with max score
  static async getUserProfile(username: string) {
    const [user, badges, maxScoreData] = await Promise.all([
      this.getUser(username),
      this.getUserBadges(username),
      this.getMaxScore(username)
    ]);

    if (!user) return null;

    return {
      ...user,
      badges,
      maxScore: maxScoreData.maxScore,
      maxScoreDetails: maxScoreData.details
    };
  }

  // User statistics increment
  static async incrementUserStat(username: string, statName: string, value: number = 1) {
    const user = await this.getUser(username);
    if (!user) return null;

    // Map stat names to user properties
    const statMapping: { [key: string]: string } = {
      'challenges_created': 'challengesCreated',
      'challenges_completed': 'challengesCompleted',
      'challenges_won': 'challengesWon',
      'challenges_lost': 'challengesLost'
    };

    const userProperty = statMapping[statName] || statName;
    
    if (user[userProperty] !== undefined) {
      user[userProperty] = (user[userProperty] || 0) + value;
    } else {
      user[userProperty] = value;
    }

    user.updated_at = new Date().toISOString();
    await redis.set(`user:${username}`, JSON.stringify(user));
    
    return user;
  }

  // Get leaderboard by puzzle type (for anime guess mode)
  static async getLeaderboardByPuzzleType(puzzleType: string, limit: number = 20) {
    const leaderboardKey = `puzzle_type_leaderboard:${puzzleType}`;
    const leaderboard = await redis.get(leaderboardKey);
    const data = leaderboard ? JSON.parse(leaderboard) : [];
    return data.slice(0, limit);
  }

  // Update puzzle type leaderboard (for anime guess mode)
  static async updatePuzzleTypeLeaderboard(username: string, puzzleType: string, score: number) {
    const leaderboardKey = `puzzle_type_leaderboard:${puzzleType}`;
    const userStatsKey = `puzzle_type_stats:${username}:${puzzleType}`;
    
    // Get or create user's puzzle type stats
    const existingStats = await redis.get(userStatsKey);
    const stats = existingStats ? JSON.parse(existingStats) : {
      username,
      puzzle_type: puzzleType,
      total_score: 0,
      puzzles_solved: 0,
      average_score: 0,
      best_score: 0,
      last_played: new Date().toISOString()
    };

    // Update stats
    stats.total_score += score;
    stats.puzzles_solved += 1;
    stats.average_score = Math.round(stats.total_score / stats.puzzles_solved);
    stats.best_score = Math.max(stats.best_score, score);
    stats.last_played = new Date().toISOString();

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

    return stats;
  }
}
