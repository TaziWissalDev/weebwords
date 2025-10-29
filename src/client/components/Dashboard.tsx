import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../../shared/types/puzzle';

interface DashboardProps {
  onClose: () => void;
  onCreateChallenge: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onClose, onCreateChallenge }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentChallenges, setRecentChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, challengesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/challenges/recent')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        setRecentChallenges(challengesData.challenges || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="anime-loading mx-auto mb-4" style={{ width: '64px', height: '64px' }}></div>
          <p className="anime-text-neon text-xl">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="cyberpunk-bg w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-lg relative overflow-hidden">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200"
        >
          <span className="text-white text-xl font-bold">×</span>
        </button>

        <div className="relative z-10 p-4 sm:p-6 overflow-y-auto h-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="anime-title text-2xl sm:text-4xl mb-2">CHALLENGE DASHBOARD</h1>
            <p className="anime-text-neon text-sm sm:text-base">Track your challenge creation and performance</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={onCreateChallenge}
              className="pixel-button text-lg py-4 px-6 animate-neon-glow"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                color: '#fff'
              }}
            >
              🚀 CREATE NEW CHALLENGE
            </button>
            
            <button
              onClick={() => {/* TODO: Implement browse challenges */}}
              className="pixel-button text-lg py-4 px-6"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-yellow) 0%, var(--neon-orange) 100%)',
                color: '#000'
              }}
            >
              🔍 BROWSE CHALLENGES
            </button>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="neon-card p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{stats.totalChallengesCreated}</div>
                <div className="anime-text-pixel text-xs text-gray-400">CREATED</div>
              </div>
              <div className="neon-card p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.totalChallengesCompleted}</div>
                <div className="anime-text-pixel text-xs text-gray-400">COMPLETED</div>
              </div>
              <div className="neon-card p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{Math.round(stats.winRate * 100)}%</div>
                <div className="anime-text-pixel text-xs text-gray-400">WIN RATE</div>
              </div>
              <div className="neon-card p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">{Math.round(stats.averageScore)}</div>
                <div className="anime-text-pixel text-xs text-gray-400">AVG SCORE</div>
              </div>
            </div>
          )}

          {/* Anime Performance Breakdown */}
          {stats && Object.keys(stats.challengesByAnime).length > 0 && (
            <div className="neon-card p-4 sm:p-6 mb-6">
              <h3 className="anime-text-neon text-xl mb-4 text-center">PERFORMANCE BY ANIME</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-cyan-400">
                      <th className="anime-text-pixel text-left py-3 text-cyan-400 text-sm">ANIME</th>
                      <th className="anime-text-pixel text-center py-3 text-cyan-400 text-sm">CREATED</th>
                      <th className="anime-text-pixel text-center py-3 text-cyan-400 text-sm">WON</th>
                      <th className="anime-text-pixel text-center py-3 text-cyan-400 text-sm">LOST</th>
                      <th className="anime-text-pixel text-center py-3 text-cyan-400 text-sm">WIN RATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.challengesByAnime).map(([anime, data]) => {
                      const winRate = data.won + data.lost > 0 ? (data.won / (data.won + data.lost)) * 100 : 0;
                      return (
                        <tr key={anime} className="border-b border-gray-600 hover:bg-cyan-400/10">
                          <td className="py-3">
                            <div className="anime-text-pixel text-white text-sm font-bold">{anime}</div>
                          </td>
                          <td className="py-3 text-center">
                            <div className="anime-text-pixel text-cyan-400 text-sm">{data.created}</div>
                          </td>
                          <td className="py-3 text-center">
                            <div className="anime-text-pixel text-green-400 text-sm">{data.won}</div>
                          </td>
                          <td className="py-3 text-center">
                            <div className="anime-text-pixel text-red-400 text-sm">{data.lost}</div>
                          </td>
                          <td className="py-3 text-center">
                            <div className={`anime-text-pixel text-sm ${
                              winRate >= 70 ? 'text-green-400' :
                              winRate >= 50 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {Math.round(winRate)}%
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Challenges */}
          <div className="neon-card p-4 sm:p-6">
            <h3 className="anime-text-neon text-xl mb-4 text-center">RECENT CHALLENGES</h3>
            {recentChallenges.length > 0 ? (
              <div className="space-y-3">
                {recentChallenges.slice(0, 5).map((challenge, index) => (
                  <div key={challenge.id} className="bg-gray-800/30 p-4 rounded hover:bg-gray-700/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="anime-text-pixel text-white text-sm font-bold mb-1">
                          {challenge.title}
                        </div>
                        <div className="flex flex-wrap items-center space-x-4 text-xs">
                          <span className="anime-text-pixel text-cyan-400">{challenge.anime}</span>
                          <span className="anime-text-pixel text-yellow-400">{challenge.difficulty.toUpperCase()}</span>
                          <span className="anime-text-pixel text-purple-400">{challenge.puzzles?.length || 0} puzzles</span>
                          <span className="anime-text-pixel text-gray-400">
                            {new Date(challenge.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className="anime-text-pixel text-green-400 text-xs">
                          {challenge.completions?.length || 0} completions
                        </span>
                        <button
                          onClick={() => {/* TODO: Share challenge */}}
                          className="pixel-button text-xs py-1 px-3"
                          style={{ 
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: '#000'
                          }}
                        >
                          SHARE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎯</div>
                <div className="anime-text-pixel text-gray-400 text-sm">
                  No challenges created yet. Start by creating your first challenge!
                </div>
                <button
                  onClick={onCreateChallenge}
                  className="pixel-button text-sm py-2 px-4 mt-4 animate-neon-glow"
                >
                  CREATE FIRST CHALLENGE
                </button>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="pixel-button text-lg py-4 px-8"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                color: '#fff'
              }}
            >
              ← BACK TO GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
