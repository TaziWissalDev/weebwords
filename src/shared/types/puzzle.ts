export interface AnimePuzzle {
  id: string;
  anime: string;
  character: string;
  difficulty: 'easy' | 'medium' | 'hard';
  quote_original: string;
  quote_puzzle: string;
  blanks: string[];
  tiles: string[];
  distractors: string[];
  hints: {
    character: string;
    context: string;
    emoji: string;
  };
  source: string;
}

export interface PuzzleState {
  currentPuzzle: AnimePuzzle | null;
  placedTiles: { [key: number]: string };
  availableTiles: string[];
  isCompleted: boolean;
  score: number;
  hintsUsed: number;
}

export interface GameStats {
  totalPuzzlesSolved: number;
  averageHintsUsed: number;
  favoriteAnime: string;
  currentStreak: number;
}
