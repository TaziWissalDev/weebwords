import { DailyPuzzleCollection } from '../../shared/types/dailyPuzzles';

export class DailyPuzzleService {
  static async getDailyPuzzleStatus(): Promise<{
    available: boolean;
    hasToday?: boolean;
    totalPuzzles?: number;
    lastGenerated?: string;
    nextGeneration?: string;
    reason?: string;
  }> {
    try {
      const response = await fetch('/api/daily-puzzles/status');
      return await response.json();
    } catch (error) {
      console.error('Error getting daily puzzle status:', error);
      return { available: false, reason: 'Network error' };
    }
  }

  static async getTodaysPuzzles(): Promise<DailyPuzzleCollection | null> {
    try {
      const response = await fetch('/api/daily-puzzles');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting today\'s puzzles:', error);
      return null;
    }
  }

  static async getRandomDailyPuzzle(anime?: string, difficulty?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (anime) params.append('anime', anime);
      if (difficulty) params.append('difficulty', difficulty);

      const response = await fetch(`/api/daily-puzzles/random?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data.puzzle;
    } catch (error) {
      console.error('Error getting random daily puzzle:', error);
      throw error;
    }
  }

  static async getNewPuzzle(
    anime?: string, 
    difficulty?: string, 
    preferDaily: boolean = true
  ): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (anime) params.append('anime', anime);
      if (difficulty) params.append('difficulty', difficulty);
      if (preferDaily) params.append('useDailyPuzzles', 'true');

      const response = await fetch(`/api/puzzle/new?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data.puzzle;
    } catch (error) {
      console.error('Error getting new puzzle:', error);
      throw error;
    }
  }

  static async regenerateDailyPuzzles(): Promise<{
    success: boolean;
    totalPuzzles?: number;
    message: string;
  }> {
    try {
      const response = await fetch('/api/daily-puzzles/regenerate', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to regenerate puzzles'
        };
      }
      
      return {
        success: true,
        totalPuzzles: data.totalPuzzles,
        message: data.message
      };
    } catch (error) {
      console.error('Error regenerating daily puzzles:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  static formatLastGenerated(timestamp: string): string {
    if (timestamp === 'Never') return 'Never';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffHours < 1) {
        return `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  static formatNextGeneration(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffHours < 1) {
        return `in ${diffMinutes} minutes`;
      } else if (diffHours < 24) {
        return `in ${diffHours} hours`;
      } else {
        return `tomorrow`;
      }
    } catch (error) {
      return 'Unknown';
    }
  }
}
