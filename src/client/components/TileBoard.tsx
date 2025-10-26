import React from 'react';

interface TileBoardProps {
  availableTiles: string[];
  onTileDrag: (tile: string) => void;
}

export const TileBoard: React.FC<TileBoardProps> = ({ availableTiles, onTileDrag }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Available Tiles
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
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg text-center font-medium cursor-grab active:cursor-grabbing hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
          >
            {tile}
          </div>
        ))}
      </div>
      
      {availableTiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>All tiles have been used!</p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Drag tiles to the blanks above to complete the quote
        </p>
      </div>
    </div>
  );
};
