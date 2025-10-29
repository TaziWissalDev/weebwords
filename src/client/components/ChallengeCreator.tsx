import React, { useState } from 'react';
import { GamePuzzle, PuzzleChallenge } from '../../shared/types/puzzle';
import { MockDataService } from '../services/mockData';

interface ChallengeCreatorProps {
  onChallengeCreated: (challenge: PuzzleChallenge) => void;
  onClose: () => void;
}

export const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({
  onChallengeCreated,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAnime, setSelectedAnime] = useState('Mixed');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [timeLimit, setTimeLimit] = useState(300); // 5 minutes default
  const [puzzleCount, setPuzzleCount] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const animeOptions = [
    'Mixed', 'Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer', 
    'Jujutsu Kaisen', 'My Hero Academia', 'Death Note', 'Dragon Ball'
  ];

  const handleCreateChallenge = async () => {
    if (!title.trim()) {
      alert('Please enter a challenge title!');
      return;
    }

    setIsCreating(true);

    try {
      // Generate puzzles for the challenge
      const puzzles: GamePuzzle[] = [];
      for (let i = 0; i < puzzleCount; i++) {
        const difficultyForPuzzle = difficulty === 'mixed' ? undefined : difficulty;
        const puzzle = MockDataService.getRandomPuzzle(difficultyForPuzzle, selectedAnime);
        puzzles.push(puzzle);
      }

      // Create challenge object
      const challenge: PuzzleChallenge = {
        id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdBy: 'current_user', // This would come from context
        createdAt: new Date().toISOString(),
        title: title.trim(),
        description: description.trim() || `A ${difficulty} challenge featuring ${selectedAnime} puzzles!`,
        puzzles,
        timeLimit,
        difficulty,
        anime: selectedAnime,
        isPublic,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
        completions: [],
        maxAttempts: 3
      };

      // Submit to server
      const response = await fetch('/api/challenges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challenge),
      });

      if (response.ok) {
        const result = await response.json();
        onChallengeCreated(result.challenge);
      } else {
        throw new Error('Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge. Please try again!');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="cyberpunk-bg w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg relative">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-red-600/80 hover:bg-red-500 rounded-full transition-all duration-200"
        >
          <span className="text-white text-xl font-bold">×</span>
        </button>

        <div className="relative z-10 p-6">
          <div className="text-center mb-6">
            <h1 className="anime-title text-3xl mb-2">CREATE CHALLENGE</h1>
            <p className="anime-text-neon text-sm">Design your own puzzle challenge to share with friends!</p>
          </div>

          <div className="space-y-6">
            {/* Challenge Title */}
            <div className="neon-card p-4">
              <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                CHALLENGE TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an epic challenge name..."
                className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div className="neon-card p-4">
              <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your challenge..."
                className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Anime Selection */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  ANIME SERIES
                </label>
                <select
                  value={selectedAnime}
                  onChange={(e) => setSelectedAnime(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                >
                  {animeOptions.map(anime => (
                    <option key={anime} value={anime}>{anime}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  DIFFICULTY
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* Time Limit */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  TIME LIMIT (MINUTES)
                </label>
                <input
                  type="number"
                  value={Math.floor(timeLimit / 60)}
                  onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1) * 60)}
                  min="1"
                  max="30"
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                />
              </div>

              {/* Puzzle Count */}
              <div className="neon-card p-4">
                <label className="anime-text-pixel text-cyan-400 text-sm mb-2 block">
                  NUMBER OF PUZZLES
                </label>
                <input
                  type="number"
                  value={puzzleCount}
                  onChange={(e) => setPuzzleCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="10"
                  className="w-full p-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-sm focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Public/Private Toggle */}
            <div className="neon-card p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 text-cyan-400 bg-gray-800 border-2 border-cyan-400 rounded focus:ring-cyan-400"
                />
                <span className="anime-text-pixel text-white text-sm">
                  Make this challenge public (others can find and play it)
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleCreateChallenge}
                disabled={isCreating || !title.trim()}
                className="flex-1 pixel-button text-lg py-4 animate-neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                  color: '#fff'
                }}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="anime-loading"></div>
                    <span>CREATING...</span>
                  </span>
                ) : (
                  '🚀 CREATE CHALLENGE'
                )}
              </button>
              
              <button
                onClick={onClose}
                className="pixel-button text-lg py-4 px-8"
                style={{ 
                  background: 'linear-gradient(135deg, #666 0%, #999 100%)',
                  color: '#fff'
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
