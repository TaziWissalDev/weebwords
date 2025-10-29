import React from 'react';
import { BadgeShowcase } from './BadgeShowcase';
import { AnimeBackground } from './AnimeBackground';

interface SplashScreenProps {
  onPlay: () => void;
  onDailyPack: () => void;
  onShowLeaderboard: () => void;
  username: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay, onDailyPack, onShowLeaderboard, username }) => {
  return (
    <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
      <div className="cyber-grid"></div>
      <div className="scan-lines"></div>
      <div className="anime-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="anime-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto w-full">
          {/* Futuristic Logo/Title */}
          <div className="mb-6 sm:mb-8 animate-bounce-in">
            <h1 className="anime-title text-3xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">
              ANIME PIXEL QUEST
            </h1>
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 animate-float">🎌⚡🌟</div>
            <p className="anime-text-neon text-sm sm:text-xl px-2">
              COMPLETE EPIC ANIME QUOTES & GUESS LEGENDARY CHARACTERS!
            </p>
          </div>

          {/* Welcome message */}
          {username && username !== 'anonymous' && (
            <div className="mb-4 sm:mb-6">
              <p className="anime-text-pixel text-cyan-400 text-xs sm:text-base px-2">
                WELCOME BACK, <span className="text-yellow-400">{username.toUpperCase()}</span>! 👋
              </p>
            </div>
          )}

          {/* Badge Showcase */}
          {username && username !== 'anonymous' && (
            <div className="mb-4 sm:mb-6 neon-card p-3 sm:p-4 animate-slide-in mx-2 sm:mx-0">
              <BadgeShowcase username={username} />
            </div>
          )}

          {/* Features */}
          <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3 neon-card p-4 sm:p-6 animate-slide-in mx-2 sm:mx-0" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg holo-border">
              <span className="text-2xl sm:text-3xl animate-sparkle">🧩</span>
              <span className="anime-text-pixel text-xs sm:text-sm text-cyan-300">COMPLETE EPIC ANIME QUOTES</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg holo-border">
              <span className="text-2xl sm:text-3xl animate-sparkle" style={{ animationDelay: '0.5s' }}>🎭</span>
              <span className="anime-text-pixel text-xs sm:text-sm text-purple-300">GUESS LEGENDARY CHARACTERS</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg holo-border">
              <span className="text-2xl sm:text-3xl animate-sparkle" style={{ animationDelay: '1s' }}>💡</span>
              <span className="anime-text-pixel text-xs sm:text-sm text-yellow-300">CHARACTER VOICE HINTS</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg holo-border">
              <span className="text-2xl sm:text-3xl animate-sparkle" style={{ animationDelay: '1.5s' }}>🏆</span>
              <span className="anime-text-pixel text-xs sm:text-sm text-green-300">EARN BADGES & CLIMB RANKS</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg holo-border">
              <span className="text-2xl sm:text-3xl animate-sparkle" style={{ animationDelay: '2s' }}>📚</span>
              <span className="anime-text-pixel text-xs sm:text-sm text-pink-300">NARUTO • ONE PIECE • JJK • MORE!</span>
            </div>
          </div>

          {/* Futuristic Play buttons */}
          <div className="space-y-3 sm:space-y-4 animate-bounce-in px-2 sm:px-0" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={onDailyPack}
              className="w-full pixel-button text-sm sm:text-lg lg:text-2xl py-3 sm:py-4 lg:py-6 animate-purple-glow"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%)',
                color: '#fff',
                textShadow: '0 0 10px rgba(0,0,0,0.8)'
              }}
            >
              ⚡ DAILY CHALLENGE ⚡
            </button>
            
            <button
              onClick={onPlay}
              className="w-full pixel-button text-sm sm:text-lg lg:text-2xl py-3 sm:py-4 lg:py-6 animate-neon-glow"
              style={{ animationDelay: '0.5s' }}
            >
              🔥 START ADVENTURE 🔥
            </button>
            
            <button
              onClick={onShowLeaderboard}
              className="w-full pixel-button text-sm sm:text-lg lg:text-2xl py-3 sm:py-4 lg:py-6 animate-gold-glow"
              style={{ 
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255,215,0,0.8)',
                animationDelay: '0.7s'
              }}
            >
              🏆 GLOBAL LEADERBOARD 🏆
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 anime-text-pixel text-cyan-400 animate-float px-2">
            <p className="text-xs sm:text-base">🌟 BECOME THE ULTIMATE ANIME MASTER! 🌟</p>
          </div>
        </div>
      </div>
    </div>
  );
};
