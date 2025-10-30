import { AnimeGuessQuiz } from '../../shared/types/animeGuess';

// Anime Guess Quiz Database
// Character images would typically be hosted on a CDN or image service
// For now, we'll use placeholder URLs that can be replaced with actual character images

const getCharacterImageUrl = (characterName: string): string => {
  // Generate consistent placeholder based on character name
  const placeholders = [
    'https://via.placeholder.com/256x256/1a1a2e/16213e?text=Character+1',
    'https://via.placeholder.com/256x256/16213e/1a1a2e?text=Character+2', 
    'https://via.placeholder.com/256x256/0f3460/16213e?text=Character+3',
    'https://via.placeholder.com/256x256/533483/16213e?text=Character+4',
    'https://via.placeholder.com/256x256/7209b7/533483?text=Character+5',
  ];
  
  const hash = characterName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return placeholders[Math.abs(hash) % placeholders.length] || placeholders[0];
};

export const ANIME_GUESS_QUIZZES: AnimeGuessQuiz[] = [
  // EASY LEVEL - Popular characters from mainstream anime
  {
    id: 'guess-easy-001',
    character: 'Naruto Uzumaki',
    correctAnime: 'Naruto',
    characterImage: getCharacterImageUrl('Naruto Uzumaki'),
    characterDescription: 'Orange jumpsuit wearing ninja with whisker marks and blonde spiky hair',
    difficulty: 'easy',
    options: ['Naruto', 'One Piece', 'Dragon Ball Z', 'Bleach'],
    hints: {
      character: 'Dreams of becoming Hokage and loves ramen',
      context: 'Hidden Leaf Village ninja with Nine-Tails fox spirit',
      emoji: '🍃🍜'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'guess-easy-002',
    character: 'Monkey D. Luffy',
    correctAnime: 'One Piece',
    characterImage: getCharacterImageUrl('Monkey D. Luffy'),
    characterDescription: 'Straw hat wearing pirate captain with rubber powers',
    difficulty: 'easy',
    options: ['One Piece', 'Naruto', 'Fairy Tail', 'Black Clover'],
    hints: {
      character: 'Captain of the Straw Hat Pirates who wants to be Pirate King',
      context: 'Ate the Gum-Gum Devil Fruit and has rubber body',
      emoji: '🏴‍☠️👑'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'guess-easy-003',
    character: 'Izuku Midoriya',
    correctAnime: 'My Hero Academia',
    characterImage: getCharacterImageUrl('Izuku Midoriya'),
    characterDescription: 'Green-haired boy with freckles in a hero costume',
    difficulty: 'easy',
    options: ['My Hero Academia', 'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen'],
    hints: {
      character: 'Quirkless boy who inherited One For All power',
      context: 'Student at U.A. High School training to be a hero',
      emoji: '💚⚡'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'guess-easy-004',
    character: 'Tanjiro Kamado',
    correctAnime: 'Demon Slayer',
    characterImage: getCharacterImageUrl('Tanjiro Kamado'),
    characterDescription: 'Boy with checkered haori and hanafuda earrings carrying a sword',
    difficulty: 'easy',
    options: ['Demon Slayer', 'Bleach', 'Rurouni Kenshin', 'Samurai Champloo'],
    hints: {
      character: 'Kind-hearted demon slayer trying to cure his sister',
      context: 'Uses Water Breathing sword techniques',
      emoji: '🗡️💧'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'guess-easy-005',
    character: 'Eren Yeager',
    correctAnime: 'Attack on Titan',
    characterImage: getCharacterImageUrl('Eren Yeager'),
    characterDescription: 'Brown-haired boy with intense green eyes and Survey Corps uniform',
    difficulty: 'easy',
    options: ['Attack on Titan', 'Tokyo Ghoul', 'Parasyte', 'Kabaneri'],
    hints: {
      character: 'Determined to eliminate all titans and see the ocean',
      context: 'Member of Survey Corps with titan-shifting ability',
      emoji: '⚔️🌊'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },

  // MEDIUM LEVEL - Recognizable characters but more options
  {
    id: 'guess-medium-001',
    character: 'Roronoa Zoro',
    correctAnime: 'One Piece',
    characterImage: getCharacterImageUrl('Roronoa Zoro'),
    characterDescription: 'Green-haired swordsman with three swords and a scar over his eye',
    difficulty: 'medium',
    options: ['One Piece', 'Bleach', 'Rurouni Kenshin', 'Samurai Champloo', 'Gintama', 'Demon Slayer'],
    hints: {
      character: 'Three-sword style fighter and first mate of Straw Hat Pirates',
      context: 'Dreams of becoming the world\'s greatest swordsman',
      emoji: '⚔️💚'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'guess-medium-002',
    character: 'Levi Ackerman',
    correctAnime: 'Attack on Titan',
    characterImage: getCharacterImageUrl('Levi Ackerman'),
    characterDescription: 'Short black-haired man in Survey Corps uniform with intense expression',
    difficulty: 'medium',
    options: ['Attack on Titan', 'Tokyo Ghoul', 'Black Butler', 'Psycho-Pass', 'Parasyte', 'Death Note'],
    hints: {
      character: 'Humanity\'s strongest soldier and captain of Special Operations Squad',
      context: 'Known for his exceptional combat skills and cleanliness obsession',
      emoji: '⚔️🧹'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'guess-medium-003',
    character: 'Satoru Gojo',
    correctAnime: 'Jujutsu Kaisen',
    characterImage: getCharacterImageUrl('Satoru Gojo'),
    characterDescription: 'White-haired man with blindfold or sunglasses and confident smile',
    difficulty: 'medium',
    options: ['Jujutsu Kaisen', 'Tokyo Ghoul', 'Bleach', 'Blue Exorcist', 'Mob Psycho 100', 'Chainsaw Man'],
    hints: {
      character: 'Strongest jujutsu sorcerer and teacher at Tokyo Jujutsu High',
      context: 'Possesses the Six Eyes and Limitless cursed technique',
      emoji: '👁️⚡'
    },
    source: 'https://anilist.co/anime/113415/Jujutsu-Kaisen'
  },
  {
    id: 'guess-medium-004',
    character: 'Edward Elric',
    correctAnime: 'Fullmetal Alchemist',
    characterImage: getCharacterImageUrl('Edward Elric'),
    characterDescription: 'Short blonde boy with red coat and automail arm',
    difficulty: 'medium',
    options: ['Fullmetal Alchemist', 'Soul Eater', 'Blue Exorcist', 'Magi', 'Fairy Tail', 'Black Clover'],
    hints: {
      character: 'State Alchemist known as the Fullmetal Alchemist',
      context: 'Searching for Philosopher\'s Stone with his brother Alphonse',
      emoji: '⚗️🔬'
    },
    source: 'https://anilist.co/anime/121/Fullmetal-Alchemist'
  },
  {
    id: 'guess-medium-005',
    character: 'Nezuko Kamado',
    correctAnime: 'Demon Slayer',
    characterImage: getCharacterImageUrl('Nezuko Kamado'),
    characterDescription: 'Girl with bamboo muzzle, pink kimono, and orange hair',
    difficulty: 'medium',
    options: ['Demon Slayer', 'Inuyasha', 'Bleach', 'Blue Exorcist', 'Tokyo Ghoul', 'Seraph of the End'],
    hints: {
      character: 'Demon girl who retained her humanity and protects humans',
      context: 'Tanjiro\'s sister who was turned into a demon',
      emoji: '👹🎋'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },

  // HARD LEVEL - Less obvious characters or similar-looking options
  {
    id: 'guess-hard-001',
    character: 'Senku Ishigami',
    correctAnime: 'Dr. Stone',
    characterImage: getCharacterImageUrl('Senku Ishigami'),
    characterDescription: 'White-haired scientist with confident expression and lab coat',
    difficulty: 'hard',
    options: ['Dr. Stone', 'Steins;Gate', 'Cells at Work', 'Food Wars', 'Promised Neverland', 'Assassination Classroom', 'Death Note', 'Code Geass'],
    hints: {
      character: 'Genius scientist trying to rebuild civilization with science',
      context: 'Revived from stone petrification in a post-apocalyptic world',
      emoji: '🧪⚗️'
    },
    source: 'https://anilist.co/anime/105333/Dr-Stone'
  },
  {
    id: 'guess-hard-002',
    character: 'Rimuru Tempest',
    correctAnime: 'That Time I Got Reincarnated as a Slime',
    characterImage: getCharacterImageUrl('Rimuru Tempest'),
    characterDescription: 'Blue-haired androgynous character with golden eyes',
    difficulty: 'hard',
    options: ['That Time I Got Reincarnated as a Slime', 'Re:Zero', 'Overlord', 'Konosuba', 'Shield Hero', 'Log Horizon', 'Sword Art Online', 'No Game No Life'],
    hints: {
      character: 'Former human reincarnated as a slime who becomes a demon lord',
      context: 'Rules the Jura Tempest Federation and can mimic other forms',
      emoji: '💧👑'
    },
    source: 'https://anilist.co/anime/101280/That-Time-I-Got-Reincarnated-as-a-Slime'
  },
  {
    id: 'guess-hard-003',
    character: 'Ainz Ooal Gown',
    correctAnime: 'Overlord',
    characterImage: getCharacterImageUrl('Ainz Ooal Gown'),
    characterDescription: 'Skeletal figure in elaborate dark robes with glowing red eyes',
    difficulty: 'hard',
    options: ['Overlord', 'Skeleton Knight', 'Goblin Slayer', 'Re:Zero', 'Konosuba', 'Log Horizon', 'Sword Art Online', 'Shield Hero'],
    hints: {
      character: 'Undead sorcerer king trapped in a virtual world as his character',
      context: 'Former salary worker now ruling the Great Tomb of Nazarick',
      emoji: '💀👑'
    },
    source: 'https://anilist.co/anime/20832/Overlord'
  },
  {
    id: 'guess-hard-004',
    character: 'Violet Evergarden',
    correctAnime: 'Violet Evergarden',
    characterImage: getCharacterImageUrl('Violet Evergarden'),
    characterDescription: 'Blonde girl with blue eyes, white dress, and mechanical hands',
    difficulty: 'hard',
    options: ['Violet Evergarden', 'Your Name', 'A Silent Voice', 'Weathering With You', 'Garden of Words', 'Spirited Away', 'Princess Mononoke', 'Howl\'s Moving Castle'],
    hints: {
      character: 'Former child soldier learning to understand emotions and love',
      context: 'Works as an Auto Memory Doll writing letters for others',
      emoji: '💌✍️'
    },
    source: 'https://anilist.co/anime/21827/Violet-Evergarden'
  },
  {
    id: 'guess-hard-005',
    character: 'Makima',
    correctAnime: 'Chainsaw Man',
    characterImage: getCharacterImageUrl('Makima'),
    characterDescription: 'Red-haired woman in business suit with yellow ringed eyes',
    difficulty: 'hard',
    options: ['Chainsaw Man', 'Jujutsu Kaisen', 'Tokyo Ghoul', 'Parasyte', 'Hell\'s Paradise', 'Fire Force', 'Demon Slayer', 'Bleach'],
    hints: {
      character: 'Control Devil working for Public Safety Devil Hunters',
      context: 'Manipulative superior with mysterious agenda involving Chainsaw Man',
      emoji: '🔗👁️'
    },
    source: 'https://anilist.co/anime/127230/Chainsaw-Man'
  }
];

// Helper functions
export function getAnimeGuessQuizzesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): AnimeGuessQuiz[] {
  return ANIME_GUESS_QUIZZES.filter(quiz => quiz.difficulty === difficulty);
}

export function getRandomAnimeGuessQuiz(difficulty?: 'easy' | 'medium' | 'hard'): AnimeGuessQuiz {
  const quizzes = difficulty 
    ? getAnimeGuessQuizzesByDifficulty(difficulty)
    : ANIME_GUESS_QUIZZES;
  
  const randomIndex = Math.floor(Math.random() * quizzes.length);
  return quizzes[randomIndex] || quizzes[0];
}

export function getAnimeGuessQuizById(id: string): AnimeGuessQuiz | null {
  return ANIME_GUESS_QUIZZES.find(quiz => quiz.id === id) || null;
}
