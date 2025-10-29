import { AnimePuzzle, CharacterQuiz, GamePuzzle, QuizType } from '../../shared/types/puzzle';

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

// Character guessing quizzes database
export const CHARACTER_QUIZZES: CharacterQuiz[] = [
  {
    id: 'char-naruto-001',
    anime: 'Naruto',
    character: 'Sasuke Uchiha',
    difficulty: 'medium',
    description: 'I am the last survivor of my clan, driven by revenge and the pursuit of power. My Sharingan eyes have witnessed unspeakable tragedy.',
    characterVoice: 'Hmph... you want to know about me?',
    hints: {
      hint1: 'I possess a powerful bloodline limit that allows me to copy jutsu',
      hint2: 'My older brother massacred our entire clan when I was just a child',
      hint3: 'I left Konoha to gain power from Orochimaru',
      finalHint: 'My name means "assistant" but I refuse to be anyone\'s shadow'
    },
    hintResponses: {
      hint1Response: 'The Sharingan... it\'s the pride of the Uchiha clan. With these eyes, I can see through any technique.',
      hint2Response: '*clenches fist* Itachi... that man took everything from me. My family, my childhood, my innocence.',
      hint3Response: 'Power... I needed power to kill that man. Orochimaru promised me strength, even if it meant abandoning everything.',
      finalHintResponse: 'Tch... you\'re persistent. Fine, I am Sasuke Uchiha, and I will restore my clan\'s honor!'
    },
    correctAnswer: 'Sasuke Uchiha',
    alternativeAnswers: ['Sasuke', 'Uchiha Sasuke'],
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'char-onepiece-001',
    anime: 'One Piece',
    character: 'Roronoa Zoro',
    difficulty: 'easy',
    description: 'I am a swordsman who dreams of becoming the world\'s greatest. I wield three swords and have a terrible sense of direction.',
    characterVoice: 'Oi, you got a problem with my swords?',
    hints: {
      hint1: 'I use a unique three-sword fighting style',
      hint2: 'I made a promise to a childhood friend who died',
      hint3: 'I get lost even when walking in a straight line',
      finalHint: 'I\'m the first mate of the Straw Hat Pirates'
    },
    hintResponses: {
      hint1Response: 'Santoryu... Three Sword Style. One in each hand, one in my mouth. That\'s my way of the sword.',
      hint2Response: '*touches sword* Kuina... I promised her I\'d become the world\'s greatest swordsman. I won\'t break that promise.',
      hint3Response: 'Shut up about my sense of direction! I don\'t get lost, the destination moves!',
      finalHintResponse: 'The name\'s Roronoa Zoro, future World\'s Greatest Swordsman and first mate of the future Pirate King!'
    },
    correctAnswer: 'Roronoa Zoro',
    alternativeAnswers: ['Zoro', 'Roronoa'],
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'char-deathnote-001',
    anime: 'Death Note',
    character: 'L',
    difficulty: 'hard',
    description: 'I am the world\'s greatest detective, known only by a single letter. I have unusual habits and an insatiable sweet tooth.',
    characterVoice: 'Interesting... you wish to test your deductive abilities against mine?',
    hints: {
      hint1: 'I sit in a peculiar crouched position and rarely wear shoes',
      hint2: 'I have solved every case I\'ve taken, with a 100% success rate',
      hint3: 'I believe Kira is among the Japanese police and students',
      finalHint: 'I am known worldwide by a single letter of the alphabet'
    },
    hintResponses: {
      hint1Response: 'This position increases my deductive reasoning by 40%. As for shoes... they\'re unnecessary when thinking.',
      hint2Response: 'Justice will prevail. I have never failed to solve a case, and Kira will not be my first failure.',
      hint3Response: 'The probability that Kira is a student is 7%... but Light Yagami is particularly interesting.',
      finalHintResponse: 'I am L. The world\'s greatest detective. And I will catch Kira, no matter what it takes.'
    },
    correctAnswer: 'L',
    alternativeAnswers: ['L Lawliet', 'Lawliet', 'Ryuzaki'],
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'char-mha-001',
    anime: 'My Hero Academia',
    character: 'Katsuki Bakugo',
    difficulty: 'easy',
    description: 'I have an explosive personality to match my explosive Quirk. I refuse to lose to anyone, especially that damn Deku!',
    characterVoice: 'HAH?! You wanna fight, extra?!',
    hints: {
      hint1: 'My Quirk allows me to create explosions from my palms',
      hint2: 'I\'ve known Deku since we were kids and used to bully him',
      hint3: 'I call most people "extras" because I think I\'m better than them',
      finalHint: 'My hero name is Great Explosion Murder God Dynamight'
    },
    hintResponses: {
      hint1Response: 'EXPLOSION! My sweat is like nitroglycerin, and I can detonate it at will! Pretty awesome, right?!',
      hint2Response: 'Tch... Deku was just a quirkless loser back then. How was I supposed to know he\'d get a Quirk?!',
      hint3Response: 'Because you ARE extras! I\'m gonna be the number one hero, so everyone else is just background characters!',
      finalHintResponse: 'I\'m Katsuki Bakugo! And I\'m gonna surpass All Might and become the greatest hero ever! GOT IT?!'
    },
    correctAnswer: 'Katsuki Bakugo',
    alternativeAnswers: ['Bakugo', 'Kacchan', 'Bakugou', 'Katsuki Bakugou'],
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'char-aot-001',
    anime: 'Attack on Titan',
    character: 'Levi Ackerman',
    difficulty: 'medium',
    description: 'I am humanity\'s strongest soldier, known for my exceptional combat skills and obsession with cleanliness.',
    characterVoice: 'Tch... you\'re wasting my time.',
    hints: {
      hint1: 'I\'m called "Humanity\'s Strongest Soldier"',
      hint2: 'I have an obsession with cleaning and keeping things tidy',
      hint3: 'I\'m the captain of the Special Operations Squad',
      finalHint: 'I\'m abnormally short but incredibly deadly with ODM gear'
    },
    hintResponses: {
      hint1Response: 'Strongest soldier? Tch, that\'s just a fact. I kill titans like they\'re oversized pests.',
      hint2Response: 'Filth is disgusting. A clean environment leads to clear thinking and efficient titan killing.',
      hint3Response: 'My squad follows my orders without question. That\'s how we stay alive in this hell.',
      finalHintResponse: 'I\'m Levi Ackerman. Height doesn\'t matter when you can slice titans to pieces.'
    },
    correctAnswer: 'Levi Ackerman',
    alternativeAnswers: ['Levi', 'Captain Levi', 'Ackerman'],
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'char-demonslayer-001',
    anime: 'Demon Slayer',
    character: 'Inosuke Hashibira',
    difficulty: 'easy',
    description: 'I was raised by boars in the mountains! I wear a boar head mask and believe I\'m the strongest fighter alive!',
    characterVoice: 'HAHAHA! I am the great Inosuke-sama!',
    hints: {
      hint1: 'I wear a boar head as a mask and have no shirt',
      hint2: 'I created my own breathing technique called Beast Breathing',
      hint3: 'I challenge everyone to fights and mispronounce names constantly',
      finalHint: 'I was literally raised by wild boars in the mountains'
    },
    hintResponses: {
      hint1Response: 'This boar head shows my strength! And shirts are for weaklings who can\'t handle the mountain cold!',
      hint2Response: 'Beast Breathing! I made it myself because I\'m a genius! No fancy training needed when you\'re naturally amazing!',
      hint3Response: 'Gonpachiro! Monitsu! I\'ll fight you all and prove I\'m the strongest! Bring it on!',
      finalHintResponse: 'I am the great Inosuke Hashibira! King of the mountains! Raised by boars and stronger than any human!'
    },
    correctAnswer: 'Inosuke Hashibira',
    alternativeAnswers: ['Inosuke', 'Hashibira'],
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  }
];

