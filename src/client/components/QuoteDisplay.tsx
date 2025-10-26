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
            className={`inline-block min-w-[80px] h-10 mx-1 px-3 py-2 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
              placedTile 
                ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Anime and Character Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <span className="text-sm font-medium text-gray-600">{puzzle.anime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Character:</span>
          <span className="text-sm font-medium text-gray-700">{puzzle.character}</span>
        </div>
      </div>
      
      {/* Quote with Blanks */}
      <div className="text-lg leading-relaxed text-center py-8 px-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {renderQuoteWithBlanks()}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Drag tiles from below to fill in the blanks, or click on placed tiles to remove them
        </p>
      </div>
    </div>
  );
};
