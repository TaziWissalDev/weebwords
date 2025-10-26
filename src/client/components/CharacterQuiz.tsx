import React, { useState } from 'react';
import { CharacterQuiz as CharacterQuizType, GameStats } from '../../shared/types/puzzle';
import { MockDataService } from '../services/mockData';
import { HeartsDisplay } from './HeartsDisplay';
import { EnergyDisplay } from './EnergyDisplay';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !isSubmitting) {
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with Navigation and Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDifficulty}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          
          <button
            onClick={onShowBadges}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <span>🏆</span>
            <span>Badges</span>
          </button>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedAnime} Character Quiz
          </h1>
          <p className="text-gray-600">Guess the anime character based on their description!</p>
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

      {/* Quiz Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-700">Anime: {quiz.anime}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Hints used: {hintsUsed}/4
          </div>
        </div>

        {/* Character Description */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Character Description:</h3>
          <p className="text-gray-700 text-lg leading-relaxed italic">
            "{quiz.description}"
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Character says:</span> <em>"{quiz.characterVoice}"</em>
          </div>
        </div>

        {/* Hint Display */}
        {showingHint && currentHint && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-medium text-yellow-800">Hint #{hintsUsed}:</h4>
                <p className="text-yellow-700 mt-1">{currentHint}</p>
                {characterResponse && (
                  <div className="mt-3 p-3 bg-yellow-100 rounded-md">
                    <p className="text-yellow-800 italic">
                      <strong>Character responds:</strong> "{characterResponse}"
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
            <label htmlFor="guess" className="block text-sm font-medium text-gray-700 mb-2">
              Who is this character?
            </label>
            <input
              type="text"
              id="guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter character name..."
              disabled={isSubmitting || isCompleted}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={handleGetHint}
              disabled={hintsUsed >= 3 || isCompleted || gameStats.hearts <= 0}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              💡 Get Hint ({hintsUsed}/3) - Costs 1❤️
            </button>
            
            <button
              type="submit"
              disabled={!guess.trim() || isSubmitting || isCompleted}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Checking...' : 'Submit Guess'}
            </button>
            
            <button
              type="button"
              onClick={onNewPuzzle}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🎲 New Quiz
            </button>
          </div>
        </form>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-4 text-center p-3 rounded-lg ${
            feedback.includes('Correct') ? 'bg-green-100 text-green-800' :
            feedback.includes('Not quite') ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {feedback}
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
                  You have <span className="font-bold">{gameStats.hearts} hearts</span> remaining.
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
    </div>
  );
};
