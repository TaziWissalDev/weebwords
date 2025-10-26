import { AnimePuzzle } from '../../shared/types/puzzle';

// Pre-generated anime puzzles database
export const ANIME_PUZZLES: AnimePuzzle[] = [
  {
    id: 'naruto-001',
    anime: 'Naruto',
    character: 'Rock Lee',
    difficulty: 'easy',
    quote_original: 'A dropout will beat a genius through hard work.',
    quote_puzzle: 'A ____ will beat a ____ through hard work.',
    blanks: ['dropout', 'genius'],
    tiles: ['dropout', 'genius', 'dream', 'team', 'power', 'faith', 'effort', 'hope'],
    distractors: ['effort', 'hope', 'faith', 'team'],
    hints: {
      character: 'Green jumpsuit and endless push-ups',
      context: 'Training vs Neji arc',
      emoji: '💪🍃'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'onepiece-001',
    anime: 'One Piece',
    character: 'Monkey D. Luffy',
    difficulty: 'easy',
    quote_original: 'I will become the Pirate King!',
    quote_puzzle: 'I will become the ____ ____!',
    blanks: ['Pirate', 'King'],
    tiles: ['Pirate', 'King', 'Marine', 'Admiral', 'Captain', 'Hero', 'Legend', 'Emperor'],
    distractors: ['Marine', 'Admiral', 'Captain', 'Hero'],
    hints: {
      character: 'Straw hat wearing rubber boy',
      context: 'His lifelong dream declaration',
      emoji: '👑🏴‍☠️'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'deathnote-001',
    anime: 'Death Note',
    character: 'Light Yagami',
    difficulty: 'medium',
    quote_original: 'I am justice! I protect the innocent.',
    quote_puzzle: 'I am ____! I protect the ____.',
    blanks: ['justice', 'innocent'],
    tiles: ['justice', 'innocent', 'guilty', 'evil', 'truth', 'peace', 'order', 'chaos'],
    distractors: ['guilty', 'evil', 'truth', 'peace'],
    hints: {
      character: 'Genius student with a god complex',
      context: 'Kira\'s twisted philosophy',
      emoji: '⚖️📓'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'aot-001',
    anime: 'Attack on Titan',
    character: 'Eren Yeager',
    difficulty: 'medium',
    quote_original: 'If you win, you live. If you lose, you die.',
    quote_puzzle: 'If you ____, you live. If you ____, you die.',
    blanks: ['win', 'lose'],
    tiles: ['win', 'lose', 'fight', 'run', 'hide', 'attack', 'defend', 'survive'],
    distractors: ['fight', 'run', 'hide', 'attack'],
    hints: {
      character: 'Hot-headed Survey Corps member',
      context: 'Brutal reality of their world',
      emoji: '⚔️🏃'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'demonslayer-001',
    anime: 'Demon Slayer',
    character: 'Tanjiro Kamado',
    difficulty: 'easy',
    quote_original: 'I will not let anyone else die!',
    quote_puzzle: 'I will not let ____ else ____!',
    blanks: ['anyone', 'die'],
    tiles: ['anyone', 'die', 'someone', 'live', 'nobody', 'suffer', 'everyone', 'fight'],
    distractors: ['someone', 'live', 'nobody', 'suffer'],
    hints: {
      character: 'Kind-hearted demon slayer with checkered haori',
      context: 'His protective vow',
      emoji: '🗡️❤️'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'mha-001',
    anime: 'My Hero Academia',
    character: 'All Might',
    difficulty: 'easy',
    quote_original: 'A real hero always finds a way for justice to be served.',
    quote_puzzle: 'A real ____ always finds a way for ____ to be served.',
    blanks: ['hero', 'justice'],
    tiles: ['hero', 'justice', 'villain', 'peace', 'student', 'truth', 'power', 'hope'],
    distractors: ['villain', 'peace', 'student', 'truth'],
    hints: {
      character: 'Symbol of Peace in muscular form',
      context: 'Teaching Deku about heroism',
      emoji: '💪✨'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'jjk-001',
    anime: 'Jujutsu Kaisen',
    character: 'Yuji Itadori',
    difficulty: 'medium',
    quote_original: 'I want to save people unequally.',
    quote_puzzle: 'I want to ____ people ____.',
    blanks: ['save', 'unequally'],
    tiles: ['save', 'unequally', 'help', 'equally', 'protect', 'fairly', 'rescue', 'justly'],
    distractors: ['help', 'equally', 'protect', 'fairly'],
    hints: {
      character: 'Pink-haired vessel of Sukuna',
      context: 'His unique moral philosophy',
      emoji: '👊💗'
    },
    source: 'https://anilist.co/anime/113415/Jujutsu-Kaisen'
  },
  {
    id: 'spyfamily-001',
    anime: 'Spy x Family',
    character: 'Anya Forger',
    difficulty: 'easy',
    quote_original: 'Anya wants peanuts!',
    quote_puzzle: '____ wants ____!',
    blanks: ['Anya', 'peanuts'],
    tiles: ['Anya', 'peanuts', 'Papa', 'cookies', 'Mama', 'candy', 'Bond', 'snacks'],
    distractors: ['Papa', 'cookies', 'Mama', 'candy'],
    hints: {
      character: 'Pink-haired telepath with star hair clips',
      context: 'Her favorite snack obsession',
      emoji: '🥜⭐'
    },
    source: 'https://anilist.co/anime/140960/Spy-x-Family'
  },
  {
    id: 'bleach-001',
    anime: 'Bleach',
    character: 'Ichigo Kurosaki',
    difficulty: 'medium',
    quote_original: 'I will protect everyone, no matter what!',
    quote_puzzle: 'I will ____ everyone, no matter ____!',
    blanks: ['protect', 'what'],
    tiles: ['protect', 'what', 'save', 'when', 'help', 'where', 'defend', 'how'],
    distractors: ['save', 'when', 'help', 'where'],
    hints: {
      character: 'Orange-haired substitute Soul Reaper',
      context: 'His unwavering determination',
      emoji: '🗡️🧡'
    },
    source: 'https://anilist.co/anime/269/Bleach'
  },
  {
    id: 'dragonball-001',
    anime: 'Dragon Ball Z',
    character: 'Goku',
    difficulty: 'easy',
    quote_original: 'I will never give up!',
    quote_puzzle: 'I will never ____ ____!',
    blanks: ['give', 'up'],
    tiles: ['give', 'up', 'back', 'down', 'stop', 'quit', 'lose', 'fail'],
    distractors: ['back', 'down', 'stop', 'quit'],
    hints: {
      character: 'Spiky-haired Saiyan warrior',
      context: 'His never-ending fighting spirit',
      emoji: '💪⚡'
    },
    source: 'https://anilist.co/anime/813/Dragon-Ball-Z'
  }
];

export function getRandomPuzzle(difficulty?: 'easy' | 'medium' | 'hard'): AnimePuzzle {
  const filteredPuzzles = difficulty 
    ? ANIME_PUZZLES.filter(p => p.difficulty === difficulty)
    : ANIME_PUZZLES;
  
  const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
  return filteredPuzzles[randomIndex];
}

export function getPuzzleById(id: string): AnimePuzzle | null {
  return ANIME_PUZZLES.find(p => p.id === id) || null;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function validateSolution(puzzle: AnimePuzzle, solution: string[]): boolean {
  return JSON.stringify(solution) === JSON.stringify(puzzle.blanks);
}
