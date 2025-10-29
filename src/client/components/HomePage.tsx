import React, { useState, useEffect } from 'react';
import { BadgeLevel } from '../../shared/types/leaderboard';
import { getBadgeInfo } from '../utils/badgeUtils';

interface HomePageProps {
  username: string;
  onStartGame: () => void;
  onDailyChallenge: () => void;
}

interface HomeStats {
  dailyTopScorer: {
    username: string;
    score: number;
    challenge_date: string;
    rank_position: number;
  } | null;
  globalTop5: Array<{
    username: string;
    total_score: number;
    total_puzzles: number;
    average_score: number;
    favorite_anime: string;
    total_badges: number;
    rank_position: number;
  }>;
  totalUsers: number;
  todaysPuzzlesSolved: number;
  lastUpdated: string;
}

interface UserProfile {
  username: string;
  totalScore: number;
  totalPuzzlesSolved: number;
  currentStreak: number;
  bestStreak: number;
  favoriteAnime: string;
  level: number;
  experience: number;
  hearts: number;
  maxHearts: number;
  energy: number;
  maxEnergy: number;
  badges: { [anime: string]: BadgeLevel };
}

export const HomePage: React.FC<HomePageProps> = ({
  username,
  onStartGame,
  onDailyChallenge
}) => {
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyLeaderboard, setDailyLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [statsResponse, profileResponse, dailyResponse] = await Promise.all([
        fetch('/api/home/stats'),
        fetch('/api/profile'),
        fetch('/api/daily-challenge/leaderboard')
      ]);

      const [statsData, profileData, dailyData] = await Promise.all([
        statsResponse.json(),
        profileResponse.json(),
        dailyResponse.json()
      ]);

      if (statsData.type === 'home-stats') {
        setHomeStats(statsData);
      }

      if (profileData.type === 'profile') {
        setUserProfile(profileData);
      }

      if (dailyData.type === 'daily-challenge-leaderboard') {
        setDailyLeaderboard(dailyData.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cyberpunk-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="anime-loading mx-auto mb-4" style={{ width: '64px', height: '64px' }}></div>
          <p className="anime-text-neon text-xl">LOADING ANIME QUEST...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
      <div className="cyber-grid"></div>
      <div className="scan-lines"></div>
      <div className="anime-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="anime-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="anime-title text-4xl sm:text-6xl mb-4">
            ANIME PIXEL QUEST
          </h1>
          <p className="anime-text-neon text-lg">
            Welcome back, {username}! Ready for your next adventure?
          </p>
        </div>

        {/* User Profile Card */}
        {userProfile && (
          <div className="neon-card p-6 mb-8 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats */}
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{userProfile.totalScore.toLocaleString()}</div>
                <div className="anime-text-pixel text-xs text-gray-400">TOTAL SCORE</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{userProfile.totalPuzzlesSolved}</div>
                <div className="anime-text-pixel text-xs text-gray-400">PUZZLES SOLVED</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{userProfile.currentStreak}</div>
                <div className="anime-text-pixel text-xs text-gray-400">CURRENT STREAK</div>
              </div>
            </div>

            {/* Hearts and Energy */}
            <div className="flex justify-center items-center space-x-8 mt-6">
              <div className="flex items-center space-x-2">
                <span className="anime-text-pixel text-sm text-white">LIVES:</span>
                <div className="flex space-x-1">
                  {Array.from({ length: userProfile.maxHearts }).map((_, i) => (
                    <span key={i} className={i < userProfile.hearts ? "text-red-500" : "text-gray-600"}>
                      ❤️
                    </span>
                  ))}
                </div>
                <span className="anime-text-pixel text-sm text-white">{userProfile.hearts}/{userProfile.maxHearts}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="anime-text-pixel text-sm text-white">⚡ ENERGY:</span>
                <div className="bg-gray-700 rounded-full h-4 w-20">
                  <div 
                    className="bg-yellow-400 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(userProfile.energy / userProfile.maxEnergy) * 100}%` }}
                  />
                </div>
                <span className="anime-text-pixel text-sm text-white">{userProfile.energy}/{userProfile.maxEnergy}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6">
              <div className="anime-text-pixel text-sm text-cyan-400 mb-3 text-center">EARNED BADGES</div>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(userProfile.badges).map(([anime, badgeLevel]) => {
                  const badgeInfo = getBadgeInfo(badgeLevel);
                  return (
                    <div key={anime} className="flex items-center space-x-1 bg-gray-800/50 px-2 py-1 rounded">
                      <span className="text-lg">{badgeInfo.emoji}</span>
                      <span className="anime-text-pixel text-xs text-white">{anime}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={onDailyChallenge}
            className="pixel-button text-xl py-6 px-8 animate-purple-glow"
            style={{ 
              background: 'linear-gradient(135deg, var(--ui-purple) 0%, var(--ui-pink) 100%)',
              color: '#fff'
            }}
          >
            ⚡ DAILY CHALLENGE ⚡
          </button>
          
          <button
            onClick={onStartGame}
            className="pixel-button text-xl py-6 px-8 animate-neon-glow"
          >
            🔥 START ADVENTURE 🔥
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Challenge Leaderboard */}
          <div className="neon-card p-6">
            <h3 className="anime-text-neon text-xl mb-4 text-center">TODAY'S DAILY CHALLENGE</h3>
            {homeStats?.dailyTopScorer && (
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">👑</div>
                  <div className="anime-text-pixel text-yellow-400">TOP SCORER</div>
                  <div className="text-white font-bold">{homeStats.dailyTopScorer.username}</div>
                  <div className="text-yellow-400 text-xl font-bold">{homeStats.dailyTopScorer.score.toLocaleString()} pts</div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {dailyLeaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.username} className="flex items-center justify-between bg-gray-800/30 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="text-center min-w-[30px]">
                      {index === 0 && <span className="text-xl">🥇</span>}
                      {index === 1 && <span className="text-xl">🥈</span>}
                      {index === 2 && <span className="text-xl">🥉</span>}
                      {index > 2 && <span className="anime-text-pixel text-gray-400">#{index + 1}</span>}
                    </div>
                    <div className="anime-text-pixel text-white text-sm">{entry.username}</div>
                  </div>
                  <div className="anime-text-pixel text-cyan-400 text-sm">{entry.score.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Leaderboard */}
          <div className="neon-card p-6">
            <h3 className="anime-text-neon text-xl mb-4 text-center">GLOBAL CHAMPIONS</h3>
            <div className="space-y-2">
              {homeStats?.globalTop5.map((entry, index) => (
                <div key={entry.username} className="flex items-center justify-between bg-gray-800/30 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="text-center min-w-[30px]">
                      {index === 0 && <span className="text-xl">👑</span>}
                      {index === 1 && <span className="text-xl">🥈</span>}
                      {index === 2 && <span className="text-xl">🥉</span>}
                      {index > 2 && <span className="anime-text-pixel text-gray-400">#{index + 1}</span>}
                    </div>
                    <div>
                      <div className="anime-text-pixel text-white text-sm">{entry.username}</div>
                      <div className="anime-text-pixel text-gray-400 text-xs">{entry.favorite_anime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="anime-text-pixel text-cyan-400 text-sm">{entry.total_score.toLocaleString()}</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">🏆</span>
                      <span className="anime-text-pixel text-yellow-400 text-xs">{entry.total_badges}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        {homeStats && (
          <div className="neon-card p-6 text-center">
            <h3 className="anime-text-neon text-xl mb-4">COMMUNITY STATS</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-cyan-400">{homeStats.totalUsers.toLocaleString()}</div>
                <div className="anime-text-pixel text-xs text-gray-400">TOTAL PLAYERS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{homeStats.todaysPuzzlesSolved.toLocaleString()}</div>
                <div className="anime-text-pixel text-xs text-gray-400">TODAY'S PUZZLES</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{dailyLeaderboard.length}</div>
                <div className="anime-text-pixel text-xs text-gray-400">DAILY CHALLENGERS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="anime-text-pixel text-xs text-gray-400">ALWAYS ONLINE</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
