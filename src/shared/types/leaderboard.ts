export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'master';

export type UserAnimeStats = {
  username: string;
  anime: string;
  puzzlesSolved: number;
  totalScore: number;
  averageScore: number;
  bestScore?: number;
  badgeLevel: BadgeLevel;
  lastPlayed: string;
  difficultyStats?: {
    easy: number;
    medium: number;
    hard: number;
  };
};

export type AnimeLeaderboard = {
  anime: string;
  totalPuzzles: number;
  topUsers: UserAnimeStats[];
  userRank?: number;
  userStats?: UserAnimeStats;
};

export type LeaderboardResponse = {
  type: 'leaderboard';
  leaderboards: AnimeLeaderboard[];
  userBadges: { [anime: string]: BadgeLevel };
};

export type BadgeInfo = {
  level: BadgeLevel;
  name: string;
  emoji: string;
  color: string;
  requirement: string;
  minPuzzles: number;
  minAvgScore: number;
};
export type GlobalLeaderboard = {
  topUsers: UserAnimeStats[];
  userEntries: UserAnimeStats[];
  userRank?: number;
  totalPlayers: number;
};

export type UserProfile = {
  username: string;
  totalPuzzlesSolved: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  animeStats: UserAnimeStats[];
  badges: { [anime: string]: BadgeLevel };
  globalRank?: number;
  favoriteAnime?: string;
};

export type LeaderboardStats = {
  totalPlayers: number;
  totalGames: number;
  animeStats: { [anime: string]: { players: number; games: number } };
};

export type ScoreSubmission = {
  anime: string;
  score: number;
  difficulty?: string;
  puzzleType?: string;
};

export type RankResponse = {
  anime: string;
  rank: number;
  stats?: UserAnimeStats;
  totalPlayers: number;
};
