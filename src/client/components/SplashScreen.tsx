import React from 'react';
import { BadgeShowcase } from './BadgeShowcase';
import { AnimeBackground } from './AnimeBackground';

interface SplashScreenProps {
  onPlay: () => void;
  onDailyPack: () => void;
  username: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay, onDailyPack, username }) => {
  return (
    <AnimeBackground theme="default">
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="text-center text-white max-w-sm sm:max-w-md mx-auto w-full anime-card-hover">
          {/* Logo/Title */}
          <div className="mb-6 sm:mb-8 animate-bounce-in">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 anime-text-glow anime-text-outline bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-float">
              ANIME LINE
            </h1>
            <div className="text-5xl sm:text-7xl mb-4 animate-glow">🎌⚡🌟</div>
            <p className="text-lg sm:text-xl font-semibold anime-text-glow">
              Complete epic anime quotes & guess legendary characters!
            </p>
          </div>

        {/* Welcome message */}
        {username && username !== 'anonymous' && (
          <div className="mb-4 sm:mb-6">
            <p className="text-base sm:text-lg opacity-80">
              Welcome back, <span className="font-semibold">{username}</span>! 👋
            </p>
          </div>
        )}

          {/* Badge Showcase */}
          {username && username !== 'anonymous' && (
            <div className="mb-6 anime-card rounded-xl p-4 animate-slide-in">
              <BadgeShowcase username={username} />
            </div>
          )}

          {/* Features */}
          <div className="mb-8 space-y-4 text-left anime-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 anime-border">
              <span className="text-3xl animate-sparkle">🧩</span>
              <span className="font-semibold text-gray-800">Complete epic anime quotes with word tiles</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-pink-500/20 to-red-500/20 anime-border">
              <span className="text-3xl animate-sparkle" style={{ animationDelay: '0.5s' }}>🎭</span>
              <span className="font-semibold text-gray-800">Guess legendary characters from clues</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 anime-border">
              <span className="text-3xl animate-sparkle" style={{ animationDelay: '1s' }}>💡</span>
              <span className="font-semibold text-gray-800">Get hints with character voice responses</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 anime-border">
              <span className="text-3xl animate-sparkle" style={{ animationDelay: '1.5s' }}>🏆</span>
              <span className="font-semibold text-gray-800">Earn badges & climb anime leaderboards</span>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 anime-border">
              <span className="text-3xl animate-sparkle" style={{ animationDelay: '2s' }}>📚</span>
              <span className="font-semibold text-gray-800">Naruto, One Piece, JJK, Demon Slayer & more!</span>
            </div>
        </div>

          {/* Play buttons */}
          <div className="space-y-4 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={onDailyPack}
              className="w-full anime-button anime-gradient-secondary text-white font-black text-xl px-8 py-4 rounded-full transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 anime-border animate-glow"
            >
              ⚡ DAILY CHALLENGE ⚡
            </button>
            
            <button
              onClick={onPlay}
              className="w-full anime-button anime-gradient-warning text-gray-900 font-black text-xl px-8 py-4 rounded-full transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 anime-border animate-glow"
              style={{ animationDelay: '0.5s' }}
            >
              🔥 START ADVENTURE 🔥
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-sm font-semibold anime-text-glow animate-float">
            <p>🌟 Become the ultimate anime master! 🌟</p>
          </div>
        </div>
      </div>
    </AnimeBackground>
  );
};
