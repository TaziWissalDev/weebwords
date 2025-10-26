import React from 'react';
import { AnimePuzzle } from '../../shared/types/puzzle';

interface QuoteDisplayProps {
  puzzle: AnimePuzzle;
  placedTiles: { [key: number]: string };
  onTileReturn: (blankIndex: number) => void;
  onTileDrop: (tileText: string, blankIndex: number) => void;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  puzzle,
  placedTiles,
  onTileReturn,
  onTileDrop
}) => {
  const renderQuoteWithBlanks = () => {
    const parts = puzzle.quote_puzzle.split('____');
    const elements: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      // Add the text part
      if (part) {
        elements.push(
          <span key={`text-${index}`} className="text-gray-800">
            {part}
          </span>
        );
      }
      
      // Add blank slot if not the last part
      if (index < parts.length - 1) {
        const blankIndex = index;
        const placedTile = placedTiles[blankIndex];
        
        elements.push(
          <div
            key={`blank-${blankIndex}`}
            className={`inline-block min-w-[60px] sm:min-w-[80px] h-8 sm:h-10 mx-0.5 sm:mx-1 px-2 sm:px-3 py-1 sm:py-2 border-2 rounded-lg text-center cursor-pointer transition-all text-xs sm:text-sm font-bold ${
              placedTile 
                ? 'anime-gradient-success text-white border-white/50 animate-glow shadow-lg' 
                : 'border-white/50 bg-white/20 hover:bg-white/30 text-white animate-pulse'
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
            {placedTile || '____'}
          </div>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="anime-card rounded-xl shadow-2xl p-3 sm:p-6 anime-card-hover animate-slide-in">
      {/* Anime and Character Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <span className="text-sm font-medium text-gray-600">{puzzle.anime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-500">Character:</span>
          <span className="text-xs sm:text-sm font-medium text-gray-700">{puzzle.character}</span>
        </div>
      </div>
      
      {/* Quote with Blanks */}
      <div className="text-base sm:text-lg leading-relaxed text-center py-4 sm:py-8 px-2 sm:px-4 anime-gradient-primary rounded-lg border-2 border-white/30 text-white font-semibold anime-text-glow">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {renderQuoteWithBlanks()}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          Drag tiles from below to fill in the blanks, or tap on placed tiles to remove them
        </p>
      </div>
    </div>
  );
};
