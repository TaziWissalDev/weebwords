import React, { useState, useEffect } from 'react';

interface PixelSplashScreenProps {
  onPlay: () => void;
  onDailyPack: () => void;
  onShowLeaderboard: () => void;
  username: string;
}

export const PixelSplashScreen: React.FC<PixelSplashScreenProps> = ({ 
  onPlay, 
  onDailyPack, 
  onShowLeaderboard, 
  username 
}) => {
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Staggered animation phases
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1000);
    const timer3 = setTimeout(() => setShowContent(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Anime-inspired character emojis to simulate the characters in the image
  const pixelCharacters = [
    '🥷', '👨‍🦱', '👩‍🦰', '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️', '👨‍🎤',
    '👩‍🎤', '🧝‍♂️', '🧝‍♀️', '👨‍🔬', '👩‍🔬', '🥋', '👨‍🎨', '👩‍🎨',
    '🧑‍🚀', '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🏫', '👩‍🏫', '👦', '👧',
    '🧑‍🦲', '👨‍🦳', '👩‍🦳', '🧑‍🦱', '👨‍🦰', '👩‍🦱', '🧑‍🦯', '👨‍🦯'
  ];

  const FloatingCharacter: React.FC<{ 
    emoji: string; 
    delay: number; 
    x: number; 
    y: number; 
    size: number;
  }> = ({ emoji, delay, x, y, size }) => (
    <div
      className={`absolute pixel-character ${animationPhase >= 1 ? 'animate-float-in' : 'opacity-0'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}px`,
        animationDelay: `${delay}s`,
        filter: 'drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.5))',
        transform: 'scale(0)',
        animation: animationPhase >= 1 ? `floatIn 0.8s ease-out ${delay}s forwards, pixelFloat 3s ease-in-out infinite ${delay + 0.8}s` : 'none'
      }}
    >
      {emoji}
    </div>
  );

  return (
    <div className="pixel-splash-bg min-h-screen relative overflow-hidden">
      {/* Cosmic background with animated stars */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Larger twinkling stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          >
            ✨
          </div>
        ))}

        {/* Cosmic nebula effects - reduced opacity and blur */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-pink-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Floating pixel characters arranged in multiple circles */}
      {pixelCharacters.map((char, index) => {
        // Create multiple rings of characters
        const ringIndex = Math.floor(index / 8);
        const posInRing = index % 8;
        const angle = (posInRing / 8) * 2 * Math.PI + (ringIndex * 0.5); // Offset each ring
        const radius = 30 + (ringIndex * 15); // Different radius for each ring
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const size = 20 + Math.random() * 12; // Random sizes between 20-32px
        
        return (
          <FloatingCharacter
            key={index}
            emoji={char}
            delay={index * 0.08}
            x={Math.max(5, Math.min(95, x))} // Keep within bounds
            y={Math.max(5, Math.min(95, y))} // Keep within bounds
            size={size}
          />
        );
      })}

      {/* Central panda mascot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`text-center ${animationPhase >= 2 ? 'animate-bounce-in' : 'opacity-0 scale-0'}`}
          style={{ animationDelay: '1s' }}
        >
          {/* Panda mascot */}
          <div className="relative mb-8">
            <div 
              className="text-8xl sm:text-9xl"
              style={{
                filter: 'drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.8))',
                animation: 'pixelFloat 2s ease-in-out infinite'
              }}
            >
              🐼
            </div>
          </div>

          {/* Game title */}
          <div className={`mb-8 ${showContent ? 'animate-slide-up' : 'opacity-0'}`}>
            <h1 className="pixel-title text-4xl sm:text-6xl lg:text-7xl mb-4 text-white font-bold">
              ANIME PIXEL QUEST
            </h1>
            <div className="text-3xl sm:text-4xl mb-4 animate-bounce">🎌⚡🌟</div>
            <p className="pixel-subtitle text-lg sm:text-xl text-cyan-300 px-4">
              EPIC ANIME ADVENTURES AWAIT!
            </p>
          </div>

          {/* Welcome message */}
          {username && username !== 'anonymous' && showContent && (
            <div className="mb-6 animate-fade-in" style={{ animationDelay: '2s' }}>
              <p className="pixel-text text-cyan-400 text-sm sm:text-base">
                WELCOME BACK, <span className="text-yellow-400 font-bold">{username.toUpperCase()}</span>! 👋
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {showContent && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '2.5s' }}>
            <button
              onClick={onDailyPack}
              className="w-full pixel-button-3d text-sm sm:text-lg py-3 sm:py-4 px-6 transform hover:scale-105 transition-all duration-200"
              style={{ 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                boxShadow: '0 8px 0 #6d28d9, 0 12px 20px rgba(139, 92, 246, 0.4)',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              ⚡ DAILY CHALLENGE ⚡
            </button>
            
            <button
              onClick={onPlay}
              className="w-full pixel-button-3d text-sm sm:text-lg py-3 sm:py-4 px-6 transform hover:scale-105 transition-all duration-200"
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                boxShadow: '0 8px 0 #0369a1, 0 12px 20px rgba(6, 182, 212, 0.4)',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              🔥 START ADVENTURE 🔥
            </button>
            
            <button
              onClick={onShowLeaderboard}
              className="w-full pixel-button-3d text-sm sm:text-lg py-3 sm:py-4 px-6 transform hover:scale-105 transition-all duration-200"
              style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                boxShadow: '0 8px 0 #d97706, 0 12px 20px rgba(245, 158, 11, 0.4)',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              🏆 LEADERBOARD 🏆
            </button>
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style jsx>{`
        @keyframes floatIn {
          0% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes pixelFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .pixel-title {
          font-family: 'Press Start 2P', monospace;
          text-shadow: 
            2px 2px 0px #000000,
            -1px -1px 0px #000000,
            1px -1px 0px #000000,
            -1px 1px 0px #000000,
            1px 1px 0px #000000;
          letter-spacing: 2px;
          -webkit-font-smoothing: none;
          font-smooth: never;
        }

        .pixel-subtitle {
          font-family: 'Press Start 2P', monospace;
          text-shadow: 
            1px 1px 0px #000000,
            -1px -1px 0px #000000,
            1px -1px 0px #000000,
            -1px 1px 0px #000000;
          letter-spacing: 1px;
          -webkit-font-smoothing: none;
          font-smooth: never;
        }

        .pixel-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          text-shadow: 
            1px 1px 0px #000000,
            -1px -1px 0px #000000,
            1px -1px 0px #000000,
            -1px 1px 0px #000000;
          -webkit-font-smoothing: none;
          font-smooth: never;
        }

        .pixel-button-3d {
          font-family: 'Press Start 2P', monospace;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          position: relative;
          transition: all 0.1s ease;
          text-shadow: 
            1px 1px 0px rgba(0, 0, 0, 0.8),
            -1px -1px 0px rgba(0, 0, 0, 0.8),
            1px -1px 0px rgba(0, 0, 0, 0.8),
            -1px 1px 0px rgba(0, 0, 0, 0.8);
          -webkit-font-smoothing: none;
          font-smooth: never;
        }

        .pixel-button-3d:hover {
          transform: translateY(-2px) scale(1.05);
        }

        .pixel-button-3d:active {
          transform: translateY(4px) scale(1.02);
          box-shadow: 0 4px 0 currentColor, 0 6px 10px rgba(0, 0, 0, 0.3) !important;
        }

        .animate-float-in {
          animation: floatIn 0.8s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .pixel-character {
          user-select: none;
          pointer-events: none;
        }

        /* Ensure crisp pixel rendering */
        * {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        .pixel-splash-bg {
          image-rendering: auto; /* Allow smooth gradients for background */
        }

        @media (max-width: 640px) {
          .pixel-title {
            font-size: 1.5rem;
            letter-spacing: 1px;
          }
          
          .pixel-subtitle {
            font-size: 0.9rem;
          }
          
          .pixel-text {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};
