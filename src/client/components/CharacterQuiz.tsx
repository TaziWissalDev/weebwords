import React, { useState } from 'react';
import { CharacterQuiz as CharacterQuizType, GameStats } from '../../shared/types/puzzle';
import { MockDataService } from '../services/mockData';
import { HeartsDisplay } from './HeartsDisplay';
import { EnergyDisplay } from './EnergyDisplay';
import { Timer } from './Timer';

interface CharacterQuizProps {
  quiz: CharacterQuizType;
  gameStats: GameStats;
  selectedAnime: string;
  onSubmitGuess: (guess: string, hintsUsed: number) => void;
  onNewPuzzle: () => void;
  onBackToDifficulty: () => void;
  onShowBadges: () => void;
  onSpendHeart: () => void; // New prop for spending hearts on hints
  isSubmitting: boolean;
  feedback: string;
}

export const CharacterQuiz: React.FC<CharacterQuizProps> = ({
  quiz,
  gameStats,
  selectedAnime,
  onSubmitGuess,
  onNewPuzzle,
  onBackToDifficulty,
  onShowBadges,
  onSpendHeart,
  isSubmitting,
  feedback
}) => {
  const [guess, setGuess] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [characterResponse, setCharacterResponse] = useState('');
  const [showingHint, setShowingHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHintConfirmation, setShowHintConfirmation] = useState(false);
  const [timeLimit, setTimeLimit] = useState(15); // 15 seconds per puzzle
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handleTimeUp = () => {
    setIsTimerActive(false);
    onSpendHeart(); // Lose a heart for running out of time
    // Auto-submit empty answer or move to next puzzle
    setTimeout(() => {
      onNewPuzzle();
    }, 2000);
  };

  const handleTimeUpdate = (timeRemaining: number) => {
    // Optional: Add any time-based logic here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !isSubmitting) {
      setIsTimerActive(false); // Stop timer when submitting
      onSubmitGuess(guess.trim(), hintsUsed);
    }
  };

  // Update completion state when feedback changes
  React.useEffect(() => {
    if (feedback.includes('Correct')) {
      setIsCompleted(true);
    }
  }, [feedback]);

  // Reset state when quiz changes
  React.useEffect(() => {
    setGuess('');
    setHintsUsed(0);
    setCurrentHint('');
    setCharacterResponse('');
    setShowingHint(false);
    setIsCompleted(false);
    setIsTimerActive(true); // Start timer for new quiz
  }, [quiz.id]);

  const handleGetHint = () => {
    if (hintsUsed >= 3) return; // Max 3 hints for "Who Am I"
    if (gameStats.hearts <= 0) return; // No hearts left
    
    // Show confirmation dialog
    setShowHintConfirmation(true);
  };

  const confirmGetHint = () => {
    const hintData = MockDataService.getCharacterHint(quiz, hintsUsed + 1);
    setCurrentHint(hintData.hint);
    setCharacterResponse(hintData.characterResponse);
    setShowingHint(true);
    setHintsUsed(prev => prev + 1);
    setShowHintConfirmation(false);
    
    // Spend a heart
    onSpendHeart();
  };

  const cancelGetHint = () => {
    setShowHintConfirmation(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
      <div className="cyber-grid"></div>
      <div className="scan-lines"></div>
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

      <div className="relative z-10 max-w-4xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Header with Navigation and Stats */}
        <div className="neon-card p-4 mb-6 relative overflow-hidden">
          <div className="cyber-grid"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={onBackToDifficulty}
                  className="neon-button flex items-center space-x-2"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Back</span>
                </button>
                
                <button
                  onClick={onShowBadges}
                  className="pixel-button flex items-center space-x-2"
                >
                  <span>🏆</span>
                  <span className="hidden sm:inline">Badges</span>
                </button>
              </div>
              
              <div className="text-center flex-1 mx-2 sm:mx-4">
                <h1 className="anime-title text-lg sm:text-3xl mb-1 sm:mb-2">
                  {selectedAnime.toUpperCase()}
                </h1>
                <p className="anime-text-neon text-xs sm:text-base">CHARACTER QUIZ</p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <HeartsDisplay 
                  hearts={gameStats.hearts}
                  maxHearts={gameStats.maxHearts}
                />
                <EnergyDisplay 
                  energy={gameStats.energy}
                  maxEnergy={gameStats.maxEnergy}
                  lastReset={gameStats.lastEnergyReset}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <Timer
          timeLimit={timeLimit}
          onTimeUp={handleTimeUp}
          isActive={isTimerActive && !isCompleted}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Quiz Info */}
        <div className="neon-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="anime-text-pixel text-cyan-400 text-xs sm:text-sm">ANIME: {quiz.anime}</span>
              <span className="pixel-button text-xs py-1 px-2" style={{ 
                background: quiz.difficulty === 'easy' ? 'linear-gradient(135deg, #00ff41 0%, #00f5ff 100%)' :
                           quiz.difficulty === 'medium' ? 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)' :
                           'linear-gradient(135deg, #ff1493 0%, #dc2626 100%)',
                color: quiz.difficulty === 'easy' ? '#000' : '#fff'
              }}>
                {quiz.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="anime-text-pixel text-gray-400 text-xs sm:text-sm">
              HINTS: {hintsUsed}/3
            </div>
          </div>

          {/* Character Description */}
          <div className="neon-card p-4 sm:p-6 mb-4 sm:mb-6" style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            border: '2px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
          }}>
            <h3 className="anime-text-neon text-sm sm:text-lg mb-3">CHARACTER DESCRIPTION:</h3>
            <p className="anime-text-pixel text-white text-xs sm:text-base leading-relaxed italic mb-4">
              "{quiz.description}"
            </p>
            <div className="anime-text-pixel text-cyan-400 text-xs sm:text-sm">
              <span className="text-yellow-400">CHARACTER SAYS:</span> <em>"{quiz.characterVoice}"</em>
            </div>
          </div>

          {/* Hint Display */}
          {showingHint && currentHint && (
            <div className="neon-card p-4 mb-4 sm:mb-6" style={{ 
              background: 'rgba(255, 215, 0, 0.1)', 
              border: '2px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
            }}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">💡</span>
                </div>
                <div className="ml-3">
                  <h4 className="anime-text-pixel text-yellow-400 text-xs sm:text-sm mb-2">HINT #{hintsUsed}:</h4>
                  <p className="anime-text-pixel text-white text-xs sm:text-sm mb-2">{currentHint}</p>
                  {characterResponse && (
                    <div className="neon-card p-3" style={{ 
                      background: 'rgba(255, 215, 0, 0.2)',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      <p className="anime-text-pixel text-yellow-300 text-xs sm:text-sm italic">
                        <strong>CHARACTER RESPONDS:</strong> "{characterResponse}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Guess Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="guess" className="anime-text-pixel text-cyan-400 text-xs sm:text-sm mb-2 block">
                WHO IS THIS CHARACTER?
              </label>
              <input
                type="text"
                id="guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter character name..."
                disabled={isSubmitting || isCompleted}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border-2 border-cyan-400 rounded text-white anime-text-pixel text-xs sm:text-base focus:border-purple-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleGetHint}
                disabled={hintsUsed >= 3 || isCompleted || gameStats.hearts <= 0}
                className="pixel-button py-2 sm:py-3 px-3 sm:px-4 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                style={{ 
                  background: hintsUsed >= 3 || isCompleted || gameStats.hearts <= 0 ? '#666' : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000'
                }}
              >
                💡 HINT ({hintsUsed}/3) - COSTS 1❤️
              </button>
              
              <button
                type="submit"
                disabled={!guess.trim() || isSubmitting || isCompleted}
                className="pixel-button py-2 sm:py-3 px-4 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                style={{ 
                  background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                  color: '#fff'
                }}
              >
                {isSubmitting ? 'CHECKING...' : 'SUBMIT GUESS'}
              </button>
              
              <button
                type="button"
                onClick={onNewPuzzle}
                className="pixel-button py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm"
                style={{ 
                  background: 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)',
                  color: '#000'
                }}
              >
                🎲 NEW QUIZ
              </button>
            </div>
          </form>

          {/* Feedback */}
          {feedback && (
            <div className="mt-4 neon-card p-3 sm:p-4 text-center animate-bounce-in" style={{ 
              background: feedback.includes('Correct') ? 'rgba(0, 255, 65, 0.1)' :
                         feedback.includes('Not quite') ? 'rgba(255, 20, 147, 0.1)' :
                         'rgba(0, 245, 255, 0.1)',
              border: `2px solid ${
                feedback.includes('Correct') ? 'rgba(0, 255, 65, 0.5)' :
                feedback.includes('Not quite') ? 'rgba(255, 20, 147, 0.5)' :
                'rgba(0, 245, 255, 0.5)'
              }`,
              boxShadow: `0 0 15px ${
                feedback.includes('Correct') ? 'rgba(0, 255, 65, 0.3)' :
                feedback.includes('Not quite') ? 'rgba(255, 20, 147, 0.3)' :
                'rgba(0, 245, 255, 0.3)'
              }`
            }}>
              <p className={`anime-text-pixel text-xs sm:text-sm ${
                feedback.includes('Correct') ? 'text-green-400' :
                feedback.includes('Not quite') ? 'text-red-400' :
                'text-cyan-400'
              }`}>
                {feedback}
              </p>
            </div>
          )}

          {/* Hint Confirmation Dialog */}
          {showHintConfirmation && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="neon-card max-w-md w-full p-4 sm:p-6 animate-bounce-in" style={{ 
                background: 'rgba(26, 26, 46, 0.95)', 
                backdropFilter: 'blur(20px)'
              }}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl mb-4">💡</div>
                  <h3 className="anime-title text-lg sm:text-xl mb-4">
                    GET A HINT?
                  </h3>
                  <p className="anime-text-pixel text-white mb-6 text-xs sm:text-sm">
                    THIS WILL COST YOU <span className="text-red-400">1 HEART ❤️</span>
                    <br />
                    YOU HAVE <span className="text-yellow-400">{gameStats.hearts} HEARTS</span> REMAINING.
                    <br />
                    HINTS USED: {hintsUsed}/3
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={cancelGetHint}
                      className="neon-button px-3 sm:px-4 py-2 text-xs sm:text-sm"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={confirmGetHint}
                      className="pixel-button px-3 sm:px-4 py-2 text-xs sm:text-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #ff1493 0%, #dc2626 100%)',
                        color: '#fff'
                      }}
                    >
                      SPEND 1❤️ FOR HINT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
