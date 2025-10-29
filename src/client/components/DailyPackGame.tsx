import React, { useState, useEffect } from 'react';
import { DailyPack, Puzzle, ScoreSubmission } from '../../shared/types/daily-pack';
import { MockDailyPackService } from '../services/mockDailyPack';
import { MockDataService } from '../services/mockData';
import { Timer } from './Timer';
import { HeartsDisplay } from './HeartsDisplay';
import { EnergyDisplay } from './EnergyDisplay';

interface DailyPackGameProps {
  onBack?: () => void;
}

export const DailyPackGame: React.FC<DailyPackGameProps> = ({ onBack }) => {
  const [dailyPack, setDailyPack] = useState<DailyPack | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [showHintConfirmation, setShowHintConfirmation] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [energy, setEnergy] = useState(5);
  const [timeLimit, setTimeLimit] = useState(15); // 15 seconds per puzzle
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [puzzleStartTime, setPuzzleStartTime] = useState(Date.now());

  useEffect(() => {
    loadDailyPack();
  }, []);

  useEffect(() => {
    if (dailyPack && !isCompleted) {
      startNewPuzzle();
    }
  }, [currentPuzzleIndex, dailyPack]);

  const loadDailyPack = async () => {
    try {
      // Try to load AI-generated daily puzzles first
      const response = await fetch('/api/daily-puzzles');
      
      if (response.ok) {
        const aiPuzzles = await response.json();
        console.log('🤖 Loaded AI-generated daily puzzles:', aiPuzzles);
        
        // Convert AI puzzles to DailyPack format
        const pack = convertAIPuzzlesToDailyPack(aiPuzzles);
        setDailyPack(pack);
      } else {
        // Fallback to mock service
        console.log('📚 AI puzzles not available, using mock data');
        const pack = MockDailyPackService.generateMockDailyPack();
        setDailyPack(pack);
      }
    } catch (error) {
      console.error('Failed to load daily pack:', error);
      // Fallback to mock service
      const pack = MockDailyPackService.generateMockDailyPack();
      setDailyPack(pack);
      setFeedback('Using offline puzzles');
    } finally {
      setLoading(false);
    }
  };

  const convertAIPuzzlesToDailyPack = (aiPuzzles: any): DailyPack => {
    const puzzles: Puzzle[] = [];
    
    // Convert AI puzzle sets to our format
    aiPuzzles.puzzleSets?.forEach((set: any) => {
      // Add word puzzles
      set.wordPuzzles?.forEach((puzzle: any) => {
        puzzles.push({
          id: puzzle.id,
          type: 'quote_fill',
          anime: puzzle.anime,
          character: puzzle.character,
          difficulty: puzzle.difficulty,
          data: {
            quote: puzzle.quote_puzzle,
            options: puzzle.tiles,
            correct_answer: puzzle.blanks.join(' ')
          },
          feedback: {
            perfect: `${puzzle.character}: Perfect! You truly understand my words!`,
            good: `${puzzle.character}: Well done! You got it right!`,
            bad: `${puzzle.character}: Not quite right, but keep trying!`
          }
        });
      });

      // Add character quizzes
      set.characterQuizzes?.forEach((quiz: any) => {
        puzzles.push({
          id: quiz.id,
          type: 'who_am_i',
          anime: quiz.anime,
          character: quiz.character,
          difficulty: quiz.difficulty,
          data: {
            riddle: `I am a character from ${quiz.anime}. Can you guess who I am?`,
            hints: [
              quiz.hints.hint1,
              quiz.hints.hint2,
              quiz.hints.hint3,
              quiz.hints.finalHint
            ]
          },
          feedback: {
            perfect: `${quiz.character}: ${quiz.hintResponses.finalHintResponse}`,
            good: `${quiz.character}: Correct! You know me well!`,
            bad: `${quiz.character}: Try again! Use the hints to figure it out!`
          }
        });
      });
    });

    return {
      id: `daily-pack-${new Date().toISOString().split('T')[0]}`,
      date: new Date().toISOString().split('T')[0],
      puzzles: puzzles.slice(0, 10), // Limit to 10 puzzles for the daily pack
      meta: {
        title: 'AI-Generated Daily Challenge',
        description: 'Fresh puzzles generated daily by AI',
        difficulty: 'mixed',
        estimated_time: '15-20 minutes',
        total_puzzles: Math.min(puzzles.length, 10),
        date: new Date().toISOString().split('T')[0]
      }
    };
  };

  const handleGetHint = () => {
    if (hintsUsed >= 3 || hearts <= 0) return;
    setShowHintConfirmation(true);
  };

  const confirmGetHint = () => {
    if (!dailyPack) return;
    
    const puzzle = dailyPack.puzzles[currentPuzzleIndex];
    if (puzzle.type === 'who_am_i') {
      const hintData = MockDataService.getCharacterHint(puzzle as any, hintsUsed + 1);
      setCurrentHint(hintData.hint);
      setHintsUsed(prev => prev + 1);
      setHearts(prev => prev - 1);
    }
    setShowHintConfirmation(false);
  };

  const cancelGetHint = () => {
    setShowHintConfirmation(false);
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setFeedback('⏰ Time\'s up! Moving to next puzzle...');
    setHearts(prev => Math.max(prev - 1, 0));
    
    setTimeout(() => {
      moveToNextPuzzle();
    }, 2000);
  };

  const handleTimeUpdate = (timeRemaining: number) => {
    // Optional: Add any time-based logic here
  };

  const startNewPuzzle = () => {
    setPuzzleStartTime(Date.now());
    setIsTimerActive(true);
    setUserAnswer('');
    setFeedback('');
    setHintsUsed(0);
    setCurrentHint('');
  };

  const moveToNextPuzzle = () => {
    if (!dailyPack) return;
    
    if (currentPuzzleIndex < dailyPack.puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
      startNewPuzzle();
    } else {
      // Daily pack completed
      completeDailyChallenge();
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!dailyPack) return;
    
    setIsTimerActive(false); // Stop timer when answer is submitted
    const puzzle = dailyPack.puzzles[currentPuzzleIndex];
    const timeMs = Date.now() - puzzleStartTime;
    
    // Use mock validation for immediate feedback
    const validation = MockDailyPackService.validateAnswer(puzzle, answer);
    const calculatedScore = MockDailyPackService.calculateScore(validation.accuracy, timeMs, hintsUsed, puzzle.type);
    
    // Update local score
    setScore(prev => prev + calculatedScore);
    
    // Show feedback
    if (validation.correct) {
      setFeedback(validation.accuracy > 0.8 ? puzzle.feedback.perfect : puzzle.feedback.good);
      
      // Submit score to server for correct answers
      try {
        await fetch('/api/daily-challenge/puzzle-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            puzzle_id: puzzle.id,
            puzzle_type: puzzle.type,
            anime: puzzle.anime,
            character: puzzle.character,
            difficulty: puzzle.difficulty,
            score: calculatedScore,
            hints_used: hintsUsed,
            completion_time: timeMs,
            is_correct: true
          }),
        });
        console.log(`✅ Submitted daily challenge puzzle score: ${calculatedScore}`);
      } catch (error) {
        console.error('Failed to submit daily challenge puzzle score:', error);
      }
    } else {
      setFeedback(puzzle.feedback.bad);
      setHearts(prev => Math.max(prev - 1, 0));
    }
    
    // Move to next puzzle
    setTimeout(() => {
      moveToNextPuzzle();
    }, 2000);
  };

  const completeDailyChallenge = async () => {
    try {
      const completionTime = Date.now() - (Date.now() - 900000); // Simulate 15 minutes
      const puzzlesCompleted = currentPuzzleIndex + 1;
      
      await fetch('/api/daily-challenge/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          completion_time: completionTime,
          puzzles_completed: puzzlesCompleted,
          hints_used: hintsUsed
        }),
      });
      
      console.log(`🎉 Daily challenge completed! Final score: ${score}`);
      setFeedback('🎉 Daily pack completed! Score submitted to leaderboard!');
    } catch (error) {
      console.error('Failed to submit daily challenge final score:', error);
      setFeedback('🎉 Daily pack completed! Great job!');
    }
  };

  if (loading) {
    return (
      <div className="cyberpunk-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        <div className="text-center relative z-10">
          <div className="anime-loading mx-auto mb-6" style={{ width: '64px', height: '64px' }}></div>
          <p className="anime-text-neon text-2xl">LOADING DAILY CHALLENGE...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dailyPack) {
    return (
      <div className="cyberpunk-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="cyber-grid"></div>
        <div className="scan-lines"></div>
        <div className="text-center relative z-10">
          <p className="anime-text-neon text-2xl mb-6">FAILED TO LOAD DAILY PACK</p>
          <button 
            onClick={loadDailyPack}
            className="pixel-button py-3 px-6"
            style={{ 
              background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
              color: '#fff'
            }}
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const currentPuzzle = dailyPack.puzzles[currentPuzzleIndex];
  const isCompleted = currentPuzzleIndex >= dailyPack.puzzles.length;

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
      
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="neon-card p-4 mb-6 relative overflow-hidden">
          <div className="cyber-grid"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="neon-button flex items-center space-x-2"
                  >
                    <span>←</span>
                    <span className="hidden sm:inline">BACK</span>
                  </button>
                )}
              </div>

              <div className="text-center flex-1">
                <h1 className="anime-title text-2xl sm:text-4xl mb-2">
                  DAILY CHALLENGE
                </h1>
                <p className="anime-text-neon text-xs sm:text-base">
                  Puzzle {currentPuzzleIndex + 1}/{dailyPack.puzzles.length}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <HeartsDisplay hearts={hearts} maxHearts={3} />
                <EnergyDisplay 
                  energy={energy} 
                  maxEnergy={5} 
                  lastReset={Date.now()} 
                />
              </div>
            </div>

            <div className="text-center">
              <div className="anime-text-pixel text-yellow-400 text-lg sm:text-xl mb-4">
                SCORE: {score.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        {!isCompleted && (
          <div className="mb-4">
            <Timer
              timeLimit={timeLimit}
              onTimeUp={handleTimeUp}
              isActive={isTimerActive}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
        )}

        {!isCompleted ? (
          <div className="neon-card p-6 animate-slide-in">
            {/* Puzzle Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="pixel-button text-xs sm:text-sm py-2 px-4" style={{ 
                  background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%)',
                  color: '#fff'
                }}>
                  {currentPuzzle.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="anime-text-pixel text-cyan-400 text-xs sm:text-sm">
                  {currentPuzzle.anime} • {currentPuzzle.character}
                </span>
              </div>
            </div>

            {/* Puzzle Content */}
            <div className="mb-6">
              {currentPuzzle.type === 'quote_fill' && (
                <div>
                  <p className="anime-text-neon text-lg sm:text-xl mb-6 text-center">"{currentPuzzle.data.quote}"</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentPuzzle.data.options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="game-tile p-4 text-center hover:scale-105 transition-all duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'who_said_it' && (
                <div>
                  <p className="anime-text-neon text-lg sm:text-xl mb-4 text-center">"{currentPuzzle.data.quote}"</p>
                  <p className="anime-text-pixel text-cyan-400 mb-6 text-center">WHO SAID THIS?</p>
                  <div className="space-y-3">
                    {currentPuzzle.data.options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="w-full game-tile p-4 text-left hover:scale-105 transition-all duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'emoji_sensei' && (
                <div>
                  <p className="anime-text-neon text-lg sm:text-xl mb-4 text-center">{currentPuzzle.data.text}</p>
                  <p className="anime-text-pixel text-cyan-400 mb-6 text-center">CHOOSE THE RIGHT EMOJIS:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {currentPuzzle.data.emoji_options.map((emoji: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(emoji)}
                        className="game-tile p-4 text-3xl hover:scale-110 transition-all duration-200"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'mood_match' && (
                <div>
                  <p className="anime-text-neon text-lg sm:text-xl mb-4 text-center">"{currentPuzzle.data.quote}"</p>
                  <p className="anime-text-pixel text-white mb-4 text-center">{currentPuzzle.data.context}</p>
                  <p className="anime-text-pixel text-cyan-400 mb-6 text-center">WHAT MOOD DOES THIS EXPRESS?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {currentPuzzle.data.mood_options.map((mood: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(mood)}
                        className="game-tile p-4 text-2xl sm:text-3xl hover:scale-110 transition-all duration-200"
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'who_am_i' && (
                <div>
                  <p className="anime-text-neon text-lg sm:text-xl mb-4 text-center italic">"{currentPuzzle.data.riddle}"</p>
                  <p className="anime-text-pixel text-cyan-400 mb-6 text-center">WHO AM I?</p>
                  
                  {/* Hint Display */}
                  {currentHint && (
                    <div className="neon-card p-4 mb-6" style={{ 
                      background: 'rgba(255, 215, 0, 0.1)', 
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                    }}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="anime-text-pixel text-yellow-400 text-sm mb-2">HINT #{hintsUsed}:</h4>
                          <p className="anime-text-pixel text-white text-sm">{currentHint}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter character name..."
                    className="w-full p-4 mb-6 bg-gray-800/50 border-2 border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 anime-text-pixel"
                    style={{ 
                      background: 'rgba(26, 26, 46, 0.8)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <button
                      onClick={handleGetHint}
                      disabled={hintsUsed >= 3 || hearts <= 0}
                      className="pixel-button py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: hintsUsed >= 3 || hearts <= 0 ? '#666' : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000'
                      }}
                    >
                      💡 GET HINT ({hintsUsed}/3) - COSTS 1❤️
                    </button>
                    
                    <button
                      onClick={() => handleAnswer(userAnswer)}
                      className="flex-1 pixel-button py-3 px-4"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
                        color: '#fff'
                      }}
                    >
                      SUBMIT ANSWER
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <div className="anime-text-pixel text-red-400 text-sm">
                      HEARTS: {hearts}/3
                    </div>
                    <div className="anime-text-pixel text-gray-400 text-xs mt-1">
                      HINTS REDUCE YOUR FINAL SCORE
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="mt-6 neon-card p-4 animate-bounce-in" style={{ 
                background: 'rgba(0, 255, 65, 0.1)', 
                border: '2px solid rgba(0, 255, 65, 0.5)',
                boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)'
              }}>
                <p className="anime-text-pixel text-green-400 text-center">{feedback}</p>
              </div>
            )}

            {/* Hint Confirmation Dialog */}
            {showHintConfirmation && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="neon-card max-w-md w-full p-6 animate-bounce-in" style={{ 
                  background: 'rgba(26, 26, 46, 0.95)', 
                  backdropFilter: 'blur(20px)'
                }}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="anime-title text-xl mb-4">
                      GET A HINT?
                    </h3>
                    <p className="anime-text-pixel text-white mb-6 text-sm">
                      THIS WILL COST YOU <span className="text-red-400">1 HEART ❤️</span>
                      <br />
                      YOU HAVE <span className="text-yellow-400">{hearts} HEARTS</span> REMAINING.
                      <br />
                      HINTS USED: {hintsUsed}/3
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={cancelGetHint}
                        className="neon-button px-4 py-2"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={confirmGetHint}
                        className="pixel-button px-4 py-2"
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
        ) : (
          <div className="neon-card p-8 text-center animate-bounce-in">
            <h2 className="anime-title text-3xl sm:text-4xl mb-6">
              🎉 DAILY PACK COMPLETED! 🎉
            </h2>
            <p className="anime-text-pixel text-yellow-400 text-xl mb-6">
              FINAL SCORE: {score.toLocaleString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="pixel-button text-xl py-4 px-8"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)',
                color: '#000'
              }}
            >
              PLAY AGAIN TOMORROW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
