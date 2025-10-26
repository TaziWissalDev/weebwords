import React from 'react';

interface SplashScreenProps {
  onPlay: () => void;
  username: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay, username }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md mx-auto">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Anime Line
          </h1>
          <div className="text-6xl mb-4">🎌</div>
          <p className="text-xl opacity-90">
            Complete iconic anime quotes by dragging word tiles!
          </p>
        </div>

        {/* Welcome message */}
        {username && username !== 'anonymous' && (
          <div className="mb-6">
            <p className="text-lg opacity-80">
              Welcome back, <span className="font-semibold">{username}</span>! 👋
            </p>
          </div>
        )}

        {/* Features */}
        <div className="mb-8 space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧩</span>
            <span>Drag & drop word tiles to complete quotes</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💡</span>
            <span>Use hints when you're stuck</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🏆</span>
            <span>Earn points based on difficulty & speed</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📚</span>
            <span>Quotes from Naruto, One Piece, JJK & more!</span>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={onPlay}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-xl px-8 py-4 rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          🎮 Start Playing
        </button>

        {/* Footer */}
        <div className="mt-8 text-sm opacity-70">
          <p>Test your anime knowledge and have fun! 🌟</p>
        </div>
      </div>
    </div>
  );
};
