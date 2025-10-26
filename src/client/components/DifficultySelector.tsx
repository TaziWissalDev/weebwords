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
      color: 'from-green-400 to-green-600',
      emoji: '🌱',
      features: ['Simple quotes', 'Popular characters', 'More hints available']
    },
    {
      level: 'medium' as const,
      title: 'Medium',
      description: 'Balanced challenge',
      color: 'from-yellow-400 to-orange-500',
      emoji: '⚡',
      features: ['Moderate difficulty', 'Mixed anime series', 'Standard scoring']
    },
    {
      level: 'hard' as const,
      title: 'Hard',
      description: 'For true anime experts',
      color: 'from-red-400 to-red-600',
      emoji: '🔥',
      features: ['Complex quotes', 'Obscure characters', 'Higher rewards']
    },
    {
      level: 'mixed' as const,
      title: 'Mixed',
      description: 'Random difficulty',
      color: 'from-purple-400 to-pink-500',
      emoji: '🎲',
      features: ['All difficulties', 'Surprise challenges', 'Maximum variety']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Choose Your Challenge</h1>
          <p className="text-xl opacity-90">Select the difficulty level that suits you best</p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {difficulties.map((diff) => (
            <div
              key={diff.level}
              onClick={() => onSelectDifficulty(diff.level)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-200 hover:bg-white/20 border border-white/20"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{diff.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{diff.title}</h3>
                <p className="text-white/80">{diff.description}</p>
              </div>

              <div className={`bg-gradient-to-r ${diff.color} rounded-lg p-4 mb-4`}>
                <div className="text-white font-semibold text-center">
                  {diff.level === 'mixed' ? 'All Levels' : diff.title} Mode
                </div>
              </div>

              <ul className="space-y-2">
                {diff.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
