import React from 'react';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'mixed') => void;
  onBack: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  onSelectDifficulty,
  onBack
}) => {
  const difficulties = [
    {
      level: 'easy' as const,
      title: 'Easy',
      description: 'Perfect for beginners',
      color: 'var(--neon-green)',
      emoji: '🌱',
      features: ['Simple quotes', 'Popular characters', 'More hints available']
    },
    {
      level: 'medium' as const,
      title: 'Medium',
      description: 'Balanced challenge',
      color: 'var(--neon-yellow)',
      emoji: '⚡',
      features: ['Moderate difficulty', 'Mixed anime series', 'Standard scoring']
    },
    {
      level: 'hard' as const,
      title: 'Hard',
      description: 'For true anime experts',
      color: 'var(--neon-orange)',
      emoji: '🔥',
      features: ['Complex quotes', 'Obscure characters', 'Higher rewards']
    },
    {
      level: 'mixed' as const,
      title: 'Mixed',
      description: 'Random difficulty',
      color: 'var(--neon-purple)',
      emoji: '🎲',
      features: ['All difficulties', 'Surprise challenges', 'Maximum variety']
    }
  ];

  return (
    <div className="cyberpunk-bg min-h-screen relative overflow-hidden">
      <div className="cyber-grid"></div>
      <div className="scan-lines"></div>
      <div className="anime-particles">
        {Array.from({ length: 25 }).map((_, i) => (
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
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Futuristic Header */}
          <div className="text-center mb-8">
            <h1 className="anime-title mb-4">CHOOSE YOUR CHALLENGE</h1>
            <p className="anime-text-neon">Select the difficulty level that suits you best.</p>
          </div>

          {/* Futuristic Difficulty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {difficulties.map((diff, index) => (
              <div
                key={diff.level}
                onClick={() => onSelectDifficulty(diff.level)}
                className="anime-series-card cursor-pointer animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    {diff.emoji}
                  </div>
                  <h3 className="anime-text-pixel text-2xl text-white mb-2">{diff.title.toUpperCase()}</h3>
                  <p className="anime-text-pixel text-sm text-gray-300">{diff.description}</p>
                </div>

                <div 
                  className="pixel-button w-full mb-4 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${diff.color} 0%, ${diff.color}aa 100%)`,
                    color: '#000',
                    fontWeight: 'bold'
                  }}
                >
                  {diff.level === 'mixed' ? 'ALL LEVELS' : diff.title.toUpperCase()} MODE
                </div>

                <ul className="space-y-2">
                  {diff.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center anime-text-pixel text-xs text-cyan-300">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Futuristic Back Button */}
          <div className="text-center">
            <button
              onClick={onBack}
              className="neon-button"
            >
              ← BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
