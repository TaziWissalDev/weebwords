export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'master';

export type UserAnimeStats = {
  username: string;
  anime: string;
  puzzlesSolved: number;
  totalScore: number;
  averageScore: number;
  badgeLevel: BadgeLevel;
  lastPlayed: string;
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
