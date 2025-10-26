import { 
  DailyPack, 
  Puzzle, 
  PuzzleType,
  QuoteFillPuzzle,
  EmojiSenseiPuzzle,
  WhoSaidItPuzzle,
  MoodMatchPuzzle,
  WhoAmIPuzzle
} from '../../shared/types/daily-pack';
import pixelReactions from '../config/pixel-reactions.json';

export class PackGenerator {
  private animeQuotes = [
    // Naruto
    { anime: 'Naruto', character: 'Naruto Uzumaki', quote: 'I never go back on my word! That is my nindo, my ninja way!' },
    { anime: 'Naruto', character: 'Rock Lee', quote: 'A dropout will beat a genius through hard work!' },
    { anime: 'Naruto', character: 'Sasuke Uchiha', quote: 'I have long since closed my eyes. My only goal is in the darkness.' },
    
    // One Piece
    { anime: 'One Piece', character: 'Monkey D. Luffy', quote: 'I will become the Pirate King!' },
    { anime: 'One Piece', character: 'Roronoa Zoro', quote: 'Nothing happened.' },
    { anime: 'One Piece', character: 'Nico Robin', quote: 'I want to live!' },
    
    // Attack on Titan
    { anime: 'Attack on Titan', character: 'Eren Yeager', quote: 'If you win, you live. If you lose, you die.' },
    { anime: 'Attack on Titan', character: 'Levi Ackerman', quote: 'The only thing we are allowed to do is believe.' },
    
    // Demon Slayer
    { anime: 'Demon Slayer', character: 'Tanjiro Kamado', quote: 'I will not let anyone else die!' },
    { anime: 'Demon Slayer', character: 'Inosuke Hashibira', quote: 'I am the king of the mountains!' },
    
    // My Hero Academia
    { anime: 'My Hero Academia', character: 'Izuku Midoriya', quote: 'Sometimes I do feel like I am a failure.' },
    { anime: 'My Hero Academia', character: 'Katsuki Bakugo', quote: 'I will win. That is what heroes do.' },
    
    // Death Note
    { anime: 'Death Note', character: 'Light Yagami', quote: 'I am justice! I protect the innocent.' },
    { anime: 'Death Note', character: 'L', quote: 'I am L. The worlds greatest detective.' }
  ];

  private emojiMappings = {
    'fire': '🔥', 'heart': '❤️', 'star': '⭐', 'lightning': '⚡', 'sword': '⚔️',
    'shield': '🛡️', 'crown': '👑', 'gem': '💎', 'flower': '🌸', 'moon': '🌙',
    'sun': '☀️', 'water': '💧', 'wind': '💨', 'earth': '🌍', 'ice': '❄️'
  };

  private moods = [
    { emoji: '😤', description: 'determined/angry' },
    { emoji: '😢', description: 'sad/crying' },
    { emoji: '😊', description: 'happy/cheerful' },
    { emoji: '😨', description: 'scared/worried' },
    { emoji: '😎', description: 'cool/confident' },
    { emoji: '🤔', description: 'thinking/confused' },
    { emoji: '😍', description: 'excited/amazed' },
    { emoji: '😴', description: 'tired/sleepy' }
  ];

  generateDailyPack(date: string): DailyPack {
    const puzzles: Puzzle[] = [];
    
    // Generate 2 of each type (8-10 total)
    puzzles.push(...this.generateQuoteFillPuzzles(2));
    puzzles.push(...this.generateEmojiSenseiPuzzles(2));
    puzzles.push(...this.generateWhoSaidItPuzzles(2));
    puzzles.push(...this.generateMoodMatchPuzzles(2));
    puzzles.push(...this.generateWhoAmIPuzzles(2));

    // Shuffle puzzles
    this.shuffleArray(puzzles);

    return {
      meta: {
        date,
        language: 'en',
        pack: `daily-${date}`
      },
      puzzles
    };
  }

  private generateQuoteFillPuzzles(count: number): QuoteFillPuzzle[] {
    const puzzles: QuoteFillPuzzle[] = [];
    const usedQuotes = new Set<string>();

    for (let i = 0; i < count && puzzles.length < count; i++) {
      const quote = this.getRandomQuote(usedQuotes);
      if (!quote) break;

      const words = quote.quote.split(' ');
      const blankIndices = this.selectRandomIndices(words, 1, 3);
      const blankedWords = blankIndices.map(idx => words[idx]);
      
      // Create quote with blanks
      const quoteParts = [...words];
      blankIndices.forEach(idx => quoteParts[idx] = '____');
      const blankedQuote = quoteParts.join(' ');

      // Generate options (correct + distractors)
      const options = [...blankedWords];
      while (options.length < 6) {
        const randomWord = this.getRandomWord();
        if (!options.includes(randomWord)) {
          options.push(randomWord);
        }
      }
      this.shuffleArray(options);

      const correctIndices = blankedWords.map(word => options.indexOf(word));

      puzzles.push({
        id: `quote_fill_${Date.now()}_${i}`,
        type: 'quote_fill',
        anime: quote.anime,
        character: quote.character,
        data: {
          quote: blankedQuote,
          options,
          correct: correctIndices,
          original: quote.quote
        },
        feedback: this.generateFeedback('quote_fill', quote.character),
        pixel_reaction: this.getPixelReaction(quote.character, 'quote_fill')
      });

      usedQuotes.add(quote.quote);
    }

    return puzzles;
  }

