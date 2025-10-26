import { GamePuzzle, GameStats, AnimePuzzle, CharacterQuiz } from '../../shared/types/puzzle';
import { PuzzleTracker } from './puzzleTracker';

// Mock anime puzzles
const MOCK_ANIME_PUZZLES: AnimePuzzle[] = [
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
    difficulty: 'hard',
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
    id: 'demonslayer-002',
    anime: 'Demon Slayer',
    character: 'Inosuke Hashibira',
    difficulty: 'medium',
    quote_original: 'I am the king of the mountains!',
    quote_puzzle: 'I am the ____ of the ____!',
    blanks: ['king', 'mountains'],
    tiles: ['king', 'mountains', 'lord', 'forest', 'ruler', 'hills', 'master', 'valleys'],
    distractors: ['lord', 'forest', 'ruler', 'hills'],
    hints: {
      character: 'Boar-headed wild fighter',
      context: 'His proud declaration',
      emoji: '🐗⚔️'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'aot-001',
    anime: 'Attack on Titan',
    character: 'Eren Yeager',
    difficulty: 'easy',
    quote_original: 'I will destroy all titans!',
    quote_puzzle: 'I will ____ all ____!',
    blanks: ['destroy', 'titans'],
    tiles: ['destroy', 'titans', 'kill', 'humans', 'save', 'people', 'fight', 'enemies'],
    distractors: ['kill', 'humans', 'save', 'people'],
    hints: {
      character: 'Determined Survey Corps member',
      context: 'His vow against titans',
      emoji: '⚔️😤'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-002',
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
    id: 'aot-003',
    anime: 'Attack on Titan',
    character: 'Levi Ackerman',
    difficulty: 'hard',
    quote_original: 'The only thing we are allowed to do is believe.',
    quote_puzzle: 'The only thing we are allowed to do is ____.',
    blanks: ['believe'],
    tiles: ['believe', 'fight', 'hope', 'survive', 'trust', 'die', 'live', 'kill'],
    distractors: ['fight', 'hope', 'survive', 'trust', 'die', 'live'],
    hints: {
      character: 'Humanity\'s strongest soldier',
      context: 'His philosophy about their situation',
      emoji: '⚔️💪'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'mha-001',
    anime: 'My Hero Academia',
    character: 'Izuku Midoriya',
    difficulty: 'easy',
    quote_original: 'Sometimes I do feel like I am a failure.',
    quote_puzzle: 'Sometimes I do feel like I am a ____.',
    blanks: ['failure'],
    tiles: ['failure', 'hero', 'student', 'winner', 'loser', 'success', 'nobody', 'somebody'],
    distractors: ['hero', 'student', 'winner', 'loser', 'success', 'nobody'],
    hints: {
      character: 'Green-haired aspiring hero',
      context: 'His self-doubt moments',
      emoji: '💚😰'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-002',
    anime: 'My Hero Academia',
    character: 'Katsuki Bakugo',
    difficulty: 'medium',
    quote_original: 'I will win. That is what heroes do.',
    quote_puzzle: 'I will ____. That is what ____ do.',
    blanks: ['win', 'heroes'],
    tiles: ['win', 'heroes', 'lose', 'villains', 'fight', 'students', 'try', 'people'],
    distractors: ['lose', 'villains', 'fight', 'students'],
    hints: {
      character: 'Explosive blonde rival',
      context: 'His determination to be number one',
      emoji: '💥😤'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  }
];

// Mock character quizzes
const MOCK_CHARACTER_QUIZZES: CharacterQuiz[] = [
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
  },
  {
    id: 'char-aot-001',
    anime: 'Attack on Titan',
    character: 'Eren Yeager',
    difficulty: 'easy',
    description: 'I want to join the Survey Corps and see the world beyond the walls! I hate titans for what they did to my mother.',
    characterVoice: 'I will kill every single titan!',
    hints: {
      hint1: 'I lived in Shiganshina District before it fell',
      hint2: 'My mother was killed when the Colossal Titan broke the wall',
      hint3: 'I have the power to transform into a titan myself',
      finalHint: 'I am the main protagonist who wants to explore beyond the walls'
    },
    hintResponses: {
      hint1Response: 'Shiganshina... that was my home until those monsters destroyed everything!',
      hint2Response: 'My mother... I\'ll never forgive the titans for what they did to her!',
      hint3Response: 'This power... I can become what I hate most, but I\'ll use it to save humanity!',
      finalHintResponse: 'I\'m Eren Yeager! And I will see what\'s beyond those walls, no matter what!'
    },
    correctAnswer: 'Eren Yeager',
    alternativeAnswers: ['Eren', 'Yeager', 'Jaeger'],
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'char-aot-002',
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
  }
];

export class MockDataService {
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static getRandomPuzzle(difficulty?: 'easy' | 'medium' | 'hard', anime?: string): GamePuzzle {
    console.log('🎯 Generating puzzle for:', { difficulty, anime });
    
    // Randomly choose between word puzzle and character quiz
    const quizType = Math.random() < 0.5 ? 'word-puzzle' : 'character-guess';
    
    if (quizType === 'word-puzzle') {
      let filteredPuzzles = MOCK_ANIME_PUZZLES;
      
      // Filter by difficulty
      if (difficulty) {
        filteredPuzzles = filteredPuzzles.filter(p => p.difficulty === difficulty);
      }
      
      // Filter by anime (if not Mixed)
      if (anime && anime !== 'Mixed') {
        console.log('🔍 Filtering puzzles by anime:', anime);
        filteredPuzzles = filteredPuzzles.filter(p => p.anime === anime);
        console.log('📝 Found puzzles:', filteredPuzzles.map(p => `${p.anime} - ${p.character}`));
      }

      // Filter out recently used puzzles for variety
      const unusedPuzzles = PuzzleTracker.getUnusedPuzzles(filteredPuzzles);
      if (unusedPuzzles.length > 0) {
        filteredPuzzles = unusedPuzzles;
        console.log('🎲 Using unused puzzles:', filteredPuzzles.length);
      }
      
      // Smart fallback: try removing filters one by one
      if (filteredPuzzles.length === 0) {
        console.log('⚠️ No puzzles found with both filters, trying fallbacks...');
        
        // First fallback: try just anime filter (ignore difficulty)
        if (anime && anime !== 'Mixed') {
          filteredPuzzles = MOCK_ANIME_PUZZLES.filter(p => p.anime === anime);
          console.log('🔄 Fallback 1: Found puzzles for anime only:', filteredPuzzles.length);
        }
        
        // Second fallback: try just difficulty filter (ignore anime)
        if (filteredPuzzles.length === 0 && difficulty) {
          filteredPuzzles = MOCK_ANIME_PUZZLES.filter(p => p.difficulty === difficulty);
          console.log('🔄 Fallback 2: Found puzzles for difficulty only:', filteredPuzzles.length);
        }
        
        // Final fallback: all puzzles
        if (filteredPuzzles.length === 0) {
          console.log('🔄 Final fallback: Using all puzzles');
          filteredPuzzles = MOCK_ANIME_PUZZLES;
        }
      }
      
      const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
      const puzzle = filteredPuzzles[randomIndex];
      
      // Mark this puzzle as used
      PuzzleTracker.markPuzzleAsUsed(puzzle.id);
      
      console.log('✅ Selected puzzle:', `${puzzle.anime} - ${puzzle.character}: "${puzzle.quote_original}"`);
      console.log('📊 Used puzzles count:', PuzzleTracker.getUsedCount());
      
      return {
        type: 'word-puzzle',
        wordPuzzle: {
          ...puzzle,
          tiles: this.shuffleArray(puzzle.tiles)
        }
      };
    } else {
      let filteredQuizzes = MOCK_CHARACTER_QUIZZES;
      
      // Filter by difficulty
      if (difficulty) {
        filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === difficulty);
      }
      
      // Filter by anime (if not Mixed)
      if (anime && anime !== 'Mixed') {
        filteredQuizzes = filteredQuizzes.filter(q => q.anime === anime);
      }

      // Filter out recently used quizzes for variety
      const unusedQuizzes = PuzzleTracker.getUnusedPuzzles(filteredQuizzes);
      if (unusedQuizzes.length > 0) {
        filteredQuizzes = unusedQuizzes;
        console.log('🎲 Using unused character quizzes:', filteredQuizzes.length);
      }
      
      // Smart fallback for character quizzes
      if (filteredQuizzes.length === 0) {
        console.log('⚠️ No character quizzes found with both filters, trying fallbacks...');
        
        // First fallback: try just anime filter (ignore difficulty)
        if (anime && anime !== 'Mixed') {
          filteredQuizzes = MOCK_CHARACTER_QUIZZES.filter(q => q.anime === anime);
          console.log('🔄 Fallback 1: Found character quizzes for anime only:', filteredQuizzes.length);
        }
        
        // Second fallback: try just difficulty filter (ignore anime)
        if (filteredQuizzes.length === 0 && difficulty) {
          filteredQuizzes = MOCK_CHARACTER_QUIZZES.filter(q => q.difficulty === difficulty);
          console.log('🔄 Fallback 2: Found character quizzes for difficulty only:', filteredQuizzes.length);
        }
        
        // Final fallback: all character quizzes
        if (filteredQuizzes.length === 0) {
          console.log('🔄 Final fallback: Using all character quizzes');
          filteredQuizzes = MOCK_CHARACTER_QUIZZES;
        }
      }
      
      const randomIndex = Math.floor(Math.random() * filteredQuizzes.length);
      const quiz = filteredQuizzes[randomIndex];
      
      // Mark this quiz as used
      PuzzleTracker.markPuzzleAsUsed(quiz.id);
      
      console.log('✅ Selected character quiz:', `${quiz.anime} - ${quiz.character}`);
      console.log('📊 Used puzzles count:', PuzzleTracker.getUsedCount());
      
      return {
        type: 'character-guess',
        characterQuiz: quiz
      };
    }
  }

  static validateSolution(puzzle: AnimePuzzle, solution: string[]): boolean {
    return JSON.stringify(solution) === JSON.stringify(puzzle.blanks);
  }

  static validateCharacterGuess(quiz: CharacterQuiz, guess: string): boolean {
    const normalizedGuess = guess.toLowerCase().trim();
    const correctAnswer = quiz.correctAnswer.toLowerCase();
    const alternatives = quiz.alternativeAnswers.map(alt => alt.toLowerCase());
    
    return normalizedGuess === correctAnswer || alternatives.includes(normalizedGuess);
  }

  static getInitialGameStats(): GameStats {
    return {
      totalPuzzlesSolved: 0,
      averageHintsUsed: 0,
      favoriteAnime: '',
      currentStreak: 0,
      hearts: 3,
      maxHearts: 3,
      energy: 5,
      maxEnergy: 5,
      lastEnergyReset: Date.now(),
      badges: [],
      unlockedBadges: [],
      level: 1,
      experience: 0
    };
  }

  static updateEnergyIfNeeded(gameStats: GameStats): GameStats {
    const now = Date.now();
    const resetInterval = 10 * 60 * 1000; // 10 minutes
    const timeSinceReset = now - gameStats.lastEnergyReset;
    
    if (timeSinceReset >= resetInterval) {
      const energyToAdd = Math.floor(timeSinceReset / resetInterval);
      const newEnergy = Math.min(gameStats.energy + energyToAdd, gameStats.maxEnergy);
      
      return {
        ...gameStats,
        energy: newEnergy,
        lastEnergyReset: now
      };
    }
    
    return gameStats;
  }

  static checkAndUnlockBadges(gameStats: GameStats): GameStats {
    const newUnlockedBadges = [...gameStats.unlockedBadges];
    let newStats = { ...gameStats };
    
    // Check for first puzzle badge
    if (gameStats.totalPuzzlesSolved >= 1 && !newUnlockedBadges.includes('first_puzzle')) {
      newUnlockedBadges.push('first_puzzle');
      newStats.hearts = Math.min(newStats.hearts + 1, newStats.maxHearts);
    }
    
    // Check for puzzle master badge
    if (gameStats.totalPuzzlesSolved >= 10 && !newUnlockedBadges.includes('puzzle_master')) {
      newUnlockedBadges.push('puzzle_master');
      newStats.maxHearts += 1;
      newStats.energy = Math.min(newStats.energy + 2, newStats.maxEnergy);
    }
    
    return {
      ...newStats,
      unlockedBadges: newUnlockedBadges
    };
  }

  static getCharacterHint(quiz: CharacterQuiz, hintNumber: number): { hint: string; characterResponse: string } {
    switch (hintNumber) {
      case 1:
        return { hint: quiz.hints.hint1, characterResponse: quiz.hintResponses.hint1Response };
      case 2:
        return { hint: quiz.hints.hint2, characterResponse: quiz.hintResponses.hint2Response };
      case 3:
        return { hint: quiz.hints.hint3, characterResponse: quiz.hintResponses.hint3Response };
      case 4:
        return { hint: quiz.hints.finalHint, characterResponse: quiz.hintResponses.finalHintResponse };
      default:
        return { hint: '', characterResponse: '' };
    }
  }
}
