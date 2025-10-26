import { AnimePuzzle, PuzzleState, GameStats } from './puzzle';

export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  currentPuzzle: AnimePuzzle | null;
  gameStats: GameStats;
};

export type GetPuzzleResponse = {
  type: 'puzzle';
  puzzle: AnimePuzzle;
};

export type SubmitSolutionRequest = {
  puzzleId: string;
  solution: string[];
  hintsUsed: number;
};

export type SubmitSolutionResponse = {
  type: 'solution';
  isCorrect: boolean;
  score: number;
  nextPuzzle?: AnimePuzzle;
};