  private generateEmojiSenseiPuzzles(count: number): EmojiSenseiPuzzle[] {
    const puzzles: EmojiSenseiPuzzle[] = [];

    for (let i = 0; i < count; i++) {
      const quote = this.getRandomQuote();
      if (!quote) continue;

      const emojiKeys = Object.keys(this.emojiMappings);
      const selectedKeys = this.selectRandom(emojiKeys, 2);
      const correctEmojis = selectedKeys.map(key => this.emojiMappings[key as keyof typeof this.emojiMappings]);
      
      // Create text with emoji blanks
      const text = `${quote.quote} Express this with ____ and ____`;
      const blanks = selectedKeys;
      
      // Generate emoji options
      const allEmojis = Object.values(this.emojiMappings);
      const emojiOptions = [...correctEmojis];
      while (emojiOptions.length < 8) {
        const randomEmoji = this.selectRandom(allEmojis, 1)[0];
        if (!emojiOptions.includes(randomEmoji)) {
          emojiOptions.push(randomEmoji);
        }
      }
      this.shuffleArray(emojiOptions);

      puzzles.push({
        id: `emoji_sensei_${Date.now()}_${i}`,
        type: 'emoji_sensei',
        anime: quote.anime,
        character: quote.character,
        data: {
          text,
          blanks,
          correct_emojis: correctEmojis,
          emoji_options: emojiOptions
        },
        feedback: this.generateFeedback('emoji_sensei', quote.character),
        pixel_reaction: this.getPixelReaction(quote.character, 'emoji_sensei')
      });
    }

    return puzzles;
  }

  private generateWhoSaidItPuzzles(count: number): WhoSaidItPuzzle[] {
    const puzzles: WhoSaidItPuzzle[] = [];

    for (let i = 0; i < count; i++) {
      const quote = this.getRandomQuote();
      if (!quote) continue;

      // Get other characters as distractors
      const otherCharacters = this.animeQuotes
        .filter(q => q.character !== quote.character)
        .map(q => q.character);
      
      const distractors = this.selectRandom(otherCharacters, 3);
      const options = [quote.character, ...distractors];
      this.shuffleArray(options);
      
      const correctIndex = options.indexOf(quote.character);

      puzzles.push({
        id: `who_said_it_${Date.now()}_${i}`,
        type: 'who_said_it',
        anime: quote.anime,
        character: quote.character,
        data: {
          quote: quote.quote,
          options,
          correct: correctIndex
        },
        feedback: this.generateFeedback('who_said_it', quote.character),
        pixel_reaction: this.getPixelReaction(quote.character, 'who_said_it')
      });
    }

    return puzzles;
  }

  private generateMoodMatchPuzzles(count: number): MoodMatchPuzzle[] {
    const puzzles: MoodMatchPuzzle[] = [];

    for (let i = 0; i < count; i++) {
      const quote = this.getRandomQuote();
      if (!quote) continue;

      // Determine appropriate mood based on quote content
      const correctMood = this.determineMoodFromQuote(quote.quote);
      const moodOptions = [correctMood];
      
      // Add distractor moods
      const otherMoods = this.moods.filter(m => m.emoji !== correctMood);
      moodOptions.push(...this.selectRandom(otherMoods, 3).map(m => m.emoji));
      this.shuffleArray(moodOptions);
      
      const correctIndex = moodOptions.indexOf(correctMood);

      puzzles.push({
        id: `mood_match_${Date.now()}_${i}`,
        type: 'mood_match',
        anime: quote.anime,
        character: quote.character,
        data: {
          quote: quote.quote,
          context: `${quote.character} from ${quote.anime} said this`,
          mood_options: moodOptions,
          correct: correctIndex
        },
        feedback: this.generateFeedback('mood_match', quote.character),
        pixel_reaction: this.getPixelReaction(quote.character, 'mood_match')
      });
    }

    return puzzles;
  }

