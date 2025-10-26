import React, { useState, useEffect } from 'react';
import { AnimeLeaderboard, BadgeLevel, BadgeInfo } from '../../shared/types/leaderboard';
import { getBadgeInfo } from '../utils/badgeUtils';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [leaderboards, setLeaderboards] = useState<AnimeLeaderboard[]>([]);
  const [userBadges, setUserBadges] = useState<{ [anime: string]: BadgeLevel }>({});
  const [selectedAnime, setSelectedAnime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboards();
    }
  }, [isOpen]);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (data.type === 'leaderboard') {
        setLeaderboards(data.leaderboards);
        setUserBadges(data.userBadges);
        
        // Set first anime as selected by default
        if (data.leaderboards.length > 0) {
          setSelectedAnime(data.leaderboards[0].anime);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedLeaderboard = leaderboards.find(lb => lb.anime === selectedAnime);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">🏆 Anime Leaderboards</h2>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">See who's mastered each anime series!</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl sm:text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[500px] sm:h-[600px]">
          {/* Anime Selection Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto max-h-[200px] md:max-h-none">
            <div className="p-2 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Select Anime</h3>
              <div className="space-y-2">
                {leaderboards.map((leaderboard) => {
                  const badge = userBadges[leaderboard.anime];
                  const badgeInfo = badge ? getBadgeInfo(badge) : null;
                  
                  return (
                    <button
                      key={leaderboard.anime}
                      onClick={() => setSelectedAnime(leaderboard.anime)}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors ${
                        selectedAnime === leaderboard.anime
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800 text-sm sm:text-base">{leaderboard.anime}</div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {leaderboard.totalPuzzles} puzzles
                          </div>
                        </div>
                        {badgeInfo && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm sm:text-lg">{badgeInfo.emoji}</span>
                            <span className={`text-xs font-medium ${badgeInfo.color} hidden sm:inline`}>
                              {badgeInfo.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leaderboard Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : selectedLeaderboard ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedLeaderboard.anime} Leaderboard
                  </h3>
                  <p className="text-gray-600">
                    Top players who've mastered {selectedLeaderboard.anime} puzzles
                  </p>
                </div>

                {/* User's Rank (if applicable) */}
                {selectedLeaderboard.userStats && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-800">Your Rank</div>
                        <div className="text-sm text-blue-600">
                          #{selectedLeaderboard.userRank} • {selectedLeaderboard.userStats.puzzlesSolved} puzzles solved
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-800">
                          {selectedLeaderboard.userStats.averageScore} avg
                        </div>
                        {userBadges[selectedLeaderboard.anime] && (
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <span className="text-sm">
                              {getBadgeInfo(userBadges[selectedLeaderboard.anime]).emoji}
                            </span>
                            <span className={`text-xs font-medium ${getBadgeInfo(userBadges[selectedLeaderboard.anime]).color}`}>
                              {getBadgeInfo(userBadges[selectedLeaderboard.anime]).name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Users */}
                <div className="space-y-3">
                  {selectedLeaderboard.topUsers.map((user, index) => {
                    const badgeInfo = getBadgeInfo(user.badgeLevel);
                    const isCurrentUser = selectedLeaderboard.userStats?.username === user.username;
                    
                    return (
                      <div
                        key={user.username}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isCurrentUser 
                            ? 'bg-yellow-50 border-yellow-300' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center min-w-[40px]">
                            {index === 0 && <span className="text-2xl">🥇</span>}
                            {index === 1 && <span className="text-2xl">🥈</span>}
                            {index === 2 && <span className="text-2xl">🥉</span>}
                            {index > 2 && (
                              <span className="text-lg font-bold text-gray-500">
                                #{index + 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {user.username}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.puzzlesSolved} puzzles solved
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-bold text-gray-800">
                                {user.averageScore}
                              </div>
                              <div className="text-xs text-gray-500">avg score</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-lg">{badgeInfo.emoji}</span>
                              <span className={`text-xs font-medium ${badgeInfo.color}`}>
                                {badgeInfo.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedLeaderboard.topUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">🎌</div>
                    <p>No one has solved puzzles for this anime yet.</p>
                    <p className="text-sm mt-2">Be the first to claim the top spot!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select an anime to view its leaderboard
              </div>
            )}
          </div>
        </div>

        {/* Badge Legend */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-2 font-medium">Badge Levels:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            {[
              { level: 'bronze', name: 'Apprentice', emoji: '🥉', req: '3+ puzzles' },
              { level: 'silver', name: 'Scholar', emoji: '🥈', req: '5+ puzzles, 75+ avg' },
              { level: 'gold', name: 'Expert', emoji: '🥇', req: '8+ puzzles, 100+ avg' },
              { level: 'platinum', name: 'Master', emoji: '💎', req: '12+ puzzles, 150+ avg' },
              { level: 'master', name: 'Legendary', emoji: '👑', req: '15+ puzzles, 200+ avg' }
            ].map((badge) => (
              <div key={badge.level} className="flex items-center space-x-1">
                <span>{badge.emoji}</span>
                <span className="font-medium">{badge.name}</span>
                <span className="text-gray-500">({badge.req})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
