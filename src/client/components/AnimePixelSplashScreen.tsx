import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

interface AnimePixelSplashScreenProps {
  onPlay: () => void;
  onDailyPack: () => void;
  onShowLeaderboard: () => void;
  username: string;
}

export const AnimePixelSplashScreen: React.FC<AnimePixelSplashScreenProps> = ({
  onPlay,
  onDailyPack,
  onShowLeaderboard,
  username
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const { sounds, resumeAudio } = useSound();

  useEffect(() => {
    // Initialize audio and show loading animation
    resumeAudio();
    
    // Simulate loading time for dramatic effect
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    }, 2000);

    return () => clearTimeout(loadTimer);
  }, [resumeAudio]);

  const handlePlayClick = () => {
    sounds.button();
    setTimeout(() => {
      onPlay();
    }, 200);
  };

  const handleDailyPackClick = () => {
    sounds.button();
    setTimeout(() => {
      onDailyPack();
    }, 200);
  };

  const handleLeaderboardClick = () => {
    sounds.button();
    setTimeout(() => {
      onShowLeaderboard();
    }, 200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="anime-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="anime-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Cyber grid overlay */}
        <div className="cyber-grid opacity-20"></div>
        <div className="scan-lines opacity-30"></div>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-5"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        
        {/* Hero Image Section */}
        <div className="text-center mb-8">
          {/* Pixel Art Characters Background */}
          <div className="relative mb-6">
            <div 
              className="w-80 h-48 sm:w-96 sm:h-56 mx-auto rounded-2xl overflow-hidden border-4 border-cyan-400 shadow-2xl animate-float"
              style={{
                background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><defs><pattern id="pixel" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="%23667eea"/><rect width="4" height="4" fill="%23764ba2"/></pattern></defs><rect width="400" height="240" fill="url(%23pixel)"/></svg>')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay with anime characters representation */}
              <div className="w-full h-full bg-gradient-to-br from-purple-600/80 via-blue-600/80 to-indigo-600/80 flex items-center justify-center relative">
                
                {/* Central Mascot */}
                <div className="text-center">
                  <div className="text-6xl mb-2 animate-bounce">🐼</div>
                  <div className="text-white font-bold text-sm animate-pulse">ANIME QUEST</div>
                </div>

                {/* Floating Character Emojis */}
                <div className="absolute top-2 left-4 text-2xl animate-float" style={{ animationDelay: '0s' }}>🧙‍♂️</div>
                <div className="absolute top-4 right-6 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>⚔️</div>
                <div className="absolute bottom-4 left-6 text-2xl animate-float" style={{ animationDelay: '1s' }}>🏴‍☠️</div>
                <div className="absolute bottom-2 right-4 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>🦸‍♀️</div>
                <div className="absolute top-1/2 left-2 text-2xl animate-float" style={{ animationDelay: '2s' }}>🥷</div>
                <div className="absolute top-1/2 right-2 text-2xl animate-float" style={{ animationDelay: '2.5s' }}>👹</div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-float" style={{ animationDelay: '3s' }}>⚡</div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl animate-float" style={{ animationDelay: '3.5s' }}>🔥</div>

                {/* Sparkle effects */}
                <div className="absolute top-6 left-12 text-yellow-300 animate-ping">✨</div>
                <div className="absolute bottom-6 right-12 text-yellow-300 animate-ping" style={{ animationDelay: '1s' }}>✨</div>
                <div className="absolute top-12 right-8 text-yellow-300 animate-ping" style={{ animationDelay: '2s' }}>⭐</div>
                <div className="absolute bottom-12 left-8 text-yellow-300 animate-ping" style={{ animationDelay: '0.5s' }}>⭐</div>
              </div>
            </div>
          </div>

          {/* Game Title with improved contrast */}
          <div className="mb-6">
            {/* Main title with text shadow and background */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-black/60 rounded-2xl blur-xl"></div>
              <h1 className="relative anime-title text-4xl sm:text-6xl lg:text-7xl mb-2 animate-glow text-white font-black"
                  style={{ 
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                  }}>
                ANIME PIXEL QUEST
              </h1>
            </div>
            
            {/* Subtitle with enhanced readability */}
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-black/50 rounded-lg blur-md"></div>
              <div className="relative anime-text-neon text-lg sm:text-xl text-cyan-300 animate-pulse font-bold px-4 py-2"
                   style={{ 
                     textShadow: '0 0 10px rgba(6, 182, 212, 1), 1px 1px 2px rgba(0,0,0,0.8)',
                     filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                   }}>
                🎮 Test Your Anime Knowledge 🎮
              </div>
            </div>
            
            {/* Series list with better contrast */}
            <div className="relative">
              <div className="absolute inset-0 bg-black/40 rounded-lg blur-sm"></div>
              <div className="relative anime-text-pixel text-sm text-white font-semibold px-3 py-1"
                   style={{ 
                     textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                     filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                   }}>
                Featuring Naruto • One Piece • JJK • Attack on Titan & More!
              </div>
            </div>
          </div>

          {/* Loading Animation with better visibility */}
          {!isLoaded && (
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-black/50 rounded-xl blur-md"></div>
                <div className="relative px-8 py-6">
                  <div className="anime-loading mx-auto mb-4" style={{ width: '64px', height: '64px' }}></div>
                  <div className="anime-text-pixel text-cyan-300 font-bold text-lg"
                       style={{ 
                         textShadow: '0 0 10px rgba(6, 182, 212, 0.8), 1px 1px 2px rgba(0,0,0,0.9)',
                         filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                       }}>
                    LOADING ANIME UNIVERSE...
                  </div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Message with enhanced readability */}
          {isLoaded && (
            <div className="mb-8 animate-slide-in max-w-3xl mx-auto">
              {/* Welcome text with background */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-black/50 rounded-xl blur-sm"></div>
                <div className="relative anime-text-pixel text-white text-lg mb-2 px-4 py-2 font-bold"
                     style={{ 
                       textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
                       filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                     }}>
                  Welcome back, {username}! 👋
                </div>
              </div>
              
              {/* Description with improved contrast */}
              <div className="relative">
                <div className="absolute inset-0 bg-black/60 rounded-xl blur-md"></div>
                <div className="relative text-white text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-6 py-4 font-medium"
                     style={{ 
                       textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                       filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                     }}>
                  <span className="text-cyan-300 font-bold">Guess</span>, <span className="text-purple-300 font-bold">drag</span>, and <span className="text-yellow-300 font-bold">flex your anime IQ!</span> Complete legendary anime quotes, guess the speaker, or match the mood — all in one word-tile challenge!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showButtons && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl animate-bounce-in">
            
            {/* Main Play Button */}
            <button
              onClick={handlePlayClick}
              className="pixel-button text-lg sm:text-xl py-6 px-8 animate-neon-glow transform hover:scale-105 transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-blue) 100%)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)'
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🎮</span>
                <div>
                  <div className="font-bold">PLAY NOW</div>
                  <div className="text-sm opacity-80">Channel your inner sensei 🥢</div>
                </div>
              </div>
            </button>

            {/* Daily Challenge Button */}
            <button
              onClick={handleDailyPackClick}
              className="pixel-button text-lg sm:text-xl py-6 px-8 animate-purple-glow transform hover:scale-105 transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <div className="font-bold">DAILY CHALLENGE</div>
                  <div className="text-sm opacity-80">Special Missions</div>
                </div>
              </div>
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={handleLeaderboardClick}
              className="pixel-button text-lg sm:text-xl py-6 px-8 animate-gold-glow transform hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1"
              style={{ 
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255,215,0,0.8)',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <div className="font-bold">LEADERBOARD</div>
                  <div className="text-sm opacity-80">Hall of Fame</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Game Features Preview with enhanced readability */}
        {showButtons && (
          <div className="mt-12 max-w-4xl w-full animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              {/* Complete Quotes Feature */}
              <div className="relative neon-card p-6 hover:scale-105 transition-transform duration-300 bg-black/40 backdrop-blur-sm border-2 border-cyan-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg"></div>
                <div className="relative">
                  <div className="text-4xl mb-3 filter drop-shadow-lg">🎯</div>
                  <div className="anime-text-pixel text-cyan-300 text-sm mb-2 font-bold"
                       style={{ 
                         textShadow: '0 0 8px rgba(6, 182, 212, 0.8), 1px 1px 2px rgba(0,0,0,0.9)'
                       }}>
                    COMPLETE QUOTES
                  </div>
                  <div className="text-white text-xs leading-relaxed font-medium"
                       style={{ 
                         textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
                       }}>
                    Drag word tiles to finish legendary lines
                  </div>
                </div>
              </div>

              {/* Guess Speaker Feature */}
              <div className="relative neon-card p-6 hover:scale-105 transition-transform duration-300 bg-black/40 backdrop-blur-sm border-2 border-purple-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg"></div>
                <div className="relative">
                  <div className="text-4xl mb-3 filter drop-shadow-lg">🎭</div>
                  <div className="anime-text-pixel text-purple-300 text-sm mb-2 font-bold"
                       style={{ 
                         textShadow: '0 0 8px rgba(168, 85, 247, 0.8), 1px 1px 2px rgba(0,0,0,0.9)'
                       }}>
                    GUESS THE SPEAKER
                  </div>
                  <div className="text-white text-xs leading-relaxed font-medium"
                       style={{ 
                         textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
                       }}>
                    Identify who said the iconic quote
                  </div>
                </div>
              </div>

              {/* Leaderboard Feature */}
              <div className="relative neon-card p-6 hover:scale-105 transition-transform duration-300 bg-black/40 backdrop-blur-sm border-2 border-yellow-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg"></div>
                <div className="relative">
                  <div className="text-4xl mb-3 filter drop-shadow-lg">🏆</div>
                  <div className="anime-text-pixel text-yellow-300 text-sm mb-2 font-bold"
                       style={{ 
                         textShadow: '0 0 8px rgba(255, 215, 0, 0.8), 1px 1px 2px rgba(0,0,0,0.9)'
                       }}>
                    CLIMB LEADERBOARD
                  </div>
                  <div className="text-white text-xs leading-relaxed font-medium"
                       style={{ 
                         textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
                       }}>
                    Test Naruto, One Piece, JJK & more!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer with enhanced visibility */}
        {showButtons && (
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-black/30 rounded-lg blur-sm"></div>
              <div className="relative anime-text-pixel text-white text-xs px-4 py-2 font-medium"
                   style={{ 
                     textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                     filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                   }}>
                🌟 Powered by Anime Passion & Pixel Perfect Design 🌟
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Audio Visualizer Effect */}
      <div className="fixed bottom-4 right-4 opacity-30">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-cyan-400 animate-pulse"
              style={{
                height: `${20 + Math.random() * 20}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
