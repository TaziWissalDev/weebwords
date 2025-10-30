import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

interface Challenge {
  id: string;
  title: string;
  description: string;
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  puzzles: any[];
  multiQuestionPuzzles?: any[];
  createdBy: string;
  createdAt: string;
  shareCode: string;
  isPublic: boolean;
  completions?: any[];
  tags?: string[];
}

interface ChallengeBrowserProps {
  onClose: () => void;
  onPlayChallenge: (challenge: Challenge) => void;
}

export const ChallengeBrowser: React.FC<ChallengeBrowserProps> = ({
  onClose,
  onPlayChallenge
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterAnime, setFilterAnime] = useState<string>('all');
  const [shareCode, setShareCode] = useState('');
  const [showShareInput, setShowShareInput] = useState(false);
  
  const { sounds } = useSound();

  useEffect(() => {
    fetchPublicChallenges();
  }, []);

  const fetchPublicChallenges = async () => {
    setLoading(true);
    try {
      // Fetch public challenges from the server
      const response = await fetch('/api/challenges/public');
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Received challenges data:', data);
        if (data.status === 'success') {
          console.log(`✅ Setting ${data.challenges?.length || 0} challenges`);
          setChallenges(data.challenges || []);
        } else {
          console.error('Failed to fetch challenges:', data.message);
          setChallenges([]);
        }
      } else {
        console.error('Failed to fetch challenges:', response.status);
        setChallenges([]);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShareCodeSubmit = async () => {
    if (!shareCode.trim()) return;
    
    try {
      sounds.enter();
      
      // First check if challenge is already in our list
      const foundChallenge = challenges.find(c => c.shareCode.toLowerCase() === shareCode.toLowerCase());
      
      if (foundChallenge) {
        onPlayChallenge(foundChallenge);
        return;
      }
      
      // If not found locally, fetch from server
      const response = await fetch(`/api/challenges/${shareCode.toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.challenge) {
          onPlayChallenge(data.challenge);
        } else {
          alert(`Challenge with code "${shareCode}" not found!`);
        }
      } else {
        alert(`Challenge with code "${shareCode}" not found!`);
      }
    } catch (error) {
      console.error('Error finding challenge:', error);
      alert('Error finding challenge. Please try again.');
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.anime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
    const matchesAnime = filterAnime === 'all' || challenge.anime === filterAnime;
    
    return matchesSearch && matchesDifficulty && matchesAnime;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 border-green-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-400';
      case 'hard': return 'bg-red-500/20 border-red-400';
      default: return 'bg-gray-500/20 border-gray-400';
    }
  };

  const uniqueAnimes = [...new Set(challenges.map(c => c.anime))];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="neon-card max-w-6xl w-full max-h-[90vh] overflow-hidden animate-bounce-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-400/30">
          <div>
            <h2 className="anime-title text-2xl mb-2">🔍 BROWSE CHALLENGES</h2>
            <p className="text-gray-400 text-sm">Discover and play community-created challenges</p>
          </div>
          <button
            onClick={() => {
              sounds.button();
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Share Code Input */}
        <div className="p-6 border-b border-cyan-400/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="anime-text-pixel text-cyan-400">🔗 JOIN BY SHARE CODE</h3>
            <button
              onClick={() => setShowShareInput(!showShareInput)}
              className="pixel-button text-sm px-3 py-1"
            >
              {showShareInput ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showShareInput && (
            <div className="flex gap-3">
              <input
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                placeholder="Enter share code (e.g., NARUTO123)"
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                maxLength={20}
              />
              <button
                onClick={handleShareCodeSubmit}
                disabled={!shareCode.trim()}
                className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 JOIN
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-cyan-400/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div>
              <label className="anime-text-pixel text-white text-sm mb-2 block">🔍 Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search challenges..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="anime-text-pixel text-white text-sm mb-2 block">⚡ Difficulty</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Anime Filter */}
            <div>
              <label className="anime-text-pixel text-white text-sm mb-2 block">🎭 Anime</label>
              <select
                value={filterAnime}
                onChange={(e) => setFilterAnime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Anime</option>
                {uniqueAnimes.map(anime => (
                  <option key={anime} value={anime}>{anime}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Challenge List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="anime-loading mx-auto mb-4" style={{ width: '48px', height: '48px' }}></div>
              <p className="anime-text-pixel text-cyan-400">Loading challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="anime-text-pixel text-gray-400">No challenges found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="neon-card p-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => {
                    sounds.click();
                    onPlayChallenge(challenge);
                  }}
                >
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="anime-text-pixel text-white font-bold mb-1">{challenge.title}</h4>
                      <p className="text-gray-300 text-sm mb-2">{challenge.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs border ${getDifficultyBg(challenge.difficulty)}`}>
                      <span className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Challenge Info */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="anime-text-pixel text-cyan-400 text-xs mb-1">ANIME</div>
                      <div className="text-white text-sm">{challenge.anime}</div>
                    </div>
                    <div>
                      <div className="anime-text-pixel text-purple-400 text-xs mb-1">CREATOR</div>
                      <div className="text-white text-sm">{challenge.createdBy}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {challenge.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">
                        👥 {challenge.completions?.length || 0} completions
                      </span>
                      <span className="text-gray-400">
                        🔗 {challenge.shareCode}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(challenge.shareCode);
                        sounds.click();
                        alert(`Share code ${challenge.shareCode} copied to clipboard!`);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      title="Copy share code"
                    >
                      📋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cyan-400/30 text-center">
          <p className="anime-text-pixel text-gray-400 text-xs">
            💡 Click on any challenge to play it, or use the share code to invite friends!
          </p>
        </div>
      </div>
    </div>
  );
};
