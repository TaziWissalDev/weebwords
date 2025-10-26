import React, { useState, useEffect } from 'react';
import { AnimePuzzle, PuzzleState } from '../../shared/types/puzzle';
import { TileBoard } from './TileBoard';
import { QuoteDisplay } from './QuoteDisplay';
import { HintPanel } from './HintPanel';
import { ScoreDisplay } from './ScoreDisplay';

interface PuzzleGameProps {
  initialPuzzle: AnimePuzzle | null;
  username: string;
  onPuzzleComplete: (score: number) => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ 
  initialPuzzle, 
  username, 
  onPuzzleComplete 
}) => {
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    currentPuzzle: initialPuzzle,
    placedTiles: {},
    availableTiles: initialPuzzle?.tiles || [],
    isCompleted: false,
    score: 0,
    hintsUsed: 0
  });

  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPuzzle) {
      setPuzzleState({
        currentPuzzle: initialPuzzle,
        placedTiles: {},
        availableTiles: initialPuzzle.tiles,
        isCompleted: false,
        score: 0,
        hintsUsed: 0
      });
    }
  }, [initialPuzzle]);

  const handleTileDrop = (tileText: string, blankIndex: number) => {
    if (puzzleState.isCompleted) return;

    setPuzzleState(prev => {
      const newPlacedTiles = { ...prev.placedTiles };
      const newAvailableTiles = [...prev.availableTiles];

      // Remove tile from available tiles
      const tileIndex = newAvailableTiles.indexOf(tileText);
      if (tileIndex > -1) {
        newAvailableTiles.splice(tileIndex, 1);
      }

      // If there was already a tile in this blank, return it to available tiles
      if (newPlacedTiles[blankIndex]) {
        newAvailableTiles.push(newPlacedTiles[blankIndex]);
      }

      // Place the new tile
      newPlacedTiles[blankIndex] = tileText;

      return {
        ...prev,
        placedTiles: newPlacedTiles,
        availableTiles: newAvailableTiles
      };
    });
  };

  const handleTileReturn = (blankIndex: number) => {
    if (puzzleState.isCompleted) return;

    setPuzzleState(prev => {
      const newPlacedTiles = { ...prev.placedTiles };
      const newAvailableTiles = [...prev.availableTiles];

      if (newPlacedTiles[blankIndex]) {
        newAvailableTiles.push(newPlacedTiles[blankIndex]);
        delete newPlacedTiles[blankIndex];
      }

      return {
        ...prev,
        placedTiles: newPlacedTiles,
        availableTiles: newAvailableTiles
      };
    });
  };

  const handleSubmitSolution = async () => {
    if (!puzzleState.currentPuzzle || isSubmitting) return;

    const solution = puzzleState.currentPuzzle.blanks.map((_, index) => 
      puzzleState.placedTiles[index] || ''
    );

    // Check if all blanks are filled
    if (solution.some(word => !word)) {
      setFeedback('Please fill in all blanks before submitting!');
      setTimeout(() => setFeedback(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const response = await fetch('/api/puzzle/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzleId: puzzleState.currentPuzzle.id,
          solution,
          hintsUsed: puzzleState.hintsUsed
        }),
      });

      const result = await response.json();

      if (result.isCorrect) {
        setFeedback('🎉 Correct! Well done!');
        setPuzzleState(prev => ({ ...prev, isCompleted: true, score: result.score }));
        onPuzzleComplete(result.score);
        
        // Load next puzzle after a delay
        setTimeout(() => {
          if (result.nextPuzzle) {
            setPuzzleState({
              currentPuzzle: result.nextPuzzle,
              placedTiles: {},
              availableTiles: result.nextPuzzle.tiles,
              isCompleted: false,
              score: 0,
              hintsUsed: 0
            });
            setFeedback('');
            setShowHints(false);
          }
        }, 2000);
      } else {
        setFeedback('❌ Not quite right. Try again!');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setFeedback('Error submitting solution. Please try again.');
      setTimeout(() => setFeedback(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseHint = () => {
    setShowHints(true);
    setPuzzleState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const handleNewPuzzle = async () => {
    try {
      const response = await fetch('/api/puzzle/new');
      const result = await response.json();
      
      if (result.puzzle) {
        setPuzzleState({
          currentPuzzle: result.puzzle,
          placedTiles: {},
          availableTiles: result.puzzle.tiles,
          isCompleted: false,
          score: 0,
          hintsUsed: 0
        });
        setFeedback('');
        setShowHints(false);
      }
    } catch (error) {
      console.error('Error getting new puzzle:', error);
      setFeedback('Error loading new puzzle. Please try again.');
    }
  };

  if (!puzzleState.currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Anime Line</h1>
        <p className="text-gray-600">Complete the anime quote by dragging tiles to the blanks!</p>
      </div>

      {/* Score and Info */}
      <ScoreDisplay 
        score={puzzleState.score}
        hintsUsed={puzzleState.hintsUsed}
        difficulty={puzzleState.currentPuzzle.difficulty}
        anime={puzzleState.currentPuzzle.anime}
        character={puzzleState.currentPuzzle.character}
      />

      {/* Quote Display */}
      <QuoteDisplay 
        puzzle={puzzleState.currentPuzzle}
        placedTiles={puzzleState.placedTiles}
        onTileReturn={handleTileReturn}
        onTileDrop={handleTileDrop}
      />

      {/* Tile Board */}
      <TileBoard 
        availableTiles={puzzleState.availableTiles}
        onTileDrag={(tile) => tile}
      />

      {/* Hint Panel */}
      {showHints && (
        <HintPanel hints={puzzleState.currentPuzzle.hints} />
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleUseHint}
          disabled={showHints || puzzleState.isCompleted}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          💡 Use Hint ({puzzleState.hintsUsed})
        </button>
        
        <button
          onClick={handleSubmitSolution}
          disabled={isSubmitting || puzzleState.isCompleted}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
        
        <button
          onClick={handleNewPuzzle}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          🎲 New Puzzle
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center p-3 rounded-lg ${
          feedback.includes('Correct') ? 'bg-green-100 text-green-800' :
          feedback.includes('Not quite') ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {feedback}
        </div>
      )}
    </div>
  );
};
