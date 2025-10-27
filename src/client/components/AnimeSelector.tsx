import React from 'react';

interface AnimeSelectorProps {
  onSelectAnime: (anime: string) => void;
  onBack: () => void;
}

export const AnimeSelector: React.FC<AnimeSelectorProps> = ({
  onSelectAnime,
  onBack
}) => {
  const animeList = [
    {
      name: 'Naruto',
      description: 'Ninja adventures and friendship',
      color: 'var(--neon-orange)',
      emoji: '🍃',
      characters: ['Naruto', 'Sasuke', 'Sakura', 'Kakashi'],
      theme: 'ninja'
    },
    {
      name: 'One Piece',
      description: 'Pirate adventures on the Grand Line',
      color: 'var(--neon-cyan)',
      emoji: '🏴‍☠️',
      characters: ['Luffy', 'Zoro', 'Nami', 'Sanji'],
      theme: 'pirate'
    },
    {
      name: 'Attack on Titan',
      description: 'Humanity vs Titans epic battle',
      color: 'var(--neon-pink)',
      emoji: '⚔️',
      characters: ['Eren', 'Mikasa', 'Armin', 'Levi'],
      theme: 'dark'
    },
    {
      name: 'My Hero Academia',
      description: 'Superheroes in training',
      color: 'var(--neon-green)',
      emoji: '💪',
      characters: ['Deku', 'Bakugo', 'Todoroki', 'All Might'],
      theme: 'hero'
    },
    {
      name: 'Death Note',
      description: 'Psychological thriller with supernatural elements',
      color: 'var(--neon-purple)',
      emoji: '📓',
      characters: ['Light', 'L', 'Misa', 'Ryuk'],
      theme: 'dark'
    },
    {
      name: 'Demon Slayer',
      description: 'Demon hunting with breathing techniques',
      color: 'var(--neon-pink)',
      emoji: '🗡️',
      characters: ['Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke'],
      theme: 'traditional'
    },
    {
      name: 'Mixed',
      description: 'All anime series combined',
      color: 'var(--neon-yellow)',
      emoji: '🎲',
      characters: ['All Characters'],
      theme: 'mixed'
    }
  ];

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
      
      <div className="min-h-screen p-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Futuristic Header */}
          <div className="text-center mb-8">
            <h1 className="anime-title mb-4">CHOOSE YOUR ANIME UNIVERSE</h1>
            <p className="anime-text-neon">Select your favorite level for themed puzzles and quizzes</p>
          </div>

          {/* Futuristic Anime Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {animeList.map((anime, index) => (
              <div
                key={anime.name}
                onClick={() => onSelectAnime(anime.name)}
                className="anime-series-card cursor-pointer group animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Anime Header */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3 animate-float group-hover:animate-bounce" 
                       style={{ animationDelay: `${index * 0.2}s` }}>
                    {anime.emoji}
                  </div>
                  <h3 className="anime-text-pixel text-xl text-white mb-2">{anime.name.toUpperCase()}</h3>
                  <p className="anime-text-pixel text-xs text-gray-300">{anime.description}</p>
                </div>

                {/* Theme Preview */}
                <div 
                  className="pixel-button w-full mb-4 text-center group-hover:animate-pixel-pulse"
                  style={{ 
                    background: `linear-gradient(135deg, ${anime.color} 0%, ${anime.color}aa 100%)`,
                    color: '#000',
                    fontWeight: 'bold'
                  }}
                >
                  {anime.name.toUpperCase()} MODE
                </div>

                {/* Characters Preview */}
                <div className="space-y-2">
                  <h4 className="anime-text-pixel text-xs text-cyan-400">FEATURED CHARACTERS:</h4>
                  <div className="flex flex-wrap gap-1">
                    {anime.characters.slice(0, 4).map((character, charIndex) => (
                      <span
                        key={charIndex}
                        className="bg-cyan-400/20 text-cyan-300 anime-text-pixel text-xs px-2 py-1 rounded border border-cyan-400/30"
                      >
                        {character.toUpperCase()}
                      </span>
                    ))}
                    {anime.characters.length > 4 && (
                      <span className="bg-purple-400/20 text-purple-300 anime-text-pixel text-xs px-2 py-1 rounded border border-purple-400/30">
                        +{anime.characters.length - 4} MORE
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="anime-text-pixel text-xs text-yellow-400">CLICK TO SELECT →</span>
                </div>
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
