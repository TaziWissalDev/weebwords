import React, { useState } from 'react';
import { AnimePuzzle } from '../../shared/types/puzzle';

interface MobileTileInterfaceProps {
  puzzle: AnimePuzzle;
  availableTiles: string[];
  placedTiles: { [key: number]: string };
  onTilePlacement: (tileText: string, blankIndex: number) => void;
  onTileReturn: (blankIndex: number) => void;
}

export const MobileTileInterface: React.FC<MobileTileInterfaceProps> = ({
  puzzle,
  availableTiles,
  placedTiles,
  onTilePlacement,
  onTileReturn
}) => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [selectedBlank, setSelectedBlank] = useState<number | null>(null);

  const handleTileSelect = (tile: string) => {
    if (selectedTile === tile) {
      setSelectedTile(null);
    } else {
      setSelectedTile(tile);
      setSelectedBlank(null);
    }
  };

  const handleBlankSelect = (blankIndex: number) => {
    if (placedTiles[blankIndex]) {
      // Remove tile from blank
      onTileReturn(blankIndex);
      setSelectedBlank(null);
    } else if (selectedTile) {
      // Place selected tile in blank
      onTilePlacement(selectedTile, blankIndex);
      setSelectedTile(null);
      setSelectedBlank(null);
    } else {
      setSelectedBlank(blankIndex);
    }
  };

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
        const isSelected = selectedBlank === blankIndex;
        
        elements.push(
          <button
            key={`blank-${blankIndex}`}
            className={`inline-block min-w-[60px] sm:min-w-[80px] h-10 sm:h-12 mx-1 px-2 sm:px-3 py-1 sm:py-2 border-2 rounded-lg text-center font-medium transition-all text-sm sm:text-base ${
              placedTile 
                ? 'border-blue-500 bg-blue-50 text-blue-800' 
                : isSelected
                ? 'border-green-500 bg-green-50 text-green-800 animate-pulse'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
            onClick={() => handleBlankSelect(blankIndex)}
          >
            {placedTile || (isSelected ? 'TAP TILE' : '____')}
          </button>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Quote with Interactive Blanks */}
      <div className="anime-card rounded-xl shadow-2xl p-3 sm:p-6 anime-card-hover animate-slide-in">
        <div className="text-base sm:text-lg leading-relaxed text-center py-4 sm:py-8 px-2 sm:px-4 anime-gradient-primary rounded-lg border-2 border-white/30 text-white font-semibold anime-text-glow">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {renderQuoteWithBlanks()}
          </div>
        </div>
        
        {/* Mobile Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            {selectedTile 
              ? `Tap a blank to place "${selectedTile}"` 
              : selectedBlank !== null
              ? 'Tap a tile below to place it'
              : 'Tap a tile, then tap a blank to place it'
            }
          </p>
        </div>
      </div>

      {/* Interactive Tile Selection */}
      <div className="anime-card rounded-xl shadow-2xl p-3 sm:p-6 anime-card-hover animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
          Available Tiles
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {availableTiles.map((tile, index) => (
            <button
              key={`${tile}-${index}`}
              onClick={() => handleTileSelect(tile)}
              className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-center font-bold transition-all shadow-lg text-sm sm:text-base min-h-[40px] sm:min-h-[48px] flex items-center justify-center anime-button ${
                selectedTile === tile
                  ? 'anime-gradient-success text-white ring-2 ring-green-300 scale-110 animate-glow'
                  : 'anime-gradient-primary text-white hover:scale-105 anime-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tile}
            </button>
          ))}
        </div>
        
        {availableTiles.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">All tiles have been used!</p>
          </div>
        )}

        {/* Selection Status */}
        {selectedTile && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-800">
              <span className="font-semibold">"{selectedTile}"</span> selected - tap a blank above to place it
            </p>
            <button
              onClick={() => setSelectedTile(null)}
              className="mt-2 text-xs text-green-600 hover:text-green-800 underline"
            >
              Cancel selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
