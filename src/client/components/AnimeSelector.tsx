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
      color: 'from-orange-400 to-red-500',
      emoji: '🍃',
      characters: ['Naruto', 'Sasuke', 'Sakura', 'Kakashi'],
      theme: 'ninja'
    },
    {
      name: 'One Piece',
      description: 'Pirate adventures on the Grand Line',
      color: 'from-blue-400 to-cyan-500',
      emoji: '🏴‍☠️',
      characters: ['Luffy', 'Zoro', 'Nami', 'Sanji'],
      theme: 'pirate'
    },
    {
      name: 'Attack on Titan',
      description: 'Humanity vs Titans epic battle',
      color: 'from-gray-600 to-red-600',
      emoji: '⚔️',
      characters: ['Eren', 'Mikasa', 'Armin', 'Levi'],
      theme: 'dark'
    },
    {
      name: 'My Hero Academia',
      description: 'Superheroes in training',
      color: 'from-green-400 to-blue-500',
      emoji: '💪',
      characters: ['Deku', 'Bakugo', 'Todoroki', 'All Might'],
      theme: 'hero'
    },
    {
      name: 'Death Note',
      description: 'Psychological thriller with supernatural elements',
      color: 'from-black to-red-900',
      emoji: '📓',
      characters: ['Light', 'L', 'Misa', 'Ryuk'],
      theme: 'dark'
    },
    {
      name: 'Demon Slayer',
      description: 'Demon hunting with breathing techniques',
      color: 'from-purple-500 to-pink-500',
      emoji: '🗡️',
      characters: ['Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke'],
      theme: 'traditional'
    },
    {
      name: 'Mixed',
      description: 'All anime series combined',
      color: 'from-purple-400 to-pink-500',
      emoji: '🎲',
      characters: ['All Characters'],
      theme: 'mixed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Choose Your Anime Universe</h1>
          <p className="text-xl opacity-90">Select your favorite anime for themed puzzles and quizzes</p>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {animeList.map((anime) => (
            <div
              key={anime.name}
              onClick={() => onSelectAnime(anime.name)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-white/20 border border-white/20 group"
            >
              {/* Anime Header */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-3 group-hover:animate-bounce">{anime.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{anime.name}</h3>
                <p className="text-white/80 text-sm">{anime.description}</p>
              </div>

              {/* Theme Preview */}
              <div className={`bg-gradient-to-r ${anime.color} rounded-lg p-4 mb-4 transform group-hover:scale-105 transition-transform`}>
                <div className="text-white font-semibold text-center">
                  {anime.name} Theme
                </div>
              </div>

              {/* Characters Preview */}
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Featured Characters:</h4>
                <div className="flex flex-wrap gap-1">
                  {anime.characters.slice(0, 4).map((character, index) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {character}
                    </span>
                  ))}
                  {anime.characters.length > 4 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      +{anime.characters.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Click to select →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
          >
            ← Back to Difficulty
          </button>
        </div>
      </div>
    </div>
  );
};