export function getRandomPuzzle(difficulty?: 'easy' | 'medium' | 'hard'): GamePuzzle {
  // Randomly choose between word puzzle and character quiz
  const quizType: QuizType = Math.random() < 0.5 ? 'word-puzzle' : 'character-guess';
  
  if (quizType === 'word-puzzle') {
    const filteredPuzzles = difficulty 
      ? ANIME_PUZZLES.filter(p => p.difficulty === difficulty)
      : ANIME_PUZZLES;
    
    if (filteredPuzzles.length === 0) {
      throw new Error('No puzzles found for the specified difficulty');
    }
    
    const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
    const puzzle = filteredPuzzles[randomIndex];
    
    if (!puzzle) {
      throw new Error('Failed to select a puzzle');
    }
    
    return {
      type: 'word-puzzle',
      wordPuzzle: {
        ...puzzle,
        tiles: shuffleArray(puzzle.tiles)
      }
    };
  } else {
    const filteredQuizzes = difficulty 
      ? CHARACTER_QUIZZES.filter(q => q.difficulty === difficulty)
      : CHARACTER_QUIZZES;
    
    if (filteredQuizzes.length === 0) {
      throw new Error('No character quizzes found for the specified difficulty');
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuizzes.length);
    const quiz = filteredQuizzes[randomIndex];
    
    if (!quiz) {
      throw new Error('Failed to select a character quiz');
    }
    
    return {
      type: 'character-guess',
      characterQuiz: quiz
    };
  }
}

export function getPuzzleById(id: string): GamePuzzle | null {
  const wordPuzzle = ANIME_PUZZLES.find(p => p.id === id);
  if (wordPuzzle) {
    return {
      type: 'word-puzzle',
      wordPuzzle
    };
  }
  
  const characterQuiz = CHARACTER_QUIZZES.find(q => q.id === id);
  if (characterQuiz) {
    return {
      type: 'character-guess',
      characterQuiz
    };
  }
  
  return null;
}

export function getCharacterQuizById(id: string): CharacterQuiz | null {
  return CHARACTER_QUIZZES.find(q => q.id === id) || null;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

export function validateSolution(puzzle: AnimePuzzle, solution: string[]): boolean {
  return JSON.stringify(solution) === JSON.stringify(puzzle.blanks);
}

export function validateCharacterGuess(quiz: CharacterQuiz, guess: string): boolean {
  const normalizedGuess = guess.toLowerCase().trim();
  const correctAnswer = quiz.correctAnswer.toLowerCase();
  const alternatives = quiz.alternativeAnswers.map(alt => alt.toLowerCase());
  
  return normalizedGuess === correctAnswer || alternatives.includes(normalizedGuess);
}
