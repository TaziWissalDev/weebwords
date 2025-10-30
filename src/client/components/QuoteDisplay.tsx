import React, { useState, useEffect } from 'react';
import { AnimePuzzle } from '../../shared/types/puzzle';

interface QuoteDisplayProps {
  puzzle: AnimePuzzle;
  placedTiles: { [key: number]: string };
  onTileReturn: (blankIndex: number) => void;
  onTileDrop: (tileText: string, blankIndex: number) => void;
  hintsUsed?: number;
  showHints?: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  puzzle,
  placedTiles,
  onTileReturn,
  onTileDrop,
  hintsUsed = 0,
  showHints = false
}) => {
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

  // Reveal words based on hints used
  useEffect(() => {
    if (showHints && hintsUsed > 0) {
      const newRevealed = new Set<number>();
      // Reveal one word per hint used
      for (let i = 0; i < Math.min(hintsUsed, puzzle.blanks.length); i++) {
        newRevealed.add(i);
      }
      setRevealedWords(newRevealed);
    }
  }, [hintsUsed, showHints, puzzle.blanks.length]);
  const renderQuoteWithBlanks = () => {
    const parts = puzzle.quote_puzzle.split('____');
    const elements: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      // Add the text part (no blur effect)
      if (part) {
        elements.push(
          <span 
            key={`text-${index}`} 
            className="transition-all duration-500 blur-none opacity-100"
          >
            {part}
          </span>
        );
      }
      
      // Add blank slot if not the last part
      if (index < parts.length - 1) {
        const blankIndex = index;
        const placedTile = placedTiles[blankIndex];
        const isRevealed = revealedWords.has(blankIndex);
        const correctAnswer = puzzle.blanks[blankIndex];
        
        elements.push(
          <div
            key={`blank-${blankIndex}`}
            className={`inline-flex items-center justify-center min-w-[80px] sm:min-w-[100px] h-10 sm:h-12 mx-1 px-3 py-2 border-2 rounded-lg text-center cursor-pointer transition-all font-bold text-sm sm:text-base ${
              placedTile 
                ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg transform hover:scale-105' 
                : isRevealed
                  ? 'bg-green-400/20 text-green-300 border-green-400 animate-pulse'
                  : 'border-cyan-400/50 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
            }`}
            onClick={() => placedTile && onTileReturn(blankIndex)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const tileText = e.dataTransfer.getData('text/plain');
              if (tileText) {
                onTileDrop(tileText, blankIndex);
              }
            }}
          >
            {placedTile || (isRevealed ? `${correctAnswer}?` : '____')}
          </div>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="neon-card p-4 sm:p-6 animate-slide-in relative overflow-hidden">
      <div className="cyber-grid opacity-20"></div>
      <div className="relative z-10">
        {/* Anime and Character Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="anime-text-pixel text-sm text-white">{puzzle.anime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="anime-text-pixel text-xs text-gray-400">Character:</span>
            <span className="anime-text-pixel text-xs text-cyan-400">{puzzle.character}</span>
          </div>
        </div>
        
        {/* Quote with Blanks - Responsive Container */}
        <div className="bg-purple-900/50 rounded-lg border-2 border-cyan-400/50 p-4 sm:p-6 mb-4">
          <div className="text-center">
            <div className="text-base sm:text-lg lg:text-xl leading-relaxed text-white font-medium flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {renderQuoteWithBlanks()}
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="text-center">
          <p className="anime-text-pixel text-xs text-gray-400">
            DRAG TILES TO BLANKS • TAP TO SELECT ON MOBILE
          </p>
        </div>
        

      </div>
    </div>
  );
};
