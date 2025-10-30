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

export interface CustomQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: {
    hint1: string;
    hint2: string;
    hint3: string;
  };
}

export type GamePuzzle = 
  | { type: 'word-puzzle'; wordPuzzle: AnimePuzzle }
  | { type: 'character-guess'; characterQuiz: CharacterQuiz }
  | { type: 'custom-question'; customQuestion: CustomQuestion };

export interface PuzzleState {
  currentPuzzle: AnimePuzzle | null;
  placedTiles: { [key: number]: string };
  availableTiles: string[];
  isCompleted: boolean;
  score: number;
  hintsUsed: number;
  timeRemaining?: number;
  timeLimit?: number;
  startTime?: number;
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
  challengesCreated?: number;
  challengesWon?: number;
  challengesLost?: number;
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

export interface MultiQuestionPuzzle {
  id: string;
  title: string;
  questions: CustomQuestion[];
  timeLimit: number; // in seconds per question
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  totalScore: number;
}

export interface PuzzleChallenge {
  id: string;
  createdBy: string;
  createdAt: string;
  title: string;
  description: string;
  puzzles: GamePuzzle[];
  multiQuestionPuzzles?: MultiQuestionPuzzle[]; // New field for multi-question support
  timeLimit: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  anime: string;
  isPublic: boolean;
  shareCode: string;
  completions: ChallengeCompletion[];
  maxAttempts?: number;
}

export interface ChallengeCompletion {
  username: string;
  completedAt: string;
  totalScore: number;
  timeUsed: number;
  hintsUsed: number;
  puzzleResults: PuzzleResult[];
}

export interface PuzzleResult {
  puzzleId: string;
  isCorrect: boolean;
  score: number;
  timeUsed: number;
  hintsUsed: number;
}

export interface DashboardStats {
  totalChallengesCreated: number;
  totalChallengesCompleted: number;
  challengesByAnime: { [anime: string]: { created: number; won: number; lost: number } };
  averageScore: number;
  bestTime: number;
  favoriteAnime: string;
  winRate: number;
}
