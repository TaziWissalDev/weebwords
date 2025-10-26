import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DailyPack, ScoreSubmission, LeaderboardEntry, PuzzleType } from '../../shared/types/daily-pack';

export class DatabaseService {
  private db: Database.Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new Database(dbPath);
    this.initializeSchema();
  }

  private initializeSchema() {
    const schemaPath = join(__dirname, '../db/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    this.db.exec(schema);
  }

  // User management
  getOrCreateUser(username: string): number {
    const existing = this.db.prepare('SELECT id FROM users WHERE username = ?').get(username) as { id: number } | undefined;
    
    if (existing) {
      return existing.id;
    }

    const result = this.db.prepare('INSERT INTO users (username) VALUES (?)').run(username);
    
    // Initialize user stats
    this.db.prepare(`
      INSERT INTO user_stats (user_id) VALUES (?)
    `).run(result.lastInsertRowid);

    return result.lastInsertRowid as number;
  }

  // Daily pack management
  saveDailyPack(date: string, pack: DailyPack): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO daily_packs (date, pack_data) 
      VALUES (?, ?)
    `).run(date, JSON.stringify(pack));
  }

  getDailyPack(date: string): DailyPack | null {
    const result = this.db.prepare('SELECT pack_data FROM daily_packs WHERE date = ?').get(date) as { pack_data: string } | undefined;
    
    if (!result) return null;
    
    return JSON.parse(result.pack_data);
  }

  // Score submission
  submitScore(submission: ScoreSubmission): { success: boolean; newRank?: number } {
    const userId = this.getOrCreateUser(submission.user);
    const date = new Date().toISOString().split('T')[0];

    // Calculate score based on puzzle type
    const score = this.calculateScore(submission);

    try {
      this.db.transaction(() => {
        // Insert score
        this.db.prepare(`
          INSERT OR REPLACE INTO scores 
          (user_id, puzzle_id, puzzle_type, score, time_ms, hints_used, accuracy, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId,
          submission.puzzleId,
          submission.type,
          score,
          submission.metrics.timeMs,
          submission.metrics.hintsUsed,
          submission.metrics.accuracy,
          date
        );

        // Update user stats and streaks
        this.updateUserStats(userId, submission.type, score, date);
      })();

      // Get new rank
      const newRank = this.getUserRank(submission.user, submission.type);
      
      return { success: true, newRank };
    } catch (error) {
      console.error('Score submission error:', error);
      return { success: false };
    }
  }

  private calculateScore(submission: ScoreSubmission): number {
    const { type, metrics } = submission;
    let baseScore = Math.round(metrics.accuracy * 100);

    // Type-specific scoring
    switch (type) {
      case 'emoji_sensei':
        // Semantic similarity scoring
        baseScore = Math.round(metrics.accuracy * 100);
        break;
      case 'who_am_i':
        // Hint penalty: -20 per hint
        baseScore = Math.max(baseScore - (metrics.hintsUsed * 20), 0);
        break;
      default:
        break;
    }

    // Speed bonus (faster = better, max 20% bonus)
    const speedBonus = Math.min(Math.max(0, (30000 - metrics.timeMs) / 30000) * 20, 20);
    
    return Math.round(baseScore + speedBonus);
  }

  private updateUserStats(userId: number, puzzleType: PuzzleType, score: number, date: string): void {
    const stats = this.db.prepare(`
      SELECT * FROM user_stats WHERE user_id = ?
    `).get(userId) as any;

    const isConsecutiveDay = stats.last_play_date === this.getPreviousDate(date);
    const streakColumn = `${puzzleType}_streak`;

    // Update streaks
    const newTypeStreak = isConsecutiveDay ? (stats[streakColumn] || 0) + 1 : 1;
    const newGlobalStreak = isConsecutiveDay ? (stats.global_streak || 0) + 1 : 1;

    this.db.prepare(`
      UPDATE user_stats SET
        ${streakColumn} = ?,
        global_streak = ?,
        total_score = total_score + ?,
        puzzles_completed = puzzles_completed + 1,
        last_play_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(newTypeStreak, newGlobalStreak, score, date, userId);
  }

  private getPreviousDate(date: string): string {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  // Leaderboard
  getLeaderboard(type: PuzzleType | 'global', limit: number = 50): LeaderboardEntry[] {
    let query: string;
    
    if (type === 'global') {
      query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY us.total_score DESC) as rank,
          u.username as user,
          us.total_score as score,
          us.global_streak as streak
        FROM user_stats us
        JOIN users u ON us.user_id = u.id
        WHERE us.total_score > 0
        ORDER BY us.total_score DESC
        LIMIT ?
      `;
    } else {
      query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY SUM(s.score) DESC) as rank,
          u.username as user,
          SUM(s.score) as score,
          us.${type}_streak as streak
        FROM scores s
        JOIN users u ON s.user_id = u.id
        JOIN user_stats us ON s.user_id = us.user_id
        WHERE s.puzzle_type = ?
        GROUP BY s.user_id
        ORDER BY SUM(s.score) DESC
        LIMIT ?
      `;
    }

    const params = type === 'global' ? [limit] : [type, limit];
    return this.db.prepare(query).all(...params) as LeaderboardEntry[];
  }

  getUserRank(username: string, type: PuzzleType | 'global'): number {
    const userId = this.getOrCreateUser(username);
    
    let query: string;
    let params: any[];

    if (type === 'global') {
      query = `
        SELECT COUNT(*) + 1 as rank
        FROM user_stats us1
        JOIN user_stats us2 ON us2.user_id = ?
        WHERE us1.total_score > us2.total_score
      `;
      params = [userId];
    } else {
      query = `
        SELECT COUNT(*) + 1 as rank
        FROM (
          SELECT user_id, SUM(score) as total_score
          FROM scores
          WHERE puzzle_type = ?
          GROUP BY user_id
        ) leaderboard
        JOIN (
          SELECT SUM(score) as user_score
          FROM scores
          WHERE puzzle_type = ? AND user_id = ?
        ) user_total
        WHERE leaderboard.total_score > user_total.user_score
      `;
      params = [type, type, userId];
    }

    const result = this.db.prepare(query).get(...params) as { rank: number };
    return result.rank;
  }

  // Puzzle template management
  savePuzzleTemplate(type: PuzzleType, anime: string, character: string | null, data: any): void {
    const contentHash = this.generateContentHash(data);
    
    this.db.prepare(`
      INSERT OR IGNORE INTO puzzle_templates (type, anime, character, content_hash, data)
      VALUES (?, ?, ?, ?, ?)
    `).run(type, anime, character, contentHash, JSON.stringify(data));
  }

  private generateContentHash(data: any): string {
    // Simple hash for duplicate detection
    return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 32);
  }

  close(): void {
    this.db.close();
  }
}
