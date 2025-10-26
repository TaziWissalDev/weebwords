import React, { useState, useEffect } from 'react';
import { DailyPack, Puzzle, ScoreSubmission } from '../../shared/types/daily-pack';
import { MockDailyPackService } from '../services/mockDailyPack';

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

  useEffect(() => {
    loadDailyPack();
  }, []);

  const loadDailyPack = async () => {
    try {
      // Use mock service for now
      const pack = MockDailyPackService.generateMockDailyPack();
      setDailyPack(pack);
      console.log('Daily pack loaded:', pack);
    } catch (error) {
      console.error('Failed to load daily pack:', error);
      setFeedback('Failed to load daily pack');
    } finally {
      setLoading(false);
    }
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

  const handleAnswer = (answer: string) => {
    if (!dailyPack) return;
    
    const puzzle = dailyPack.puzzles[currentPuzzleIndex];
    const startTime = Date.now() - 15000; // Simulate 15 seconds
    const timeMs = Date.now() - startTime;
    
    // Use mock validation
    const validation = MockDailyPackService.validateAnswer(puzzle, answer);
    const calculatedScore = MockDailyPackService.calculateScore(validation.accuracy, timeMs, 0, puzzle.type);
    
    // Update local score
    setScore(prev => prev + calculatedScore);
    
    // Show feedback
    if (validation.correct) {
      setFeedback(validation.accuracy > 0.8 ? puzzle.feedback.perfect : puzzle.feedback.good);
    } else {
      setFeedback(puzzle.feedback.bad);
    }
    
    // Move to next puzzle
    setTimeout(() => {
      if (currentPuzzleIndex < dailyPack.puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
        setUserAnswer('');
        setFeedback('');
        setHintsUsed(0);
        setCurrentHint('');
      } else {
        setFeedback('🎉 Daily pack completed! Great job!');
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading Daily Pack...</p>
        </div>
      </div>
    );
  }

  if (!dailyPack) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl">Failed to load daily pack</p>
          <button 
            onClick={loadDailyPack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentPuzzle = dailyPack.puzzles[currentPuzzleIndex];
  const isCompleted = currentPuzzleIndex >= dailyPack.puzzles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {onBack && (
            <div className="flex justify-start mb-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>Back to Menu</span>
              </button>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily Anime Puzzle Pack
          </h1>
          <p className="text-gray-600">
            {dailyPack.meta.date} • Puzzle {currentPuzzleIndex + 1}/{dailyPack.puzzles.length}
          </p>
          <div className="text-lg font-semibold text-purple-600">
            Score: {score}
          </div>
        </div>

        {!isCompleted ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Puzzle Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentPuzzle.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-gray-600">
                  {currentPuzzle.anime} • {currentPuzzle.character}
                </span>
              </div>
            </div>

            {/* Puzzle Content */}
            <div className="mb-6">
              {currentPuzzle.type === 'quote_fill' && (
                <div>
                  <p className="text-lg mb-4">"{currentPuzzle.data.quote}"</p>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPuzzle.data.options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="p-3 border border-gray-300 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'who_said_it' && (
                <div>
                  <p className="text-lg mb-4">"{currentPuzzle.data.quote}"</p>
                  <p className="text-gray-600 mb-4">Who said this?</p>
                  <div className="space-y-2">
                    {currentPuzzle.data.options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="w-full p-3 border border-gray-300 rounded-lg hover:bg-purple-50 transition-colors text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'emoji_sensei' && (
                <div>
                  <p className="text-lg mb-4">{currentPuzzle.data.text}</p>
                  <p className="text-gray-600 mb-4">Choose the right emojis:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {currentPuzzle.data.emoji_options.map((emoji: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(emoji)}
                        className="p-3 text-2xl border border-gray-300 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'mood_match' && (
                <div>
                  <p className="text-lg mb-4">"{currentPuzzle.data.quote}"</p>
                  <p className="text-gray-600 mb-4">{currentPuzzle.data.context}</p>
                  <p className="text-gray-600 mb-4">What mood does this express?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {currentPuzzle.data.mood_options.map((mood: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(mood)}
                        className="p-3 text-3xl border border-gray-300 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'who_am_i' && (
                <div>
                  <p className="text-lg mb-4 italic">"{currentPuzzle.data.riddle}"</p>
                  <p className="text-gray-600 mb-4">Who am I?</p>
                  
                  {/* Hint Display */}
                  {currentHint && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-lg font-medium text-yellow-800">Hint #{hintsUsed}:</h4>
                          <p className="text-yellow-700 mt-1">{currentHint}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter character name..."
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />
                  
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={handleGetHint}
                      disabled={hintsUsed >= 3 || hearts <= 0}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      💡 Get Hint ({hintsUsed}/3) - Costs 1❤️
                    </button>
                    
                    <button
                      onClick={() => handleAnswer(userAnswer)}
                      className="flex-1 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Submit Answer
                    </button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    Hearts: {hearts}/3 • Hints reduce your final score
                  </div>
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{feedback}</p>
              </div>
            )}

            {/* Hint Confirmation Dialog */}
            {showHintConfirmation && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                  <div className="text-center">
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Get a Hint?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This will cost you <span className="font-bold text-red-500">1 heart ❤️</span>
                      <br />
                      You have <span className="font-bold">{hearts} hearts</span> remaining.
                      <br />
                      Hints used: {hintsUsed}/3
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={cancelGetHint}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmGetHint}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Spend 1❤️ for Hint
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Daily Pack Completed!
            </h2>
            <p className="text-lg mb-4">Final Score: {score}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Play Again Tomorrow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
