import { AnimePuzzle, CharacterQuiz } from './puzzle';

export interface DailyPuzzleSet {
  date: string; // YYYY-MM-DD format
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordPuzzles: AnimePuzzle[];
  characterQuizzes: CharacterQuiz[];
  generatedAt: string; // ISO timestamp
}

export interface DailyPuzzleCollection {
  date: string;
  puzzleSets: DailyPuzzleSet[];
  totalPuzzles: number;
  generatedAt: string;
}

export interface PuzzleTemplate {
  anime: string;
  characters: string[];
  themes: string[];
  quotePatterns: string[];
  vocabulary: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
}

export interface GenerationConfig {
  puzzlesPerAnimePerDifficulty: number;
  supportedAnimes: string[];
  supportedDifficulties: ('easy' | 'medium' | 'hard')[];
  refreshHour: number; // Hour of day to refresh (0-23)
}
