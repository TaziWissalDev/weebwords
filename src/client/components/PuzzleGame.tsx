import React, { useState, useEffect } from 'react';
import { GamePuzzle, PuzzleState, GameStats } from '../../shared/types/puzzle';
import { TileBoard } from './TileBoard';
import { QuoteDisplay } from './QuoteDisplay';
import { HintPanel } from './HintPanel';
import { ScoreDisplay } from './ScoreDisplay';
import { CharacterQuiz } from './CharacterQuiz';
import { HeartsDisplay } from './HeartsDisplay';
import { EnergyDisplay } from './EnergyDisplay';
import { LeaderboardModal } from './LeaderboardModal';
import { BadgeDisplay } from './BadgeDisplay';
import { MobileTileInterface } from './MobileTileInterface';
import { MockDataService } from '../services/mockData';
import { getThemeForAnime, getThemeClasses } from '../services/themeService';
import { BadgeLevel } from '../../shared/types/leaderboard';
import { useIsMobile } from '../hooks/useIsMobile';
import { AnimeBackground } from './AnimeBackground';
import { FeedbackService } from '../services/feedbackService';
import { CompletionCelebration } from './CompletionCelebration';

interface PuzzleGameProps {
  initialPuzzle: GamePuzzle | null;
  username: string;
  gameStats: GameStats;
  selectedDifficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  selectedAnime: string;
  onPuzzleComplete: (score: number) => void;
  onWrongAnswer: () => void;
  onBackToDifficulty: () => void;
  onShowBadges: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  initialPuzzle,
  username,
  gameStats,
  selectedDifficulty,
  selectedAnime,
  onPuzzleComplete,
  onWrongAnswer,
  onBackToDifficulty,
  onShowBadges,
}) => {
  const [currentGamePuzzle, setCurrentGamePuzzle] = useState<GamePuzzle | null>(initialPuzzle);
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    currentPuzzle: initialPuzzle?.type === 'word-puzzle' ? initialPuzzle.wordPuzzle : null,
    placedTiles: {},
    availableTiles:
      initialPuzzle?.type === 'word-puzzle' ? initialPuzzle.wordPuzzle?.tiles || [] : [],
    isCompleted: false,
    score: 0,
    hintsUsed: 0,
  });

  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userBadges, setUserBadges] = useState<{ [anime: string]: BadgeLevel }>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    character: string;
    score: number;
  } | null>(null);

  // Get theme classes for the selected anime
  const themeClasses = getThemeClasses(selectedAnime);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (initialPuzzle) {
      setCurrentGamePuzzle(initialPuzzle);
      if (initialPuzzle.type === 'word-puzzle' && initialPuzzle.wordPuzzle) {
        setPuzzleState({
          currentPuzzle: initialPuzzle.wordPuzzle,
          placedTiles: {},
          availableTiles: initialPuzzle.wordPuzzle.tiles,
          isCompleted: false,
          score: 0,
          hintsUsed: 0,
        });
      }
    }
  }, [initialPuzzle]);

  const handleTileDrop = (tileText: string, blankIndex: number) => {
    if (puzzleState.isCompleted) return;

    setPuzzleState((prev) => {
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
        availableTiles: newAvailableTiles,
      };
    });
  };

  const handleTileReturn = (blankIndex: number) => {
    if (puzzleState.isCompleted) return;

    setPuzzleState((prev) => {
      const newPlacedTiles = { ...prev.placedTiles };
      const newAvailableTiles = [...prev.availableTiles];

      if (newPlacedTiles[blankIndex]) {
        newAvailableTiles.push(newPlacedTiles[blankIndex]);
        delete newPlacedTiles[blankIndex];
      }

      return {
        ...prev,
        placedTiles: newPlacedTiles,
        availableTiles: newAvailableTiles,
      };
    });
  };

  const handleSubmitSolution = async () => {
    if (!puzzleState.currentPuzzle || isSubmitting) return;

    const solution = puzzleState.currentPuzzle.blanks.map(
      (_, index) => puzzleState.placedTiles[index] || ''
    );

    // Check if all blanks are filled
    if (solution.some((word) => !word)) {
      const character = puzzleState.currentPuzzle.character;
      const incompleteMessages: { [key: string]: string } = {
        'Rock Lee': 'Youth requires completion! Fill all blanks! 💪',
        'Naruto Uzumaki': 'Hey! You missed some blanks, dattebayo! 🍃',
        'Monkey D. Luffy': 'Oi! You forgot some pieces! 🏴‍☠️',
        'Light Yagami': 'Incomplete data. Fill all fields. 📓',
        'Tanjiro Kamado': 'Please complete all blanks with kindness! 🌊',
        'Anya Forger': 'Anya sees empty spaces! Fill them! ⭐',
        'All Might': 'A hero completes the mission! Fill all blanks! 💪',
        'Ichigo Kurosaki': "Don't leave anything unfinished! ⚔️",
        'Goku': 'Hey! You missed some spots! 😅',
      };

      const message =
        incompleteMessages[character] || 'Please fill in all blanks before submitting! 💭';
      setFeedback(message);
      setTimeout(() => setFeedback(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setFeedback('Checking your answer... ⚡');

    try {
      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use mock validation
      const isCorrect = MockDataService.validateSolution(puzzleState.currentPuzzle, solution);

      if (isCorrect) {
        const baseScore =
          puzzleState.currentPuzzle.difficulty === 'easy'
            ? 100
            : puzzleState.currentPuzzle.difficulty === 'medium'
              ? 200
              : 300;
        const hintPenalty = puzzleState.hintsUsed * 25;
        const score = Math.max(baseScore - hintPenalty, 10);
        const maxScore =
          puzzleState.currentPuzzle.difficulty === 'easy'
            ? 100
            : puzzleState.currentPuzzle.difficulty === 'medium'
              ? 200
              : 300;

        const characterFeedback = FeedbackService.getFeedback(
          puzzleState.currentPuzzle.character,
          score,
          maxScore,
          puzzleState.hintsUsed
        );
        setFeedback(characterFeedback);
        setPuzzleState((prev) => ({ ...prev, isCompleted: true, score }));

        // Show celebration for high scores
        if (score >= maxScore * 0.7) {
          setCelebrationData({ character: puzzleState.currentPuzzle.character, score });
          setShowCelebration(true);
        }

        onPuzzleComplete(score);

        // Load next puzzle after a delay
        setTimeout(() => {
          const difficultyForPuzzle =
            selectedDifficulty === 'mixed' ? undefined : selectedDifficulty;
          const nextPuzzle = MockDataService.getRandomPuzzle(difficultyForPuzzle, selectedAnime);
          setCurrentGamePuzzle(nextPuzzle);

          if (nextPuzzle.type === 'word-puzzle' && nextPuzzle.wordPuzzle) {
            setPuzzleState({
              currentPuzzle: nextPuzzle.wordPuzzle,
              placedTiles: {},
              availableTiles: nextPuzzle.wordPuzzle.tiles,
              isCompleted: false,
              score: 0,
              hintsUsed: 0,
            });
          }
          setFeedback('');
          setShowHints(false);
        }, 2500);
      } else {
        const wrongFeedback = FeedbackService.getWrongAnswerFeedback(
          puzzleState.currentPuzzle.character
        );
        setFeedback(`❌ ${wrongFeedback}`);
        onWrongAnswer(); // Lose a heart
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setFeedback('❌ Something went wrong! Try again! 🔄');
      setTimeout(() => setFeedback(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseHint = () => {
    setShowHints(true);
    setPuzzleState((prev) => {
      const newHintsUsed = prev.hintsUsed + 1;

      // Show character-specific hint reaction
      if (prev.currentPuzzle) {
        const hintReaction = FeedbackService.getHintFeedback(
          prev.currentPuzzle.character,
          newHintsUsed
        );
        setFeedback(hintReaction);
        setTimeout(() => setFeedback(''), 2000);
      }

      return { ...prev, hintsUsed: newHintsUsed };
    });
  };

  const handleCharacterGuess = async (guess: string, hintsUsed: number) => {
    if (
      !currentGamePuzzle ||
      currentGamePuzzle.type !== 'character-guess' ||
      !currentGamePuzzle.characterQuiz ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);
    setFeedback('Checking your guess... 🤔');

    try {
      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use mock validation
      const isCorrect = MockDataService.validateCharacterGuess(
        currentGamePuzzle.characterQuiz,
        guess
      );

      if (isCorrect) {
        const baseScore =
          currentGamePuzzle.characterQuiz.difficulty === 'easy'
            ? 150
            : currentGamePuzzle.characterQuiz.difficulty === 'medium'
              ? 250
              : 350;
        const hintPenalty = hintsUsed * 30;
        const score = Math.max(baseScore - hintPenalty, 15);
        const maxScore =
          currentGamePuzzle.characterQuiz.difficulty === 'easy'
            ? 150
            : currentGamePuzzle.characterQuiz.difficulty === 'medium'
              ? 250
              : 350;

        const characterFeedback = FeedbackService.getFeedback(
          currentGamePuzzle.characterQuiz.character,
          score,
          maxScore,
          hintsUsed
        );
        setFeedback(`🎉 ${characterFeedback} It was ${currentGamePuzzle.characterQuiz.character}!`);

        // Show celebration for high scores
        if (score >= maxScore * 0.7) {
          setCelebrationData({ character: currentGamePuzzle.characterQuiz.character, score });
          setShowCelebration(true);
        }

        onPuzzleComplete(score);

        // Load next puzzle after a delay
        setTimeout(() => {
          const difficultyForPuzzle =
            selectedDifficulty === 'mixed' ? undefined : selectedDifficulty;
          const nextPuzzle = MockDataService.getRandomPuzzle(difficultyForPuzzle, selectedAnime);
          setCurrentGamePuzzle(nextPuzzle);

          if (nextPuzzle.type === 'word-puzzle' && nextPuzzle.wordPuzzle) {
            setPuzzleState({
              currentPuzzle: nextPuzzle.wordPuzzle,
              placedTiles: {},
              availableTiles: nextPuzzle.wordPuzzle.tiles,
              isCompleted: false,
              score: 0,
              hintsUsed: 0,
            });
          }
          setFeedback('');
          setShowHints(false);
        }, 3000);
      } else {
        const wrongFeedback = FeedbackService.getWrongAnswerFeedback(
          currentGamePuzzle.characterQuiz.character
        );
        setFeedback(`❌ ${wrongFeedback}`);
        onWrongAnswer(); // Lose a heart
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting character guess:', error);
      setFeedback('❌ Something went wrong! Try again! 🔄');
      setTimeout(() => setFeedback(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPuzzle = () => {
    const difficultyForPuzzle = selectedDifficulty === 'mixed' ? undefined : selectedDifficulty;
    const puzzle = MockDataService.getRandomPuzzle(difficultyForPuzzle, selectedAnime);
    setCurrentGamePuzzle(puzzle);

    if (puzzle.type === 'word-puzzle' && puzzle.wordPuzzle) {
      setPuzzleState({
        currentPuzzle: puzzle.wordPuzzle,
        placedTiles: {},
        availableTiles: puzzle.wordPuzzle.tiles,
        isCompleted: false,
        score: 0,
        hintsUsed: 0,
      });
    }
    setFeedback('');
    setShowHints(false);

    console.log('🎲 Manual new puzzle requested');
  };

  if (!currentGamePuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  // Render Character Quiz
  if (currentGamePuzzle.type === 'character-guess' && currentGamePuzzle.characterQuiz) {
    return (
      <CharacterQuiz
        quiz={currentGamePuzzle.characterQuiz}
        gameStats={gameStats}
        selectedAnime={selectedAnime}
        onSubmitGuess={handleCharacterGuess}
        onNewPuzzle={handleNewPuzzle}
        onBackToDifficulty={onBackToDifficulty}
        onShowBadges={onShowBadges}
        onSpendHeart={onWrongAnswer}
        isSubmitting={isSubmitting}
        feedback={feedback}
      />
    );
  }

  // Render Word Puzzle
  if (
    currentGamePuzzle.type === 'word-puzzle' &&
    currentGamePuzzle.wordPuzzle &&
    puzzleState.currentPuzzle
  ) {
    return (
      <AnimeBackground theme={selectedAnime.toLowerCase().replace(/\s+/g, '') as any}>
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
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
                  className={`flex items-center space-x-2 px-4 py-2 ${themeClasses.primary} hover:opacity-90 text-white rounded-lg transition-all`}
                >
                  <span>🏆</span>
                  <span>Badges</span>
                </button>
              </div>

              <div className="text-center">
                <h1 className={`text-3xl ${themeClasses.primaryText} text-gray-900 mb-2`}>
                  {selectedAnime} Quiz
                </h1>
                <p className="text-gray-600">
                  Complete the anime quote by dragging tiles to the blanks!
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <HeartsDisplay hearts={gameStats.hearts} maxHearts={gameStats.maxHearts} />
                <EnergyDisplay
                  energy={gameStats.energy}
                  maxEnergy={gameStats.maxEnergy}
                  lastReset={gameStats.lastEnergyReset}
                />
              </div>
            </div>

            {/* Score and Info */}
            <ScoreDisplay
              score={puzzleState.score}
              hintsUsed={puzzleState.hintsUsed}
              difficulty={puzzleState.currentPuzzle.difficulty}
              anime={puzzleState.currentPuzzle.anime}
              character={puzzleState.currentPuzzle.character}
            />

            {/* Quote Display and Tile Board - Mobile vs Desktop */}
            {isMobile ? (
              <MobileTileInterface
                puzzle={puzzleState.currentPuzzle}
                availableTiles={puzzleState.availableTiles}
                placedTiles={puzzleState.placedTiles}
                onTilePlacement={handleTileDrop}
                onTileReturn={handleTileReturn}
              />
            ) : (
              <>
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
              </>
            )}

            {/* Hint Panel */}
            {showHints && <HintPanel hints={puzzleState.currentPuzzle.hints} />}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
              <button
                onClick={handleUseHint}
                disabled={showHints || puzzleState.isCompleted}
                className="px-3 sm:px-4 py-2 anime-gradient-warning text-gray-900 rounded-lg anime-button font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-sm sm:text-base shadow-lg"
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
                className="px-3 sm:px-4 py-2 anime-gradient-success text-white rounded-lg anime-button font-bold transition-all transform hover:scale-105 text-sm sm:text-base shadow-lg"
              >
                🎲 New Puzzle
              </button>

              <button
                onClick={() => setShowLeaderboard(true)}
                className="px-3 sm:px-4 py-2 anime-gradient-primary text-white rounded-lg anime-button font-bold transition-all transform hover:scale-105 text-sm sm:text-base shadow-lg"
              >
                🏆 Leaderboard
              </button>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`text-center p-4 rounded-xl font-bold text-lg anime-card shadow-2xl animate-bounce-in ${
                  feedback.includes('🎉') || feedback.includes('💥') || feedback.includes('⚡')
                    ? 'anime-gradient-success text-white animate-glow'
                    : feedback.includes('❌') || feedback.includes('💀') || feedback.includes('🥲')
                      ? 'anime-gradient-danger text-white animate-shake'
                      : feedback.includes('💡') ||
                          feedback.includes('💪') ||
                          feedback.includes('🔥')
                        ? 'anime-gradient-warning text-gray-900'
                        : 'anime-gradient-primary text-white'
                }`}
              >
                {feedback}
              </div>
            )}

            {/* Leaderboard Modal */}
            <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />

            {/* Completion Celebration */}
            {celebrationData && (
              <CompletionCelebration
                character={celebrationData.character}
                score={celebrationData.score}
                isVisible={showCelebration}
                onComplete={() => {
                  setShowCelebration(false);
                  setCelebrationData(null);
                }}
              />
            )}
          </div>
        </div>
      </AnimeBackground>
    );
  }

  // Fallback loading state
  return (
    <AnimeBackground theme="default">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="anime-text-glow">Loading epic anime puzzle...</p>
        </div>
      </div>
    </AnimeBackground>
  );
};
