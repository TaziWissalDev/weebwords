import { GameStats, GamePuzzle } from './puzzle';
import { LeaderboardResponse } from './leaderboard';

export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  currentPuzzle: GamePuzzle | null;
  gameStats: GameStats;
};

export type GetPuzzleResponse = {
  type: 'puzzle';
  puzzle: GamePuzzle;
};

export type SubmitSolutionRequest = {
  puzzleId: string;
  solution: string[];
  hintsUsed: number;
};

export type SubmitCharacterGuessRequest = {
  quizId: string;
  guess: string;
  hintsUsed: number;
};

export type SubmitSolutionResponse = {
  type: 'solution';
  isCorrect: boolean;
  score: number;
  nextPuzzle?: GamePuzzle;
};

export type GetHintRequest = {
  quizId: string;
  hintNumber: number;
};

export type GetHintResponse = {
  type: 'hint';
  hint: string;
  characterResponse: string;
};

export type GetLeaderboardResponse = LeaderboardResponse;
