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
      <div className="cyberpunk-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        <div className="text-center relative z-10">
          <div className="anime-loading mx-auto mb-6" style={{ width: '64px', height: '64px' }}></div>
          <p className="anime-text-neon text-2xl">LOADING ANIME QUEST...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
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
        <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
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
