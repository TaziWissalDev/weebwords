// Daily Pack API Types
export type PuzzleType = 'quote_fill' | 'emoji_sensei' | 'who_said_it' | 'mood_match' | 'who_am_i';

export interface DailyPackMeta {
  date: string; // YYYY-MM-DD
  language: string;
  pack: string; // daily-YYYY-MM-DD
}

export interface PuzzleFeedback {
  perfect: string;
  good: string;
  average: string;
  bad: string;
}

export interface PixelReaction {
  on_correct: string;
  on_fail: string;
}

export interface BasePuzzle {
  id: string;
  type: PuzzleType;
  anime: string;
  character: string | null;
  feedback: PuzzleFeedback;
  pixel_reaction: PixelReaction;
}

// Quote Fill: Fill missing words in anime quotes
export interface QuoteFillData {
  quote: string; // with ____ blanks
  options: string[]; // word choices
  correct: number[]; // indices of correct options
  original: string; // full quote
}

export interface QuoteFillPuzzle extends BasePuzzle {
  type: 'quote_fill';
  data: QuoteFillData;
}

// Emoji Sensei: Fill blanks with emojis by meaning
export interface EmojiSenseiData {
  text: string; // with ____ blanks
  blanks: string[]; // descriptions of what emoji should go there
  correct_emojis: string[]; // correct emoji answers
  emoji_options: string[]; // all emoji choices
}

export interface EmojiSenseiPuzzle extends BasePuzzle {
  type: 'emoji_sensei';
  data: EmojiSenseiData;
}

// Who Said It: MCQ speaker identification
export interface WhoSaidItData {
  quote: string;
  options: string[]; // character names
  correct: number; // index of correct character
}

export interface WhoSaidItPuzzle extends BasePuzzle {
  type: 'who_said_it';
  data: WhoSaidItData;
}

// Mood Match: Pick tone emoji
export interface MoodMatchData {
  quote: string;
  context: string; // situation description
  mood_options: string[]; // emoji choices
  correct: number; // index of correct mood emoji
}

export interface MoodMatchPuzzle extends BasePuzzle {
  type: 'mood_match';
  data: MoodMatchData;
}

// Who Am I: First-person riddle with hints
export interface WhoAmIData {
  riddle: string; // first-person description
  hints: [string, string, string]; // hard to easy
  answer: string; // character name
  alternatives: string[]; // accepted variations
}

export interface WhoAmIPuzzle extends BasePuzzle {
  type: 'who_am_i';
  data: WhoAmIData;
}

export type Puzzle = QuoteFillPuzzle | EmojiSenseiPuzzle | WhoSaidItPuzzle | MoodMatchPuzzle | WhoAmIPuzzle;

export interface DailyPack {
  meta: DailyPackMeta;
  puzzles: Puzzle[];
}

// Score submission
export interface ScoreMetrics {
  timeMs: number;
  hintsUsed: number;
  accuracy: number;
}

export interface ScoreSubmission {
  user: string; // u/Name
  puzzleId: string;
  type: PuzzleType;
  metrics: ScoreMetrics;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  user: string;
  score: number;
  streak: number;
}

export interface LeaderboardResponse {
  type: PuzzleType | 'global';
  date: string;
  entries: LeaderboardEntry[];
}
