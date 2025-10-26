import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  type: 'sakura' | 'star' | 'sparkle';
}

interface AnimeBackgroundProps {
  theme?: 'default' | 'naruto' | 'onepiece' | 'jjk' | 'demonslayer';
  children: React.ReactNode;
}

export const AnimeBackground: React.FC<AnimeBackgroundProps> = ({ 
  theme = 'default', 
  children 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        type: ['sakura', 'star', 'sparkle'][Math.floor(Math.random() * 3)] as 'sakura' | 'star' | 'sparkle'
      });
    }
    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: (particle.y + particle.speed * 0.1) % 110,
        x: particle.x + Math.sin(particle.y * 0.01) * 0.1
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getThemeGradient = () => {
    switch (theme) {
      case 'naruto':
        return 'from-orange-400 via-red-500 to-yellow-500';
      case 'onepiece':
        return 'from-blue-500 via-cyan-400 to-teal-500';
      case 'jjk':
        return 'from-purple-600 via-pink-500 to-red-500';
      case 'demonslayer':
        return 'from-red-600 via-pink-500 to-purple-600';
      default:
        return 'from-indigo-600 via-purple-600 to-pink-600';
    }
  };

  const getParticleEmoji = (type: string) => {
    switch (type) {
      case 'sakura': return '🌸';
      case 'star': return '⭐';
      case 'sparkle': return '✨';
      default: return '✨';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeGradient()} relative overflow-hidden`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-pulse">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-lg animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              fontSize: `${particle.size * 0.8}rem`,
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${3 + particle.speed}s`
            }}
          >
            {getParticleEmoji(particle.type)}
          </div>
        ))}
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Anime-style corner decorations */}
      <div className="absolute top-4 left-4 text-4xl opacity-30 animate-float">
        🎌
      </div>
      <div className="absolute top-4 right-4 text-4xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>
        ⚡
      </div>
      <div className="absolute bottom-4 left-4 text-4xl opacity-30 animate-float" style={{ animationDelay: '2s' }}>
        🌟
      </div>
      <div className="absolute bottom-4 right-4 text-4xl opacity-30 animate-float" style={{ animationDelay: '3s' }}>
        🔥
      </div>
    </div>
  );
};
