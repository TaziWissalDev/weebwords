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

export interface CharacterQuiz {
  id: string;
  anime: string;
  character: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  characterVoice: string;
  hints: {
    hint1: string;
    hint2: string;
    hint3: string;
    finalHint: string;
  };
  hintResponses: {
    hint1Response: string;
    hint2Response: string;
    hint3Response: string;
    finalHintResponse: string;
  };
  correctAnswer: string;
  alternativeAnswers: string[];
  source: string;
}

export type QuizType = 'word-puzzle' | 'character-guess';

export interface GamePuzzle {
  type: QuizType;
  wordPuzzle?: AnimePuzzle;
  characterQuiz?: CharacterQuiz;
}

export interface PuzzleState {
  currentPuzzle: AnimePuzzle | null;
  placedTiles: { [key: number]: string };
  availableTiles: string[];
  isCompleted: boolean;
  score: number;
  hintsUsed: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'hearts' | 'energy' | 'streak' | 'puzzles' | 'anime';
  reward?: {
    hearts?: number;
    energy?: number;
    maxHearts?: number;
    maxEnergy?: number;
  };
}

export interface GameStats {
  totalPuzzlesSolved: number;
  averageHintsUsed: number;
  favoriteAnime: string;
  currentStreak: number;
  hearts: number;
  maxHearts: number;
  energy: number;
  maxEnergy: number;
  lastEnergyReset: number;
  badges: Badge[];
  unlockedBadges: string[];
  level: number;
  experience: number;
}

export interface AnimeTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  effects: {
    particles?: boolean;
    animations?: string[];
  };
}
