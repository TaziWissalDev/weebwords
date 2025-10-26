import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { PuzzleGame } from './components/PuzzleGame';
import { DifficultySelector } from './components/DifficultySelector';
import { AnimeSelector } from './components/AnimeSelector';
import { GameOver } from './components/GameOver';
import { BadgeSystem } from './components/BadgeSystem';
import { DailyPackGame } from './components/DailyPackGame';
import { GamePuzzle, GameStats } from '../shared/types/puzzle';
import { MockDataService } from './services/mockData';

type GameState = 'splash' | 'difficulty' | 'animeSelection' | 'playing' | 'gameOver' | 'badges' | 'dailyPack';

export const App = () => {
  const [gameState, setGameState] = useState<GameState>('splash');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [currentPuzzle, setCurrentPuzzle] = useState<GamePuzzle | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [selectedAnime, setSelectedAnime] = useState<string>('Mixed');
  const [gameStats, setGameStats] = useState<GameStats>(MockDataService.getInitialGameStats());

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      // For now, just use mock data since we're focusing on daily pack
      setUsername('Player');
      setGameStats(MockDataService.getInitialGameStats());
      console.log('Game initialized with mock data');
    } catch (error) {
      console.error('Failed to initialize game:', error);
      // Fallback initialization
      setUsername('Player');
      setGameStats(MockDataService.getInitialGameStats());
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameState('difficulty');
  };

  const handleDailyPack = () => {
    setGameState('dailyPack');
  };

  const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'mixed') => {
    setSelectedDifficulty(difficulty);
    setGameState('animeSelection');
  };

  const handleSelectAnime = (anime: string) => {
    setSelectedAnime(anime);
    const difficultyForPuzzle = selectedDifficulty === 'mixed' ? undefined : selectedDifficulty;
    const puzzle = MockDataService.getRandomPuzzle(difficultyForPuzzle, anime);
    setCurrentPuzzle(puzzle);
    setGameState('playing');
  };

  const handlePuzzleComplete = (score: number) => {
    setGameStats(prev => {
      let updatedStats = {
        ...prev,
        totalPuzzlesSolved: prev.totalPuzzlesSolved + 1,
        currentStreak: prev.currentStreak + 1,
        experience: prev.experience + score
      };
      
      // Update energy and check for resets
      updatedStats = MockDataService.updateEnergyIfNeeded(updatedStats);
      
      // Check and unlock badges
      updatedStats = MockDataService.checkAndUnlockBadges(updatedStats);
      
      return updatedStats;
    });
  };

  const handleWrongAnswer = () => {
    setGameStats(prev => {
      const newHearts = prev.hearts - 1;
      const newEnergy = Math.max(prev.energy - 1, 0);
      
      let newStats = {
        ...prev,
        hearts: newHearts,
        energy: newEnergy,
        currentStreak: 0 // Reset streak on wrong answer
      };
      
      // Update energy if needed
      newStats = MockDataService.updateEnergyIfNeeded(newStats);
      
      // Check if game over (no hearts OR no energy)
      if (newHearts <= 0 || newEnergy <= 0) {
        setGameState('gameOver');
      }
      
      return newStats;
    });
  };

  const handleRestartGame = () => {
    setGameStats(MockDataService.getInitialGameStats());
    setGameState('difficulty');
  };

  const handleBackToMenu = () => {
    setGameStats(MockDataService.getInitialGameStats());
    setGameState('splash');
  };

  const handleBackToDifficulty = () => {
    setGameState('difficulty');
  };

  const handleBackToAnimeSelection = () => {
    setGameState('animeSelection');
  };

  const handleShowBadges = () => {
    setGameState('badges');
  };

  const handleCloseBadges = () => {
    setGameState('playing');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Anime Quiz...</p>
        </div>
      </div>
    );
  }

  switch (gameState) {
    case 'splash':
      return <SplashScreen onPlay={handleStartGame} onDailyPack={handleDailyPack} username={username} />;
    
    case 'difficulty':
      return (
        <DifficultySelector 
          onSelectDifficulty={handleSelectDifficulty}
          onBack={handleBackToMenu}
        />
      );
    
    case 'animeSelection':
      return (
        <AnimeSelector 
          onSelectAnime={handleSelectAnime}
          onBack={handleBackToDifficulty}
        />
      );
    
    case 'playing':
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <PuzzleGame 
            initialPuzzle={currentPuzzle}
            username={username}
            gameStats={gameStats}
            selectedDifficulty={selectedDifficulty}
            selectedAnime={selectedAnime}
            onPuzzleComplete={handlePuzzleComplete}
            onWrongAnswer={handleWrongAnswer}
            onBackToDifficulty={handleBackToAnimeSelection}
            onShowBadges={handleShowBadges}
          />
        </div>
      );
    
    case 'gameOver':
      return (
        <GameOver 
          gameStats={gameStats}
          onRestart={handleRestartGame}
          onBackToMenu={handleBackToMenu}
        />
      );
    
    case 'badges':
      return (
        <BadgeSystem 
          gameStats={gameStats}
          onClose={handleCloseBadges}
        />
      );
    
    case 'dailyPack':
      return <DailyPackGame onBack={handleBackToMenu} />;
    
    default:
      return null;
  }
};
