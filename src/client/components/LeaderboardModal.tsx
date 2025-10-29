import React, { useState, useEffect } from 'react';
import { AnimeLeaderboard, BadgeLevel, BadgeInfo, GlobalLeaderboard } from '../../shared/types/leaderboard';
import { getBadgeInfo } from '../utils/badgeUtils';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboard | null>(null);
  const [userBadges, setUserBadges] = useState<{ [anime: string]: BadgeLevel }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGlobalLeaderboard();
    }
  }, [isOpen]);

  const fetchGlobalLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leaderboard/global');
      const data = await response.json();
      
      if (data.type === 'global-leaderboard') {
        setGlobalLeaderboard({
          topUsers: data.topUsers,
          userEntries: data.userEntries,
          userRank: data.userRank,
          totalPlayers: data.totalPlayers
        });
      }

      // Also fetch user badges
      const badgesResponse = await fetch('/api/leaderboard');
      const badgesData = await badgesResponse.json();
      if (badgesData.type === 'leaderboard') {
        setUserBadges(badgesData.userBadges);
      }
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Anime series configuration matching the image
  const animeSeriesConfig = [
    { name: 'Naruto', color: 'from-orange-400 to-red-500', mode: 'NARTO MODE', emoji: '🍃' },
    { name: 'One Piece', color: 'from-cyan-400 to-blue-500', mode: 'NARTO THOME', emoji: '🏴‍☠️' },
    { name: 'Attack on Titan', color: 'from-red-600 to-gray-700', mode: 'MEDIUM MODE', emoji: '⚔️' },
    { name: 'Death Note', color: 'from-gray-600 to-black', mode: 'WAIVE MODE', emoji: '📓' },
    { name: 'My Hero Academia', color: 'from-green-400 to-blue-500', mode: 'MEDIUM MODE', emoji: '💪' },
    { name: 'Demon Slayer', color: 'from-pink-500 to-purple-600', mode: 'MEDUE MODE', emoji: '🗡️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-1 sm:p-4 z-50">
      <div className="cyberpunk-bg w-full max-w-6xl h-[98vh] sm:h-[90vh] rounded-none sm:rounded-lg relative overflow-hidden">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        
        {/* Close Button - Mobile Friendly */}
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Close leaderboard"
        >
          <span className="text-white text-lg sm:text-xl font-bold">×</span>
        </button>
        
        {/* Header matching the image design */}
        <div className="relative z-10 p-2 sm:p-6 overflow-y-auto h-full">
          <div className="text-center mb-3 sm:mb-6 mt-8 sm:mt-0">
            <h1 className="anime-title text-xl sm:text-2xl lg:text-4xl mb-2">GLOBAL LEADERBOARDS</h1>
            <p className="anime-text-neon text-xs sm:text-sm lg:text-base">Ranked by Anime Universe</p>
          </div>

          {/* Anime Series Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-4 mb-3 sm:mb-6 px-1 sm:px-0">
            {animeSeriesConfig.map((anime, index) => {
              const userBadge = userBadges[anime.name];
              const badgeInfo = userBadge ? getBadgeInfo(userBadge) : null;
              
              return (
                <div key={anime.name} className="anime-series-card p-1 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl lg:text-3xl mb-1 sm:mb-2">{anime.emoji}</div>
                  <div className="anime-text-pixel text-white text-xs sm:text-sm mb-1 sm:mb-2 leading-tight">{anime.name}</div>
                  <div className="text-xs text-gray-300 mb-2 sm:mb-3 hidden lg:block">{anime.mode}</div>
                  {badgeInfo && (
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-xs sm:text-sm lg:text-lg">{badgeInfo.emoji}</span>
                      <span className="anime-text-pixel text-xs text-yellow-400 hidden lg:inline">{badgeInfo.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Global Leaderboard Table */}
          <div className="neon-card p-2 sm:p-6 mx-1 sm:mx-4 mb-3 sm:mb-6" style={{ 
            background: 'rgba(26, 26, 46, 0.95)', 
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(0, 245, 255, 0.6)',
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] sm:min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-cyan-400">
                    <th className="anime-text-pixel text-left py-2 sm:py-3 text-cyan-400 text-xs sm:text-sm font-bold">Rank</th>
                    <th className="anime-text-pixel text-left py-2 sm:py-3 text-cyan-400 text-xs sm:text-sm font-bold">Player</th>
                    <th className="anime-text-pixel text-center py-2 sm:py-3 text-cyan-400 text-xs sm:text-sm font-bold">Score</th>
                    <th className="anime-text-pixel text-center py-2 sm:py-3 text-cyan-400 text-xs sm:text-sm font-bold hidden sm:table-cell">⭐ Score</th>
                    <th className="anime-text-pixel text-center py-2 sm:py-3 text-cyan-400 text-xs sm:text-sm font-bold">⭐ Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 sm:py-8">
                        <div className="anime-loading mx-auto"></div>
                        <div className="anime-text-pixel text-cyan-400 mt-2 text-xs sm:text-sm">LOADING...</div>
                      </td>
                    </tr>
                  ) : globalLeaderboard?.topUsers.map((user, index) => {
                    const isCurrentUser = globalLeaderboard.userEntries.some(entry => entry.username === user.username);
                    const badgeInfo = getBadgeInfo(user.badgeLevel);
                    
                    return (
                      <tr 
                        key={`${user.username}-${user.anime}`}
                        className={`border-b border-gray-600 ${
                          isCurrentUser ? 'bg-green-500/20' : 'hover:bg-cyan-400/10'
                        }`}
                      >
                        <td className="py-2 sm:py-3">
                          <div className="flex items-center">
                            {index === 0 && <span className="text-lg sm:text-2xl mr-1 sm:mr-2">🥇</span>}
                            {index === 1 && <span className="text-lg sm:text-2xl mr-1 sm:mr-2">🥈</span>}
                            {index === 2 && <span className="text-lg sm:text-2xl mr-1 sm:mr-2">🥉</span>}
                            <span className="anime-text-pixel text-white text-xs sm:text-sm font-bold" style={{ textShadow: '0 0 5px rgba(255,255,255,0.5)' }}>
                              {index < 3 ? '' : `${index + 1}st`}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3">
                          <div className="anime-text-pixel text-white text-xs sm:text-sm font-bold" style={{ textShadow: '0 0 5px rgba(255,255,255,0.5)' }}>
                            u/{user.username}
                            {isCurrentUser && (
                              <span className="ml-1 sm:ml-2 text-xs bg-green-500 text-black px-1 sm:px-2 py-1 rounded font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-cyan-300 font-semibold" style={{ textShadow: '0 0 3px rgba(0,245,255,0.5)' }}>{user.anime}</div>
                        </td>
                        <td className="py-2 sm:py-3 text-center">
                          <div className="anime-text-pixel text-yellow-400 text-xs sm:text-sm font-bold" style={{ textShadow: '0 0 5px rgba(255,215,0,0.5)' }}>{user.totalScore.toLocaleString()}</div>
                        </td>
                        <td className="py-2 sm:py-3 text-center hidden sm:table-cell">
                          <div className="anime-text-pixel text-green-400 text-xs sm:text-sm font-bold" style={{ textShadow: '0 0 5px rgba(0,255,65,0.5)' }}>{user.averageScore}</div>
                        </td>
                        <td className="py-2 sm:py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-sm sm:text-lg">{badgeInfo.emoji}</span>
                            <span className="text-sm sm:text-lg">{badgeInfo.emoji}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Current User Row if not in top users */}
                  {globalLeaderboard?.userRank && globalLeaderboard.userRank > 20 && globalLeaderboard.userEntries.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={5} className="py-2 text-center">
                          <div className="anime-text-pixel text-gray-500 text-xs sm:text-sm">...</div>
                        </td>
                      </tr>
                      <tr className="bg-green-500/20 border-2 border-green-400">
                        <td className="py-2 sm:py-3">
                          <span className="anime-text-pixel text-white text-xs sm:text-sm">{globalLeaderboard.userRank}th</span>
                        </td>
                        <td className="py-2 sm:py-3">
                          <div className="anime-text-pixel text-white text-xs sm:text-sm">
                            u/WebMaster
                            <span className="ml-1 sm:ml-2 text-xs bg-green-500 text-black px-1 sm:px-2 py-1 rounded">
                              You
                            </span>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 text-center">
                          <div className="anime-text-pixel text-white text-xs sm:text-sm">
                            {globalLeaderboard.userEntries[0]?.totalScore.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 text-center hidden sm:table-cell">
                          <div className="anime-text-pixel text-yellow-400 text-xs sm:text-sm">
                            {globalLeaderboard.userEntries[0]?.averageScore || '0'}
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-sm sm:text-lg">⭐</span>
                            <span className="text-sm sm:text-lg">🔥</span>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back to Home Button - Mobile Friendly */}
          <div className="text-center pb-2 sm:pb-4 px-2 sm:px-0">
            <button
              onClick={onClose}
              className="pixel-button text-sm sm:text-lg lg:text-xl py-3 sm:py-4 px-4 sm:px-6 lg:px-8 animate-neon-glow w-full sm:w-auto"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              ← BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
