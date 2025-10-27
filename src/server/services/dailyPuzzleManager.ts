import { redis } from '@devvit/web/server';
import { DailyPuzzleCollection, DailyPuzzleSet } from '../../shared/types/dailyPuzzles';
import { AIPuzzleGenerator, OpenAIProvider, GroqProvider, AnthropicProvider } from './aiPuzzleGenerator';

export class DailyPuzzleManager {
  private generator: AIPuzzleGenerator;
  private supportedAnimes = ['Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'My Hero Academia'];
  private difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  private puzzlesPerSet = 5;

  constructor() {
    // Initialize AI provider based on available API keys
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (groqKey) {
      // Groq is fast and often free - prefer it
      this.generator = new AIPuzzleGenerator(new GroqProvider(groqKey));
      console.log('🤖 Using Groq AI for puzzle generation');
    } else if (openaiKey) {
      this.generator = new AIPuzzleGenerator(new OpenAIProvider(openaiKey));
      console.log('🤖 Using OpenAI for puzzle generation');
    } else if (anthropicKey) {
      this.generator = new AIPuzzleGenerator(new AnthropicProvider(anthropicKey));
      console.log('🤖 Using Anthropic Claude for puzzle generation');
    } else {
      console.warn('⚠️ No AI API keys found. Daily puzzle generation will be disabled.');
      throw new Error('No AI API keys configured for puzzle generation');
    }
  }

  async getTodaysPuzzles(): Promise<DailyPuzzleCollection> {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_puzzles:${today}`;

    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('📦 Retrieved daily puzzles from cache');
      return JSON.parse(cached);
    }

    // Generate new puzzles for today
    console.log('🎲 Generating new daily puzzles...');
    const puzzleCollection = await this.generateDailyPuzzles(today);

    // Cache for 24 hours
    await redis.setex(cacheKey, 86400, JSON.stringify(puzzleCollection));
    console.log('💾 Cached daily puzzles for 24 hours');

    return puzzleCollection;
  }

  async generateDailyPuzzles(date: string): Promise<DailyPuzzleCollection> {
    const puzzleSets: DailyPuzzleSet[] = [];
    let totalPuzzles = 0;

    console.log(`🎯 Generating puzzles for ${this.supportedAnimes.length} animes x ${this.difficulties.length} difficulties`);

    // Generate puzzles for each anime at each difficulty level
    for (const anime of this.supportedAnimes) {
      for (const difficulty of this.difficulties) {
        try {
          console.log(`🎨 Generating ${anime} ${difficulty} puzzles...`);
          
          const puzzleSet = await this.generator.generateDailyPuzzles(
            anime, 
            difficulty, 
            this.puzzlesPerSet
          );
          
          puzzleSets.push(puzzleSet);
          totalPuzzles += puzzleSet.wordPuzzles.length + puzzleSet.characterQuizzes.length;
          
          console.log(`✅ Generated ${puzzleSet.wordPuzzles.length + puzzleSet.characterQuizzes.length} puzzles for ${anime} ${difficulty}`);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Failed to generate puzzles for ${anime} ${difficulty}:`, error);
          
          // Create fallback empty set to maintain structure
          puzzleSets.push({
            date,
            anime,
            difficulty,
            wordPuzzles: [],
            characterQuizzes: [],
            generatedAt: new Date().toISOString()
          });
        }
      }
    }

    const collection: DailyPuzzleCollection = {
      date,
      puzzleSets,
      totalPuzzles,
      generatedAt: new Date().toISOString()
    };

    console.log(`🎉 Generated ${totalPuzzles} total puzzles for ${date}`);
    return collection;
  }

  async getPuzzlesForAnime(anime: string, difficulty?: string): Promise<DailyPuzzleSet[]> {
    const todaysPuzzles = await this.getTodaysPuzzles();
    
    return todaysPuzzles.puzzleSets.filter(set => {
      const animeMatch = set.anime === anime;
      const difficultyMatch = !difficulty || set.difficulty === difficulty;
      return animeMatch && difficultyMatch;
    });
  }

  async getRandomPuzzleFromToday(anime?: string, difficulty?: string): Promise<any> {
    const todaysPuzzles = await this.getTodaysPuzzles();
    
    // Filter puzzle sets based on criteria
    let availableSets = todaysPuzzles.puzzleSets;
    
    if (anime && anime !== 'Mixed') {
      availableSets = availableSets.filter(set => set.anime === anime);
    }
    
    if (difficulty) {
      availableSets = availableSets.filter(set => set.difficulty === difficulty);
    }

    // Collect all puzzles from available sets
    const allPuzzles: any[] = [];
    
    availableSets.forEach(set => {
      // Add word puzzles
      set.wordPuzzles.forEach(puzzle => {
        allPuzzles.push({
          type: 'word-puzzle',
          wordPuzzle: puzzle
        });
      });
      
      // Add character quizzes
      set.characterQuizzes.forEach(quiz => {
        allPuzzles.push({
          type: 'character-guess',
          characterQuiz: quiz
        });
      });
    });

    if (allPuzzles.length === 0) {
      throw new Error(`No puzzles available for anime: ${anime}, difficulty: ${difficulty}`);
    }

    // Return random puzzle
    const randomIndex = Math.floor(Math.random() * allPuzzles.length);
    return allPuzzles[randomIndex];
  }

  async forceRegenerateToday(): Promise<DailyPuzzleCollection> {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_puzzles:${today}`;
    
    // Clear cache
    await redis.del(cacheKey);
    console.log('🗑️ Cleared daily puzzle cache');
    
    // Generate fresh puzzles
    return await this.getTodaysPuzzles();
  }

  async getGenerationStatus(): Promise<{
    hasToday: boolean;
    totalPuzzles: number;
    lastGenerated: string;
    nextGeneration: string;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_puzzles:${today}`;
    
    const cached = await redis.get(cacheKey);
    const hasToday = !!cached;
    
    let totalPuzzles = 0;
    let lastGenerated = 'Never';
    
    if (cached) {
      const data = JSON.parse(cached);
      totalPuzzles = data.totalPuzzles;
      lastGenerated = data.generatedAt;
    }

    // Calculate next generation time (tomorrow at midnight UTC)
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    
    return {
      hasToday,
      totalPuzzles,
      lastGenerated,
      nextGeneration: tomorrow.toISOString()
    };
  }
}
