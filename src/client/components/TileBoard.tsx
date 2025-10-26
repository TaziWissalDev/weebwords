import React from 'react';

interface TileBoardProps {
  availableTiles: string[];
  onTileDrag: (tile: string) => void;
}

export const TileBoard: React.FC<TileBoardProps> = ({ availableTiles, onTileDrag }) => {
  return (
    <div
      className="anime-card rounded-xl shadow-2xl p-3 sm:p-6 anime-card-hover animate-slide-in"
      style={{ animationDelay: '0.2s' }}
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
        Available Tiles
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {availableTiles.map((tile, index) => (
          <div
            key={`${tile}-${index}`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', tile);
              onTileDrag(tile);
            }}
            onClick={() => {
              // For mobile: simulate drag by adding to a selected state
              // This would need additional logic for mobile tap-to-place
            }}
            className="anime-gradient-primary text-white px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-center font-bold cursor-grab active:cursor-grabbing anime-button transition-all transform hover:scale-110 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[40px] sm:min-h-[48px] flex items-center justify-center anime-border animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {tile}
          </div>
        ))}
      </div>

      {availableTiles.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <p className="text-sm sm:text-base">All tiles have been used!</p>
        </div>
      )}

      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          Drag tiles to the blanks above or tap to select on mobile
        </p>
      </div>
    </div>
  );
};
