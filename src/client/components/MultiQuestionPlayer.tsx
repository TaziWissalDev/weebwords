import React, { useState, useEffect } from 'react';
import { MultiQuestionPuzzle, CustomQuestion } from '../../shared/types/puzzle';
import { useSound } from '../hooks/useSound';

interface MultiQuestionPlayerProps {
  puzzle: MultiQuestionPuzzle;
  onComplete: (score: number, timeUsed: number) => void;
  onBack: () => void;
}

export const MultiQuestionPlayer: React.FC<MultiQuestionPlayerProps> = ({
  puzzle,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(puzzle.timeLimit);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionResults, setQuestionResults] = useState<boolean[]>([]);
  
  const { sounds } = useSound();
  const currentQuestion = puzzle.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === puzzle.questions.length - 1;

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleTimeUp();
          return 0;
        }
        
        // Warning sound at 5 seconds
        if (prev === 6) {
          sounds.hint();
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswered, sounds]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(puzzle.timeLimit);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResult(false);
  }, [currentQuestionIndex, puzzle.timeLimit]);

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setShowResult(true);
      setQuestionResults(prev => [...prev, false]);
      sounds.wrong();
      
      setTimeout(() => {
        if (isLastQuestion) {
          const totalTimeUsed = Math.floor((Date.now() - startTime) / 1000);
          onComplete(score, totalTimeUsed);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
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
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setQuestionResults(prev => [...prev, isCorrect]);
    
    if (isCorrect) {
      const timeBonus = Math.max(0, timeRemaining * 2); // 2 points per second remaining
      const questionScore = 100 + timeBonus;
      setScore(prev => prev + questionScore);
      sounds.success();
    } else {
      sounds.wrong();
    }

    setTimeout(() => {
      if (isLastQuestion) {
        const totalTimeUsed = Math.floor((Date.now() - startTime) / 1000);
        onComplete(score + (isCorrect ? 100 + Math.max(0, timeRemaining * 2) : 0), totalTimeUsed);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 2000);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / puzzle.questions.length) * 100;
  };

  const getTimePercentage = () => {
    return (timeRemaining / puzzle.timeLimit) * 100;
  };

  return (
    <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
      <div className="cyber-grid"></div>
      <div className="scan-lines"></div>
      
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="neon-card p-4 mb-6 relative overflow-hidden">
          <div className="cyber-grid"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className="pixel-button px-4 py-2 text-sm"
                style={{ background: 'linear-gradient(135deg, #666 0%, #999 100%)' }}
              >
                <span>←</span>
                <span className="hidden sm:inline ml-2">BACK</span>
              </button>
              
              <div className="text-center">
                <h1 className="anime-title text-xl sm:text-2xl mb-1">{puzzle.title}</h1>
                <p className="anime-text-pixel text-cyan-400 text-sm">
                  Question {currentQuestionIndex + 1} of {puzzle.questions.length}
                </p>
              </div>
              
              <div className="text-right">
                <div className="anime-text-pixel text-yellow-400 text-sm">SCORE</div>
                <div className="anime-text-neon text-lg font-bold">{score.toLocaleString()}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="anime-text-pixel text-xs text-gray-400">PROGRESS</span>
                <span className="anime-text-pixel text-xs text-cyan-400">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

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
                  style={{ width: `${getTimePercentage()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="neon-card p-6 mb-6 relative overflow-hidden">
          <div className="cyber-grid opacity-20"></div>
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">📺</span>
                <span className="anime-text-pixel text-yellow-400 text-sm">{currentQuestion.anime}</span>
                <span className="text-gray-400">•</span>
                <span className={`anime-text-pixel text-xs ${
                  currentQuestion.difficulty === 'easy' ? 'text-green-400' :
                  currentQuestion.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
              </div>
              
              <h2 className="anime-text-neon text-lg sm:text-xl mb-4 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isAnswered
                      ? option === currentQuestion.correctAnswer
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
                        ? option === currentQuestion.correctAnswer
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

            {/* Result Display */}
            {showResult && (
              <div className="mt-6 text-center">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border border-green-400'
                    : 'bg-red-500/20 border border-red-400'
                }`}>
                  <span className="text-2xl">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                  </span>
                  <span className={`anime-text-pixel font-bold ${
                    selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? 'CORRECT!' : 'WRONG!'}
                  </span>
                </div>
                
                {selectedAnswer !== currentQuestion.correctAnswer && (
                  <div className="mt-2">
                    <span className="anime-text-pixel text-sm text-gray-400">
                      Correct answer: <span className="text-green-400">{currentQuestion.correctAnswer}</span>
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
                  {isLastQuestion ? '🏁 FINISH PUZZLE' : '➡️ NEXT QUESTION'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Question Results Summary */}
        {questionResults.length > 0 && (
          <div className="neon-card p-4">
            <h3 className="anime-text-pixel text-cyan-400 text-sm mb-3">QUESTION RESULTS</h3>
            <div className="flex flex-wrap gap-2">
              {questionResults.map((isCorrect, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrect 
                      ? 'bg-green-500/20 border border-green-400 text-green-400'
                      : 'bg-red-500/20 border border-red-400 text-red-400'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
              {/* Remaining questions */}
              {Array.from({ length: puzzle.questions.length - questionResults.length }).map((_, index) => (
                <div
                  key={questionResults.length + index}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-700/50 border border-gray-600 text-gray-400"
                >
                  {questionResults.length + index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
