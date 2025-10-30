import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { PixelSplashScreen } from './components/PixelSplashScreen';
import { AnimePixelSplashScreen } from './components/AnimePixelSplashScreen';
import { HomePage } from './components/HomePage';
import { PuzzleGame } from './components/PuzzleGame';
import { DifficultySelector } from './components/DifficultySelector';
import { AnimeSelector } from './components/AnimeSelector';
import { GameOver } from './components/GameOver';
import { BadgeSystem } from './components/BadgeSystem';
import { DailyPackGame } from './components/DailyPackGame';
import { AnimeGuess } from './components/AnimeGuess';
import { GamePuzzle, GameStats } from '../shared/types/puzzle';
import { AnimeGuessQuiz } from '../shared/types/animeGuess';
import { MockDataService } from './services/mockData';
import { LeaderboardModal } from './components/LeaderboardModal';
import { useSound } from './hooks/useSound';

type GameState = 'splash' | 'home' | 'difficulty' | 'animeSelection' | 'playing' | 'gameOver' | 'badges' | 'dailyPack' | 'animeGuess';

export const App = () => {
  const [gameState, setGameState] = useState<GameState>('splash');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [currentPuzzle, setCurrentPuzzle] = useState<GamePuzzle | null>(null);
  const [currentAnimeGuessQuiz, setCurrentAnimeGuessQuiz] = useState<AnimeGuessQuiz | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [selectedAnime, setSelectedAnime] = useState<string>('Mixed');
  const [gameStats, setGameStats] = useState<GameStats>(MockDataService.getInitialGameStats());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const { sounds, resumeAudio } = useSound();

  useEffect(() => {
    initializeGame();
    resumeAudio();
  }, [resumeAudio]);

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

  const handleAnimeGuess = async () => {
    try {
      // Get a random anime guess quiz
      const response = await fetch('/api/anime-guess/quiz');
      const data = await response.json();
      
      if (data.status === 'success' && data.quiz) {
        setCurrentAnimeGuessQuiz(data.quiz);
        setGameState('animeGuess');
      } else {
        console.error('Failed to get anime guess quiz:', data.message);
      }
    } catch (error) {
      console.error('Error fetching anime guess quiz:', error);
    }
  };

  const handleGoToHome = () => {
    setGameState('home');
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

  const handlePuzzleComplete = async (score: number, hintsUsed: number = 0) => {
    // Submit score to server
    try {
      if (currentPuzzle) {
        const puzzleType = currentPuzzle.type === 'word-puzzle' ? 'word-puzzle' : 'character-guess';
        const puzzleData = currentPuzzle.type === 'word-puzzle' ? currentPuzzle.wordPuzzle : currentPuzzle.characterQuiz;
        
        if (puzzleData) {
          const response = await fetch('/api/puzzle/submit-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              puzzle_id: puzzleData.id,
              puzzle_type: puzzleType,
              anime: puzzleData.anime,
              character: puzzleData.character,
              difficulty: puzzleData.difficulty,
              score,
              hints_used: hintsUsed,
            }),
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Score submitted successfully:', result);
          }
        }
      }
    } catch (error) {
      console.error('Failed to submit score:', error);
    }

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

    // Generate next puzzle after a short delay
    setTimeout(() => {
      const difficultyForPuzzle = selectedDifficulty === 'mixed' ? undefined : selectedDifficulty;
      const nextPuzzle = MockDataService.getRandomPuzzle(difficultyForPuzzle, selectedAnime);
      setCurrentPuzzle(nextPuzzle);
      console.log('🎮 Generated next puzzle:', nextPuzzle);
    }, 2000); // 2 second delay to show completion feedback
  };

  const handleAnimeGuessComplete = (score: number, isCorrect: boolean) => {
    setGameStats(prev => {
      let updatedStats = {
        ...prev,
        totalPuzzlesSolved: prev.totalPuzzlesSolved + 1,
        experience: prev.experience + score
      };
      
      if (isCorrect) {
        updatedStats.currentStreak = prev.currentStreak + 1;
      } else {
        updatedStats.currentStreak = 0;
      }
      
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
    setGameState('home');
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

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
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
      return (
        <>
          <AnimePixelSplashScreen 
            onPlay={handleGoToHome} 
            onDailyPack={handleDailyPack} 
            onShowLeaderboard={handleShowLeaderboard}
            username={username} 
          />
          <LeaderboardModal 
            isOpen={showLeaderboard} 
            onClose={handleCloseLeaderboard} 
          />
        </>
      );
    
    case 'home':
      return <HomePage username={username} onStartGame={handleStartGame} onDailyChallenge={handleDailyPack} onAnimeGuess={handleAnimeGuess} />;
    
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
    
    case 'animeGuess':
      return currentAnimeGuessQuiz ? (
        <AnimeGuess
          initialQuiz={currentAnimeGuessQuiz}
          username={username}
          gameStats={gameStats}
          selectedDifficulty={selectedDifficulty}
          onQuizComplete={handleAnimeGuessComplete}
          onWrongAnswer={handleWrongAnswer}
          onBackToDifficulty={handleBackToMenu}
          onShowBadges={handleShowBadges}
        />
      ) : null;
    
    default:
      return null;
  }
};
