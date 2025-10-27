import React from 'react';

interface TileBoardProps {
  availableTiles: string[];
  onTileDrag: (tile: string) => void;
}

export const TileBoard: React.FC<TileBoardProps> = ({ availableTiles, onTileDrag }) => {
  return (
    <div className="neon-card p-4 sm:p-6 animate-slide-in relative overflow-hidden">
      <div className="cyber-grid"></div>
      <div className="relative z-10">
        <h3 className="anime-text-neon text-center mb-4 text-lg">
          AVAILABLE TILES
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
              className="game-tile animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tile}
            </div>
          ))}
        </div>

        {availableTiles.length === 0 && (
          <div className="text-center py-8">
            <div className="anime-text-pixel text-cyan-400">
              ALL TILES DEPLOYED!
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Complete the puzzle to continue
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="anime-text-pixel text-xs text-gray-400">
            DRAG TILES TO BLANKS • TAP TO SELECT ON MOBILE
          </p>
        </div>
      </div>
    </div>
  );
};
