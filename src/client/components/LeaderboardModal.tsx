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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="cyberpunk-bg w-full max-w-6xl h-[90vh] rounded-lg relative overflow-hidden">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        
        {/* Header matching the image design */}
        <div className="relative z-10 p-6">
          <div className="text-center mb-6">
            <h1 className="anime-title text-4xl mb-2">GLOBAL LEADERBOARDS</h1>
            <p className="anime-text-neon">Ranked by Anime Universe</p>
          </div>

          {/* Anime Series Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {animeSeriesConfig.map((anime, index) => {
              const userBadge = userBadges[anime.name];
              const badgeInfo = userBadge ? getBadgeInfo(userBadge) : null;
              
              return (
                <div key={anime.name} className="anime-series-card p-4 text-center">
                  <div className="text-3xl mb-2">{anime.emoji}</div>
                  <div className="anime-text-pixel text-white text-sm mb-2">{anime.name}</div>
                  <div className="text-xs text-gray-300 mb-3">{anime.mode}</div>
                  {badgeInfo && (
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-lg">{badgeInfo.emoji}</span>
                      <span className="anime-text-pixel text-xs text-yellow-400">{badgeInfo.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Global Leaderboard Table */}
          <div className="neon-card p-6 mx-4 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-cyan-400">
                    <th className="anime-text-pixel text-left py-3 text-cyan-400">Rank</th>
                    <th className="anime-text-pixel text-left py-3 text-cyan-400">Player</th>
                    <th className="anime-text-pixel text-center py-3 text-cyan-400">Score</th>
                    <th className="anime-text-pixel text-center py-3 text-cyan-400">⭐ Score</th>
                    <th className="anime-text-pixel text-center py-3 text-cyan-400">⭐ Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="anime-loading mx-auto"></div>
                        <div className="anime-text-pixel text-cyan-400 mt-2">LOADING...</div>
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
                        <td className="py-3">
                          <div className="flex items-center">
                            {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                            {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                            {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                            <span className="anime-text-pixel text-white">
                              {index < 3 ? '' : `${index + 1}st`}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="anime-text-pixel text-white">
                            u/{user.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-green-500 text-black px-2 py-1 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{user.anime}</div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="anime-text-pixel text-white">{user.totalScore.toLocaleString()}</div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="anime-text-pixel text-yellow-400">{user.averageScore}</div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg">{badgeInfo.emoji}</span>
                            <span className="text-lg">{badgeInfo.emoji}</span>
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
                          <div className="anime-text-pixel text-gray-500">...</div>
                        </td>
                      </tr>
                      <tr className="bg-green-500/20 border-2 border-green-400">
                        <td className="py-3">
                          <span className="anime-text-pixel text-white">{globalLeaderboard.userRank}th</span>
                        </td>
                        <td className="py-3">
                          <div className="anime-text-pixel text-white">
                            u/WebMaster
                            <span className="ml-2 text-xs bg-green-500 text-black px-2 py-1 rounded">
                              You
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="anime-text-pixel text-white">
                            {globalLeaderboard.userEntries[0]?.totalScore.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="anime-text-pixel text-yellow-400">
                            {globalLeaderboard.userEntries[0]?.averageScore || '0'}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg">⭐</span>
                            <span className="text-lg">🔥</span>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back to Menu Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="neon-button"
            >
              ← BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
