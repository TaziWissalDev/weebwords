import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { GamePuzzle } from '../../shared/types/puzzle';

interface Challenge {
  id: string;
  title: string;
  description: string;
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  puzzles: GamePuzzle[];
  multiQuestionPuzzles?: Array<{
    id: string;
    title: string;
    questions: Array<{
      id: string;
      question: string;
      correctAnswer: string;
      options: string[];
      anime: string;
      difficulty: 'easy' | 'medium' | 'hard';
      hints: {
        hint1: string;
        hint2: string;
        hint3: string;
      };
    }>;
    timeLimit: number;
    anime: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    totalScore: number;
  }>;
  createdBy: string;
  shareCode: string;
}

interface ChallengePlayerProps {
  challenge: Challenge;
  onComplete: (score: number, results: any[], timeUsed?: number) => void;
  onExit: () => void;
}

export const ChallengePlayer: React.FC<ChallengePlayerProps> = ({
  challenge,
  onComplete,
  onExit
}) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [puzzleResults, setPuzzleResults] = useState<any[]>([]);
  const [timeStarted, setTimeStarted] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { sounds } = useSound();

  // Get all puzzles (regular + multi-question) - moved to top
  const allPuzzles = [
    ...(challenge.puzzles || []),
    ...(challenge.multiQuestionPuzzles?.flatMap(mp => 
      mp.questions.map(q => ({
        type: 'custom-question' as const,
        customQuestion: q
      }))
    ) || [])
  ];

  // Debug logging
  useEffect(() => {
    console.log('🎮 ChallengePlayer received challenge:', challenge);
    console.log('🧩 Challenge puzzles:', challenge?.puzzles);
    console.log('🎯 Multi-question puzzles:', challenge?.multiQuestionPuzzles);
    console.log('📊 Puzzle count:', challenge?.puzzles?.length || 0);
    console.log('📊 Multi-question count:', challenge?.multiQuestionPuzzles?.length || 0);
    console.log('🔢 Total allPuzzles length:', allPuzzles.length);
    console.log('📋 All puzzles structure:', allPuzzles);
  }, [challenge, allPuzzles]);

  useEffect(() => {
    setTimeStarted(Date.now());
  }, []);

  const handlePuzzleComplete = (score: number, isCorrect: boolean) => {
    console.log('🎯 Puzzle completed:', {
      currentIndex: currentPuzzleIndex,
      totalPuzzles: allPuzzles.length,
      score,
      isCorrect
    });

    const result = {
      puzzleIndex: currentPuzzleIndex,
      score,
      isCorrect,
      timestamp: Date.now()
    };

    const newResults = [...puzzleResults, result];
    const newTotalScore = totalScore + score;
    
    setPuzzleResults(newResults);
    setTotalScore(newTotalScore);

    // Check if there are more puzzles
    const nextIndex = currentPuzzleIndex + 1;
    console.log('🔄 Next puzzle check:', {
      nextIndex,
      totalPuzzles: allPuzzles.length,
      hasMore: nextIndex < allPuzzles.length
    });

    if (nextIndex < allPuzzles.length) {
      // Move to next puzzle
      console.log('➡️ Moving to next puzzle:', nextIndex);
      setTimeout(() => {
        setCurrentPuzzleIndex(nextIndex);
      }, 1500); // Small delay to show result
    } else {
      // Challenge completed
      console.log('🏆 Challenge completed!');
      setIsCompleted(true);
      
      setTimeout(() => {
        const timeUsed = Date.now() - timeStarted;
        onComplete(newTotalScore, newResults, timeUsed);
      }, 2000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const progress = ((currentPuzzleIndex + 1) / Math.max(allPuzzles.length, 1)) * 100;

  // If no puzzles, show error
  if (allPuzzles.length === 0) {
    return (
      <div className="min-h-screen cyberpunk-bg relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto p-4 flex items-center justify-center min-h-screen">
          <div className="neon-card p-8 text-center animate-bounce-in">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="anime-title text-2xl mb-4">No Puzzles Found</h2>
            <p className="text-gray-300 mb-6">
              This challenge doesn't contain any puzzles. It might be corrupted or incomplete.
            </p>
            <div className="text-sm text-gray-400 mb-6">
              <p>Challenge ID: {challenge.id}</p>
              <p>Title: {challenge.title}</p>
              <p>Regular Puzzles: {challenge.puzzles?.length || 0}</p>
              <p>Multi-Question Puzzles: {challenge.multiQuestionPuzzles?.length || 0}</p>
              <p>Total Questions: {allPuzzles.length}</p>
            </div>
            <button
              onClick={() => {
                sounds.button();
                onExit();
              }}
              className="pixel-button px-6 py-3"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyberpunk-bg relative overflow-hidden">
      <div className="anime-particles">
        {Array.from({ length: 15 }).map((_, i) => (
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
        
        {/* Challenge Header */}
        <div className="neon-card p-6 mb-6 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="anime-title text-2xl mb-2">{challenge.title}</h1>
              <p className="text-gray-300 text-sm mb-2">{challenge.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="anime-text-pixel text-cyan-400">
                  📺 {challenge.anime}
                </span>
                <span className={`anime-text-pixel ${getDifficultyColor(challenge.difficulty)}`}>
                  ⚡ {challenge.difficulty.toUpperCase()}
                </span>
                <span className="anime-text-pixel text-purple-400">
                  👤 {challenge.createdBy}
                </span>
                <span className="anime-text-pixel text-yellow-400">
                  🔗 {challenge.shareCode}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                sounds.button();
                onExit();
              }}
              className="pixel-button text-sm px-3 py-2"
            >
              ← Exit Challenge
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="anime-text-pixel text-white">
                Progress: {currentPuzzleIndex + 1} / {allPuzzles.length}
              </span>
              <span className="anime-text-pixel text-cyan-400">
                Score: {totalScore}
              </span>
            </div>
            <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        {isCompleted ? (
          <div className="neon-card p-8 text-center animate-bounce-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="anime-title text-3xl mb-4">CHALLENGE COMPLETED!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{totalScore}</div>
                <div className="anime-text-pixel text-gray-400">TOTAL SCORE</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {puzzleResults.filter(r => r.isCorrect).length}
                </div>
                <div className="anime-text-pixel text-gray-400">CORRECT</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {Math.round(((Date.now() - timeStarted) / 1000))}s
                </div>
                <div className="anime-text-pixel text-gray-400">TIME</div>
              </div>
            </div>
            
            <div className="text-gray-300 mb-6">
              <p>🎉 Congratulations on completing <strong>{challenge.title}</strong>!</p>
              <p>Challenge created by <strong>{challenge.createdBy}</strong></p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  sounds.button();
                  onExit();
                }}
                className="pixel-button px-6 py-3"
              >
                🏠 Back to Home
              </button>
              
              <button
                onClick={() => {
                  sounds.button();
                  navigator.clipboard.writeText(challenge.shareCode);
                  alert(`Share code ${challenge.shareCode} copied! Share it with friends!`);
                }}
                className="pixel-button px-6 py-3"
                style={{ 
                  background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%)'
                }}
              >
                📋 Share Challenge
              </button>
            </div>
          </div>
        ) : (
          <ChallengePlayerPuzzle
            puzzle={allPuzzles[currentPuzzleIndex]}
            puzzleIndex={currentPuzzleIndex}
            totalPuzzles={allPuzzles.length}
            onComplete={handlePuzzleComplete}
            challengeAnime={challenge.anime}
            challengeDifficulty={challenge.difficulty}
          />
        )}
      </div>
    </div>
  );
};

// Component to render individual puzzles within a challenge
interface ChallengePlayerPuzzleProps {
  puzzle: GamePuzzle;
  puzzleIndex: number;
  totalPuzzles: number;
  onComplete: (score: number, isCorrect: boolean) => void;
  challengeAnime: string;
  challengeDifficulty: string;
}

const ChallengePlayerPuzzle: React.FC<ChallengePlayerPuzzleProps> = ({
  puzzle,
  puzzleIndex,
  totalPuzzles,
  onComplete,
  challengeAnime,
  challengeDifficulty
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per puzzle
  const { sounds } = useSound();

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up
          handleTimeUp();
          return 0;
        }
        
        if (prev === 6) {
          sounds.hint(); // Warning sound
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswered, sounds]);

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setShowResult(true);
      sounds.wrong();
      
      setTimeout(() => {
        onComplete(0, false);
      }, 2000);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    sounds.click();
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswered) return;

    setIsAnswered(true);
    setShowResult(true);
    
    let isCorrect = false;
    let correctAnswer = '';

    // Check answer based on puzzle type
    if (puzzle.type === 'custom-question') {
      correctAnswer = puzzle.customQuestion.correctAnswer;
      isCorrect = selectedAnswer === correctAnswer;
    } else if (puzzle.type === 'character-guess') {
      correctAnswer = puzzle.characterQuiz.correctAnswer;
      isCorrect = selectedAnswer === correctAnswer || 
                  puzzle.characterQuiz.alternativeAnswers.includes(selectedAnswer);
    } else if (puzzle.type === 'word-puzzle') {
      // For word puzzles, we'd need different logic, but for now treat as custom question
      correctAnswer = 'Word Puzzle';
      isCorrect = true; // Simplified for now
    }

    if (isCorrect) {
      const timeBonus = Math.max(0, timeRemaining * 2);
      const score = 100 + timeBonus;
      sounds.success();
      
      setTimeout(() => {
        onComplete(score, true);
      }, 1500);
    } else {
      sounds.wrong();
      
      setTimeout(() => {
        onComplete(0, false);
      }, 1500);
    }
  };

  const renderPuzzleContent = () => {
    if (puzzle.type === 'custom-question') {
      const question = puzzle.customQuestion;
      return (
        <div>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">📺</span>
              <span className="anime-text-pixel text-yellow-400 text-sm">{question.anime}</span>
              <span className="text-gray-400">•</span>
              <span className={`anime-text-pixel text-xs ${
                question.difficulty === 'easy' ? 'text-green-400' :
                question.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {question.difficulty.toUpperCase()}
              </span>
            </div>
            
            <h2 className="anime-text-neon text-lg sm:text-xl mb-6 leading-relaxed">
              {question.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isAnswered
                    ? option === question.correctAnswer
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : option === selectedAnswer
                        ? 'bg-red-500/20 border-red-400 text-red-300'
                        : 'bg-gray-700/50 border-gray-600 text-gray-400'
                    : selectedAnswer === option
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 transform scale-105'
                      : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isAnswered
                      ? option === question.correctAnswer
                        ? 'border-green-400 bg-green-400 text-black'
                        : option === selectedAnswer
                          ? 'border-red-400 bg-red-400 text-white'
                          : 'border-gray-600'
                      : selectedAnswer === option
                        ? 'border-cyan-400 bg-cyan-400 text-black'
                        : 'border-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="anime-text-pixel text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Fallback for other puzzle types
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">🎮</div>
        <p className="text-gray-300 mb-4">
          Puzzle type "{puzzle.type}" is not yet implemented in challenge mode.
        </p>
        <button
          onClick={() => onComplete(50, true)}
          className="pixel-button px-6 py-3"
        >
          Continue (Skip)
        </button>
      </div>
    );
  };

  return (
    <div className="neon-card p-6 animate-slide-in">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎮</div>
        <h3 className="anime-title text-xl mb-4">
          Puzzle {puzzleIndex + 1} of {totalPuzzles}
        </h3>
        
        {/* Timer */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="anime-text-pixel text-xs text-gray-400">TIME REMAINING</span>
            <span className={`anime-text-pixel text-xs font-bold ${
              timeRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-green-400'
            }`}>
              {timeRemaining}s
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                timeRemaining <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-yellow-400'
              }`}
              style={{ width: `${(timeRemaining / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Puzzle Content */}
      <div className="mb-6">
        {renderPuzzleContent()}
      </div>

      {/* Result Display */}
      {showResult && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
            selectedAnswer === (puzzle.type === 'custom-question' ? puzzle.customQuestion.correctAnswer : 'correct')
              ? 'bg-green-500/20 border border-green-400'
              : 'bg-red-500/20 border border-red-400'
          }`}>
            <span className="text-2xl">
              {selectedAnswer === (puzzle.type === 'custom-question' ? puzzle.customQuestion.correctAnswer : 'correct') ? '✅' : '❌'}
            </span>
            <span className={`anime-text-pixel font-bold ${
              selectedAnswer === (puzzle.type === 'custom-question' ? puzzle.customQuestion.correctAnswer : 'correct') ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === (puzzle.type === 'custom-question' ? puzzle.customQuestion.correctAnswer : 'correct') ? 'CORRECT!' : 'WRONG!'}
            </span>
          </div>
          
          {puzzle.type === 'custom-question' && selectedAnswer !== puzzle.customQuestion.correctAnswer && (
            <div className="mt-2">
              <span className="anime-text-pixel text-sm text-gray-400">
                Correct answer: <span className="text-green-400">{puzzle.customQuestion.correctAnswer}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {!isAnswered && (
        <div className="text-center mt-6">
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="pixel-button px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: selectedAnswer 
                ? 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)'
                : 'linear-gradient(135deg, #666 0%, #999 100%)'
            }}
          >
            ➡️ SUBMIT ANSWER
          </button>
        </div>
      )}
    </div>
  );
};
