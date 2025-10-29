import React, { useState, useEffect } from 'react';
import { BadgeLevel } from '../../shared/types/leaderboard';
import { getBadgeInfo } from '../utils/badgeUtils';
import { LeaderboardModal } from './LeaderboardModal';
import { Dashboard } from './Dashboard';
import { ChallengeCreator } from './ChallengeCreator';

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
  concurrentPlayers: {
    current: number;
    todayMax: number;
    allTimeMax: number;
  };
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
  maxScore?: number;
  maxScoreDetails?: {
    score: number;
    puzzleType: string;
    anime: string;
    difficulty: string;
    achieved_at: string;
  };
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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showChallengeCreator, setShowChallengeCreator] = useState(false);

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
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="anime-title text-2xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4">
            ANIME PIXEL QUEST
          </h1>
          <p className="anime-text-neon text-sm sm:text-lg">
            Welcome back, {username}! Ready for your next adventure?
          </p>
        </div>

        {/* User Profile Card */}
        {userProfile && (
          <div className="neon-card p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-in mx-2 sm:mx-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Stats */}
              <div className="text-center">
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-cyan-400">{userProfile.totalScore.toLocaleString()}</div>
                <div className="anime-text-pixel text-xs text-gray-400">TOTAL SCORE</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-400">{userProfile.totalPuzzlesSolved}</div>
                <div className="anime-text-pixel text-xs text-gray-400">PUZZLES SOLVED</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-400">{userProfile.currentStreak}</div>
                <div className="anime-text-pixel text-xs text-gray-400">CURRENT STREAK</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-400">{userProfile.maxScore || 0}</div>
                <div className="anime-text-pixel text-xs text-gray-400">MAX SCORE</div>
                {userProfile.maxScoreDetails && (
                  <div className="anime-text-pixel text-xs text-purple-300 mt-1 hidden sm:block">
                    {userProfile.maxScoreDetails.anime} • {userProfile.maxScoreDetails.difficulty}
                  </div>
                )}
              </div>
            </div>

            {/* Hearts and Energy */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-8 mt-4 sm:mt-6">
              <div className="flex items-center space-x-2">
                <span className="anime-text-pixel text-xs sm:text-sm text-white">LIVES:</span>
                <div className="flex space-x-1">
                  {Array.from({ length: userProfile.maxHearts }).map((_, i) => (
                    <span key={i} className={`text-sm sm:text-base ${i < userProfile.hearts ? "text-red-500" : "text-gray-600"}`}>
                      ❤️
                    </span>
                  ))}
                </div>
                <span className="anime-text-pixel text-xs sm:text-sm text-white">{userProfile.hearts}/{userProfile.maxHearts}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="anime-text-pixel text-xs sm:text-sm text-white">⚡ ENERGY:</span>
                <div className="bg-gray-700 rounded-full h-3 sm:h-4 w-16 sm:w-20">
                  <div 
                    className="bg-yellow-400 h-3 sm:h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(userProfile.energy / userProfile.maxEnergy) * 100}%` }}
                  />
                </div>
                <span className="anime-text-pixel text-xs sm:text-sm text-white">{userProfile.energy}/{userProfile.maxEnergy}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-2 sm:px-0">
          <button
            onClick={onDailyChallenge}
            className="pixel-button text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-6 animate-purple-glow"
            style={{ 
              background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%)',
              color: '#fff'
            }}
          >
            ⚡ DAILY CHALLENGE ⚡
          </button>
          
          <button
            onClick={onStartGame}
            className="pixel-button text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-6 animate-neon-glow"
          >
            🔥 START ADVENTURE 🔥
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="pixel-button text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-6 animate-gold-glow"
            style={{ 
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255,215,0,0.8)'
            }}
          >
            🏆 LEADERBOARD 🏆
          </button>

          <button
            onClick={() => setShowChallengeCreator(true)}
            className="pixel-button text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-6"
            style={{ 
              background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-blue) 100%)',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            🚀 CREATE CHALLENGE 🚀
          </button>

          <button
            onClick={() => setShowDashboard(true)}
            className="pixel-button text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-6"
            style={{ 
              background: 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-yellow) 100%)',
              color: '#000',
              fontWeight: 'bold'
            }}
          >
            📊 DASHBOARD 📊
          </button>

          <button
            onClick={() => {/* TODO: Browse challenges */}}
            className="pixel-button text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-6"
            style={{ 
              background: 'linear-gradient(135deg, var(--neon-orange) 0%, var(--neon-red) 100%)',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            🔍 BROWSE CHALLENGES 🔍
          </button>
        </div>

        {/* TOP 3 GLOBAL CHAMPIONS - Prominent Display */}
        <div className="neon-card p-8 mb-8 animate-slide-in">
          <h2 className="anime-title text-3xl sm:text-4xl mb-6 text-center">🏆 TOP 3 GLOBAL CHAMPIONS 🏆</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeStats?.globalTop5.slice(0, 3).map((champion, index) => (
              <div 
                key={champion.username} 
                className={`relative p-6 rounded-lg border-2 ${
                  index === 0 ? 'border-yellow-400 bg-yellow-500/10' :
                  index === 1 ? 'border-gray-400 bg-gray-500/10' :
                  'border-orange-400 bg-orange-500/10'
                } animate-bounce-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Crown/Medal */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">
                    {index === 0 && '👑'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </div>
                  <div className={`anime-text-pixel text-sm ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-400' :
                    'text-orange-400'
                  }`}>
                    {index === 0 ? 'CHAMPION' : index === 1 ? 'RUNNER-UP' : '3RD PLACE'}
                  </div>
                </div>

                {/* Player Info */}
                <div className="text-center">
                  <div className="anime-text-pixel text-white text-lg mb-2">{champion.username}</div>
                  <div className="anime-text-pixel text-cyan-400 text-xs mb-2">{champion.favorite_anime}</div>
                  <div className={`text-2xl font-bold mb-2 ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    'text-orange-400'
                  }`}>
                    {champion.total_score.toLocaleString()}
                  </div>
                  <div className="anime-text-pixel text-xs text-gray-400 mb-3">TOTAL SCORE</div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-green-400 font-bold">{champion.total_puzzles}</div>
                      <div className="anime-text-pixel text-gray-400">PUZZLES</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">{champion.total_badges}</div>
                      <div className="anime-text-pixel text-gray-400">BADGES</div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-lg opacity-20 ${
                  index === 0 ? 'bg-yellow-400' :
                  index === 1 ? 'bg-gray-400' :
                  'bg-orange-400'
                } animate-pulse`}></div>
              </div>
            ))}
          </div>

          {/* View Full Leaderboard Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="pixel-button text-lg py-4 px-8 animate-neon-glow"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                color: '#fff'
              }}
            >
              📊 VIEW FULL LEADERBOARD & YOUR RANK
            </button>
          </div>
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
                  <div className="anime-text-pixel text-yellow-400">DAILY CHAMPION</div>
                  <div className="text-white font-bold">{homeStats.dailyTopScorer.username}</div>
                  <div className="text-yellow-400 text-xl font-bold">{homeStats.dailyTopScorer.score.toLocaleString()} pts</div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {dailyLeaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.username} className="flex items-center justify-between bg-gray-800/30 p-3 rounded hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-center min-w-[30px]">
                      {index === 0 && <span className="text-xl">🥇</span>}
                      {index === 1 && <span className="text-xl">🥈</span>}
                      {index === 2 && <span className="text-xl">🥉</span>}
                      {index > 2 && <span className="anime-text-pixel text-gray-400">#{index + 1}</span>}
                    </div>
                    <div className="anime-text-pixel text-white text-sm font-bold">{entry.username}</div>
                  </div>
                  <div className="anime-text-pixel text-cyan-400 text-sm font-bold">{entry.score.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="anime-text-pixel text-cyan-400 text-xs hover:text-cyan-300 transition-colors"
              >
                → View All Daily Rankings
              </button>
            </div>
          </div>

          {/* Recent Global Activity */}
          <div className="neon-card p-6">
            <h3 className="anime-text-neon text-xl mb-4 text-center">RECENT CHAMPIONS</h3>
            <div className="space-y-2">
              {homeStats?.globalTop5.slice(3, 8).map((entry, index) => (
                <div key={entry.username} className="flex items-center justify-between bg-gray-800/30 p-3 rounded hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-center min-w-[30px]">
                      <span className="anime-text-pixel text-gray-400">#{index + 4}</span>
                    </div>
                    <div>
                      <div className="anime-text-pixel text-white text-sm font-bold">{entry.username}</div>
                      <div className="anime-text-pixel text-gray-400 text-xs">{entry.favorite_anime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="anime-text-pixel text-cyan-400 text-sm font-bold">{entry.total_score.toLocaleString()}</div>
                    <div className="flex items-center space-x-1 justify-end">
                      <span className="text-xs">🏆</span>
                      <span className="anime-text-pixel text-yellow-400 text-xs">{entry.total_badges}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="anime-text-pixel text-cyan-400 text-xs hover:text-cyan-300 transition-colors"
              >
                → View Your Position & All Players
              </button>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        {homeStats && (
          <div className="neon-card p-6 text-center">
            <h3 className="anime-text-neon text-xl mb-4">COMMUNITY STATS</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
                <div className="text-2xl font-bold text-purple-400">{homeStats.concurrentPlayers.current}</div>
                <div className="anime-text-pixel text-xs text-gray-400">ONLINE NOW</div>
              </div>
            </div>

            {/* Concurrent Player Stats */}
            <div className="border-t border-cyan-400/30 pt-4">
              <h4 className="anime-text-pixel text-cyan-400 text-sm mb-3">CONCURRENT PLAYERS</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/30 p-3 rounded">
                  <div className="text-lg font-bold text-green-400">{homeStats.concurrentPlayers.current}</div>
                  <div className="anime-text-pixel text-xs text-gray-400">CURRENT</div>
                </div>
                <div className="bg-gray-800/30 p-3 rounded">
                  <div className="text-lg font-bold text-yellow-400">{homeStats.concurrentPlayers.todayMax}</div>
                  <div className="anime-text-pixel text-xs text-gray-400">TODAY'S MAX</div>
                </div>
                <div className="bg-gray-800/30 p-3 rounded">
                  <div className="text-lg font-bold text-purple-400">{homeStats.concurrentPlayers.allTimeMax}</div>
                  <div className="anime-text-pixel text-xs text-gray-400">ALL-TIME MAX</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <LeaderboardModal 
          isOpen={showLeaderboard} 
          onClose={() => setShowLeaderboard(false)} 
        />
        
        {showDashboard && (
          <Dashboard 
            onClose={() => setShowDashboard(false)}
            onCreateChallenge={() => {
              setShowDashboard(false);
              setShowChallengeCreator(true);
            }}
          />
        )}
        
        {showChallengeCreator && (
          <ChallengeCreator
            onChallengeCreated={(challenge) => {
              setShowChallengeCreator(false);
              // TODO: Show success message or navigate to challenge
              console.log('Challenge created:', challenge);
            }}
            onClose={() => setShowChallengeCreator(false)}
          />
        )}
      </div>
    </div>
  );
};
