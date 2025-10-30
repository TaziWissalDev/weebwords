import React, { useState, useEffect } from 'react';
import { AnimeGuessQuiz, AnimeGuessState } from '../../shared/types/animeGuess.js';
import { GameStats } from '../../shared/types/puzzle';
import { useSound } from '../hooks/useSound';

interface AnimeGuessProps {
  initialQuiz: AnimeGuessQuiz;
  username?: string;
  gameStats: GameStats;
  selectedDifficulty?: string;
  onQuizComplete: (score: number, isCorrect: boolean) => void;
  onWrongAnswer: () => void;
  onBackToDifficulty: () => void;
  onShowBadges: () => void;
}

export const AnimeGuess: React.FC<AnimeGuessProps> = ({
  initialQuiz,
  gameStats,
  onQuizComplete,
  onWrongAnswer,
  onBackToDifficulty,
  onShowBadges,
}) => {
  const [quizState, setQuizState] = useState<AnimeGuessState>({
    currentQuiz: initialQuiz,
    selectedAnswer: null,
    isCompleted: false,
    isCorrect: false,
    score: 0,
    hintsUsed: 0,
    timeStarted: Date.now(),
  });

  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20); // 20 seconds per question
  const [isTimerActive, setIsTimerActive] = useState(true);

  const { sounds, resumeAudio } = useSound();

  // Resume audio context on component mount
  useEffect(() => {
    resumeAudio();
  }, [resumeAudio]);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerActive || quizState.isCompleted || timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 1) {
          // Time's up - auto submit or mark as wrong
          setIsTimerActive(false);
          if (!quizState.isCompleted) {
            handleTimeUp();
          }
          return 0;
        }

        // Play warning sound when time is running low
        if (prev === 6) {
          sounds.hint(); // Warning sound at 5 seconds left
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, quizState.isCompleted, timeRemaining, sounds]);

  // Reset timer when quiz changes
  useEffect(() => {
    setTimeRemaining(20);
    setIsTimerActive(true);
    setQuizState((prev: AnimeGuessState) => ({
      ...prev,
      currentQuiz: initialQuiz,
      selectedAnswer: null,
      isCompleted: false,
      isCorrect: false,
      score: 0,
      hintsUsed: 0,
      timeStarted: Date.now(),
    }));
  }, [initialQuiz]);

  // Add keyboard support for Enter key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        quizState.selectedAnswer &&
        !quizState.isCompleted &&
        isTimerActive
      ) {
        sounds.enter();
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quizState.selectedAnswer, quizState.isCompleted, isTimerActive, sounds]);

  const handleTimeUp = () => {
    // Time's up - treat as wrong answer
    setIsTimerActive(false);
    setFeedback(`⏰ Time's up! The correct answer was ${quizState.currentQuiz.correctAnime}`);

    setQuizState((prev: AnimeGuessState) => ({
      ...prev,
      isCompleted: true,
      isCorrect: false,
      score: 0,
      timeCompleted: Date.now(),
    }));

    sounds.wrong();
    setTimeout(() => {
      sounds.failure();
    }, 400);

    onWrongAnswer();
    onQuizComplete(0, false);

    // Auto-load next quiz after time up
    setTimeout(() => {
      loadNewQuiz();
    }, 3000);
  };

  const handleAnswerSelect = (answer: string) => {
    if (quizState.isCompleted || !isTimerActive) return;

    sounds.click();
    setQuizState((prev: AnimeGuessState) => ({
      ...prev,
      selectedAnswer: answer,
    }));
  };

  const handleUseHint = () => {
    if (gameStats.hearts <= 0 || showHints || !isTimerActive) return;

    sounds.hint();
    setShowHints(true);
    setQuizState((prev: AnimeGuessState) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));
  };

  const handleSubmitAnswer = async () => {
    if (!quizState.selectedAnswer || isSubmitting || !isTimerActive) return;

    setIsSubmitting(true);
    setIsTimerActive(false); // Stop the timer when submitting

    try {
      const response = await fetch('/api/anime-guess/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quizState.currentQuiz.id,
          selectedAnswer: quizState.selectedAnswer,
          hintsUsed: quizState.hintsUsed,
          timeSpent: Date.now() - quizState.timeStarted,
        }),
      });

      const result = await response.json();

      if (result.type === 'anime-guess-result') {
        const isCorrect = result.isCorrect;
        const score = result.score;

        setQuizState((prev: AnimeGuessState) => ({
          ...prev,
          isCompleted: true,
          isCorrect,
          score,
          timeCompleted: Date.now(),
        }));

        setFeedback(result.feedback);

        if (isCorrect) {
          sounds.correct();
          setTimeout(() => {
            sounds.celebration();
          }, 200);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);

          // Auto-load next quiz after celebration
          setTimeout(() => {
            loadNewQuiz();
          }, 4000);
        } else {
          sounds.wrong();
          setTimeout(() => {
            sounds.failure();
          }, 300);
          onWrongAnswer();

          // Auto-load next quiz after wrong answer feedback
          setTimeout(() => {
            loadNewQuiz();
          }, 3000);
        }

        onQuizComplete(score, isCorrect);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setFeedback('Error submitting answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadNewQuiz = async () => {
    try {
      // Get a new random anime guess quiz
      const response = await fetch('/api/anime-guess/quiz');
      const data = await response.json();

      if (data.status === 'success' && data.quiz) {
        // Reset all state for new quiz
        setQuizState({
          currentQuiz: data.quiz,
          selectedAnswer: null,
          isCompleted: false,
          isCorrect: false,
          score: 0,
          hintsUsed: 0,
          timeStarted: Date.now(),
        });

        // Reset UI state
        setShowHints(false);
        setFeedback('');
        setIsSubmitting(false);
        setShowCelebration(false);
        setTimeRemaining(20);
        setIsTimerActive(true);

        sounds.newQuiz();
      } else {
        console.error('Failed to get new anime guess quiz:', data.message);
        // Fallback to reload if API fails
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching new anime guess quiz:', error);
      // Fallback to reload if fetch fails
      window.location.reload();
    }
  };

  const handleNewQuiz = () => {
    sounds.newQuiz();
    loadNewQuiz();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 150) return 'text-green-400';
    if (score >= 100) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
      <div className="anime-particles">
        {Array.from({ length: 15 }).map((_, i: number) => (
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

      <div className="relative z-10 max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                sounds.button();
                onBackToDifficulty();
              }}
              className="pixel-button text-sm px-3 py-2"
            >
              ← Back
            </button>

            <button
              onClick={() => {
                sounds.button();
                onShowBadges();
              }}
              className="pixel-button text-sm px-3 py-2"
            >
              🏆 Badges
            </button>
          </div>

          <div className="text-center">
            <h1 className="anime-title text-2xl sm:text-4xl">GUESS THE ANIME!</h1>
          </div>

          <div className="text-right">
            <div className="text-sm text-white">Lives:</div>
            <div className="flex space-x-1">
              {Array.from({ length: gameStats.maxHearts }).map((_, i: number) => (
                <span key={i} className={i < gameStats.hearts ? 'text-red-500' : 'text-gray-400'}>
                  ❤️
                </span>
              ))}
            </div>
            <div className="text-sm text-white mt-2">
              Energy: {gameStats.energy}/{gameStats.maxEnergy}
            </div>
            <div className="bg-gray-700 rounded-full h-2 w-20 mt-1">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(gameStats.energy / gameStats.maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="neon-card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{quizState.score}</div>
                <div className="anime-text-pixel text-xs text-gray-400">SCORE</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-lg font-bold ${getDifficultyColor(quizState.currentQuiz.difficulty)}`}
                >
                  {quizState.currentQuiz.difficulty.toUpperCase()}
                </div>
                <div className="anime-text-pixel text-xs text-gray-400">DIFFICULTY</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{quizState.hintsUsed}</div>
                <div className="anime-text-pixel text-xs text-gray-400">HINTS</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-lg font-bold ${
                    timeRemaining <= 5
                      ? 'text-red-400 animate-pulse'
                      : timeRemaining <= 10
                        ? 'text-yellow-400'
                        : 'text-green-400'
                  }`}
                >
                  {timeRemaining}s
                </div>
                <div className="anime-text-pixel text-xs text-gray-400">TIME</div>
              </div>
            </div>

            <div className="anime-text-pixel text-cyan-400 text-sm">
              Which anime is this character from?
            </div>
          </div>

          {/* Timer Bar */}
          <div className="mt-4">
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeRemaining <= 5
                    ? 'bg-red-500'
                    : timeRemaining <= 10
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
                style={{ width: `${(timeRemaining / 20) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0s</span>
              <span className="anime-text-pixel">TIME REMAINING</span>
              <span>20s</span>
            </div>
          </div>
        </div>

        {/* Character Image and Description */}
        <div className="neon-card p-6 mb-6">
          <div className="text-center">
            {/* Character Image */}
            <div className="mb-6">
              <div className="w-64 h-64 mx-auto bg-gray-800 rounded-lg border-2 border-cyan-400 flex items-center justify-center relative overflow-hidden">
                <img
                  src="anonym-character.png"
                  // src={quizState.currentQuiz.characterImage}
                  alt="Character to guess"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/256x256/1a1a2e/16213e?text=Character';
                  }}
                />
                {!quizState.isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                )}
              </div>
            </div>

            {/* Character Description */}
            <div className="mb-4">
              <p className="anime-text-pixel text-white text-sm mb-2">CHARACTER DESCRIPTION:</p>
              <p className="text-gray-300 text-base">
                {quizState.currentQuiz.characterDescription}
              </p>
            </div>

            {/* Hints */}
            {showHints && (
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 mb-4 animate-slide-in">
                <div className="anime-text-pixel text-yellow-400 text-sm mb-2">
                  💡 HINT REVEALED:
                </div>
                <p className="text-white text-sm mb-1">
                  <strong>Character:</strong> {quizState.currentQuiz.hints.character}
                </p>
                <p className="text-white text-sm">
                  <strong>Context:</strong> {quizState.currentQuiz.hints.context}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Multiple Choice Options */}
        <div className="neon-card p-6 mb-6">
          <h3 className="anime-text-pixel text-cyan-400 text-center mb-4">
            SELECT THE CORRECT ANIME:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizState.currentQuiz.options.map((option: string, index: number) => {
              const isSelected = quizState.selectedAnswer === option;
              const isCorrect =
                quizState.isCompleted && option === quizState.currentQuiz.correctAnime;
              const isWrong = quizState.isCompleted && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={quizState.isCompleted || !isTimerActive}
                  className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                    isCorrect
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : isWrong
                        ? 'bg-red-500/20 border-red-400 text-red-300'
                        : isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500'
                  } ${
                    quizState.isCompleted || !isTimerActive
                      ? 'cursor-not-allowed opacity-75'
                      : 'cursor-pointer'
                  }`}
                >
                  {option}
                  {isCorrect && <span className="ml-2">✅</span>}
                  {isWrong && <span className="ml-2">❌</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleUseHint}
            disabled={showHints || quizState.isCompleted || gameStats.hearts <= 0 || !isTimerActive}
            className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💡 USE HINT ({quizState.hintsUsed})
          </button>

          <button
            onClick={() => {
              sounds.enter();
              handleSubmitAnswer();
            }}
            disabled={
              !quizState.selectedAnswer || isSubmitting || quizState.isCompleted || !isTimerActive
            }
            className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <div className="anime-loading w-4 h-4"></div>
                <span>CHECKING...</span>
              </span>
            ) : (
              'SUBMIT ANSWER'
            )}
          </button>

          <button onClick={handleNewQuiz} className="pixel-button">
            🎲 NEW QUIZ
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="neon-card p-4 text-center mb-6 animate-bounce-in">
            <div className={`font-bold text-lg ${getScoreColor(quizState.score)}`}>{feedback}</div>
            {quizState.isCompleted && (
              <div className="mt-4">
                <div className="text-gray-300 mb-4">
                  <p>
                    <strong>Character:</strong> {quizState.currentQuiz.character}
                  </p>
                  <p>
                    <strong>Anime:</strong> {quizState.currentQuiz.correctAnime}
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={loadNewQuiz}
                  className="pixel-button px-6 py-2 animate-pulse"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                >
                  ➤ CONTINUE TO NEXT QUIZ
                </button>

                <div className="text-xs text-gray-400 mt-2">
                  Auto-continuing in a few seconds...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion Celebration */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="neon-card p-8 text-center animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <div className="anime-title text-2xl mb-2">CORRECT!</div>
              <div className="text-cyan-400 text-lg mb-2">{quizState.currentQuiz.character}</div>
              <div className="text-yellow-400 text-xl font-bold">+{quizState.score} points!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