  private generateWhoAmIPuzzles(count: number): WhoAmIPuzzle[] {
    const puzzles: WhoAmIPuzzle[] = [];
    const characterRiddles = [
      {
        anime: 'Naruto',
        character: 'Naruto Uzumaki',
        riddle: 'I dream of becoming Hokage and never give up on my ninja way!',
        hints: [
          'I have a nine-tailed fox sealed inside me',
          'I love ramen and my signature jutsu involves clones',
          'I wear an orange jumpsuit and have blonde spiky hair'
        ] as [string, string, string],
        alternatives: ['Naruto', 'Uzumaki']
      },
      {
        anime: 'One Piece',
        character: 'Monkey D. Luffy',
        riddle: 'I will become the Pirate King and my body stretches like rubber!',
        hints: [
          'I ate a Devil Fruit that gave me rubber powers',
          'I wear a straw hat that was given to me by Red-Haired Shanks',
          'I am the captain of the Straw Hat Pirates'
        ] as [string, string, string],
        alternatives: ['Luffy', 'Straw Hat']
      },
      {
        anime: 'Attack on Titan',
        character: 'Eren Yeager',
        riddle: 'I will destroy all titans and fight for freedom beyond the walls!',
        hints: [
          'I can transform into a titan myself',
          'My father gave me the power of the Attack Titan',
          'I lived in Shiganshina District before the wall fell'
        ] as [string, string, string],
        alternatives: ['Eren', 'Yeager', 'Jaeger']
      }
    ];

    for (let i = 0; i < count && i < characterRiddles.length; i++) {
      const riddle = characterRiddles[i];

      puzzles.push({
        id: `who_am_i_${Date.now()}_${i}`,
        type: 'who_am_i',
        anime: riddle.anime,
        character: riddle.character,
        data: {
          riddle: riddle.riddle,
          hints: riddle.hints,
          answer: riddle.character,
          alternatives: riddle.alternatives
        },
        feedback: this.generateFeedback('who_am_i', riddle.character),
        pixel_reaction: this.getPixelReaction(riddle.character, 'who_am_i')
      });
    }

    return puzzles;
  }

  private getRandomQuote(usedQuotes?: Set<string>) {
    const availableQuotes = usedQuotes 
      ? this.animeQuotes.filter(q => !usedQuotes.has(q.quote))
      : this.animeQuotes;
    
    if (availableQuotes.length === 0) return null;
    
    return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  }

  private selectRandomIndices(array: any[], min: number, max: number): number[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const indices: number[] = [];
    
    while (indices.length < count && indices.length < array.length) {
      const idx = Math.floor(Math.random() * array.length);
      if (!indices.includes(idx)) {
        indices.push(idx);
      }
    }
    
    return indices.sort((a, b) => a - b);
  }

  private selectRandom<T>(array: T[], count: number): T[] {
    const shuffled = [...array];
    this.shuffleArray(shuffled);
    return shuffled.slice(0, count);
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private getRandomWord(): string {
    const words = ['power', 'strength', 'courage', 'hope', 'dream', 'fight', 'victory', 'peace', 'justice', 'friendship'];
    return words[Math.floor(Math.random() * words.length)];
  }

  private determineMoodFromQuote(quote: string): string {
    const lowerQuote = quote.toLowerCase();
    
    if (lowerQuote.includes('fight') || lowerQuote.includes('win') || lowerQuote.includes('never')) return '😤';
    if (lowerQuote.includes('die') || lowerQuote.includes('lose') || lowerQuote.includes('sad')) return '😢';
    if (lowerQuote.includes('king') || lowerQuote.includes('become') || lowerQuote.includes('dream')) return '😊';
    if (lowerQuote.includes('justice') || lowerQuote.includes('protect')) return '😎';
    
    return '🤔'; // default
  }

  private generateFeedback(type: PuzzleType, character: string): any {
    const feedbacks = {
      quote_fill: {
        perfect: `${character}: "Perfect! You know my words by heart!"`,
        good: `${character}: "Well done! You understand me!"`,
        average: `${character}: "Not bad, but you can do better!"`,
        bad: `${character}: "Did you even listen to what I said?"`
      },
      emoji_sensei: {
        perfect: `${character}: "Your emoji mastery is incredible!"`,
        good: `${character}: "Good emotional understanding!"`,
        average: `${character}: "You're getting the hang of it!"`,
        bad: `${character}: "Emotions are more complex than that!"`
      },
      who_said_it: {
        perfect: `${character}: "You know exactly who I am!"`,
        good: `${character}: "You recognized my voice!"`,
        average: `${character}: "Close, but not quite right!"`,
        bad: `${character}: "Do I really sound like them?"`
      },
      mood_match: {
        perfect: `${character}: "You perfectly captured my feelings!"`,
        good: `${character}: "You understand my emotions!"`,
        average: `${character}: "You're reading the mood okay!"`,
        bad: `${character}: "That's not how I was feeling at all!"`
      },
      who_am_i: {
        perfect: `${character}: "You figured me out completely!"`,
        good: `${character}: "You know me well!"`,
        average: `${character}: "You're on the right track!"`,
        bad: `${character}: "You need more clues about me!"`
      }
    };

    return feedbacks[type] || feedbacks.quote_fill;
  }

  private getPixelReaction(character: string, type: PuzzleType): any {
    const characterReactions = (pixelReactions as any).characters[character];
    
    if (characterReactions) {
      return {
        on_correct: characterReactions.correct,
        on_fail: characterReactions.fail
      };
    }

    // Fallback to type defaults
    const typeDefaults = (pixelReactions as any).puzzle_type_defaults[type];
    if (typeDefaults) {
      return {
        on_correct: typeDefaults.correct,
        on_fail: typeDefaults.fail
      };
    }

    // Final fallback
    return (pixelReactions as any).default;
  }
}
