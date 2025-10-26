import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { PuzzleGame } from './components/PuzzleGame';
import { AnimePuzzle, GameStats } from '../shared/types/puzzle';

export const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [currentPuzzle, setCurrentPuzzle] = useState<AnimePuzzle | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPuzzlesSolved: 0,
    averageHintsUsed: 0,
    favoriteAnime: '',
    currentStreak: 0
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      const response = await fetch('/api/init');
      const data = await response.json();
      
      if (data.type === 'init') {
        setUsername(data.username);
        setCurrentPuzzle(data.currentPuzzle);
        setGameStats(data.gameStats);
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handlePuzzleComplete = (score: number) => {
    // Update local stats
    setGameStats(prev => ({
      ...prev,
      totalPuzzlesSolved: prev.totalPuzzlesSolved + 1,
      currentStreak: prev.currentStreak + 1
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Anime Line...</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return <SplashScreen onPlay={handleStartGame} username={username} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PuzzleGame 
        initialPuzzle={currentPuzzle}
        username={username}
        onPuzzleComplete={handlePuzzleComplete}
      />
    </div>
  );
};
