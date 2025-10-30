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
    // Set the OpenAI API key directly
    const openaiKey = process.env.OPENAI_API_KEY || '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';
    const groqKey = process.env.GROQ_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey) {
      this.generator = new AIPuzzleGenerator(new OpenAIProvider(openaiKey));
      console.log('🤖 Using OpenAI GPT for puzzle generation');
    } else if (groqKey) {
      // Groq is fast and often free - use as fallback
      this.generator = new AIPuzzleGenerator(new GroqProvider(groqKey));
      console.log('🤖 Using Groq AI for puzzle generation');
    } else if (anthropicKey) {
      this.generator = new AIPuzzleGenerator(new AnthropicProvider(anthropicKey));
      console.log('🤖 Using Anthropic Claude for puzzle generation');
    } else {
      console.warn('⚠️ No AI API keys found. Daily puzzle generation will be disabled.');
      throw new Error('No AI API keys configured for puzzle generation');
    }

    // Note: Scheduler initialization is now manual to avoid Redis context issues
    // Call initializeScheduler() manually within request contexts if needed
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
    await redis.set(cacheKey, JSON.stringify(puzzleCollection), { expiration: new Date(Date.now() + 86400 * 1000) });
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

  /**
   * Initialize automatic puzzle generation scheduler
   */
  private async initializeScheduler(): Promise<void> {
    console.log('🕐 Initializing automatic puzzle generation scheduler...');
    
    // Check if we need to generate puzzles immediately
    await this.checkAndGenerateIfNeeded();
    
    // Set up periodic checks (every hour)
    this.schedulePeriodicChecks();
  }

  /**
   * Check if puzzles need to be generated and generate them if needed
   */
  private async checkAndGenerateIfNeeded(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `daily_puzzles:${today}`;
      
      const cached = await redis.get(cacheKey);
      
      if (!cached) {
        console.log('🎲 No puzzles found for today, generating automatically...');
        await this.getTodaysPuzzles();
        console.log('✅ Automatic puzzle generation completed');
      } else {
        const data = JSON.parse(cached);
        console.log(`📦 Found ${data.totalPuzzles} puzzles for today (generated at ${data.generatedAt})`);
        
        // Check if we need to generate more puzzles (if user has completed all existing ones)
        await this.checkAndExpandPuzzles(data);
      }
    } catch (error) {
      console.error('❌ Error in automatic puzzle generation:', error);
    }
  }

  /**
   * Check if user has completed all puzzles and generate more if needed
   */
  private async checkAndExpandPuzzles(currentData: DailyPuzzleCollection): Promise<void> {
    try {
      // Check how many puzzles have been used today
      const usageKey = `puzzle_usage:${currentData.date}`;
      const usageData = await redis.get(usageKey);
      
      if (usageData) {
        const usage = JSON.parse(usageData);
        const totalUsed = Object.values(usage).reduce((sum: number, count: any) => sum + count, 0);
        
        // If more than 80% of puzzles have been used, generate additional puzzles
        if (totalUsed > currentData.totalPuzzles * 0.8) {
          console.log(`🔄 ${totalUsed}/${currentData.totalPuzzles} puzzles used, generating additional puzzles...`);
          await this.generateAdditionalPuzzles(currentData);
        }
      }
    } catch (error) {
      console.error('❌ Error checking puzzle usage:', error);
    }
  }

  /**
   * Generate additional puzzles when users are running out
   */
  private async generateAdditionalPuzzles(currentData: DailyPuzzleCollection): Promise<void> {
    try {
      const additionalSets: DailyPuzzleSet[] = [];
      let additionalPuzzles = 0;

      // Generate 2 additional puzzles for each anime/difficulty combination
      for (const anime of this.supportedAnimes) {
        for (const difficulty of this.difficulties) {
          try {
            console.log(`🎨 Generating additional ${anime} ${difficulty} puzzles...`);
            
            const puzzleSet = await this.generator.generateDailyPuzzles(
              anime, 
              difficulty, 
              2 // Generate 2 additional puzzles
            );
            
            additionalSets.push(puzzleSet);
            additionalPuzzles += puzzleSet.wordPuzzles.length + puzzleSet.characterQuizzes.length;
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`❌ Failed to generate additional puzzles for ${anime} ${difficulty}:`, error);
          }
        }
      }

      // Merge with existing puzzles
      const updatedData: DailyPuzzleCollection = {
        ...currentData,
        puzzleSets: [...currentData.puzzleSets, ...additionalSets],
        totalPuzzles: currentData.totalPuzzles + additionalPuzzles,
        generatedAt: new Date().toISOString()
      };

      // Update cache
      const cacheKey = `daily_puzzles:${currentData.date}`;
      await redis.set(cacheKey, JSON.stringify(updatedData), { expiration: new Date(Date.now() + 86400 * 1000) });
      
      console.log(`✅ Generated ${additionalPuzzles} additional puzzles. Total: ${updatedData.totalPuzzles}`);
    } catch (error) {
      console.error('❌ Error generating additional puzzles:', error);
    }
  }

  /**
   * Schedule periodic checks for puzzle generation
   */
  private schedulePeriodicChecks(): void {
    // Check every hour for new puzzle generation needs
    setInterval(async () => {
      console.log('🕐 Running scheduled puzzle check...');
      await this.checkAndGenerateIfNeeded();
    }, 60 * 60 * 1000); // 1 hour

    console.log('⏰ Scheduled hourly puzzle generation checks');
  }

  /**
   * Track puzzle usage for automatic generation
   */
  async trackPuzzleUsage(anime: string, difficulty: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const usageKey = `puzzle_usage:${today}`;
      const trackingKey = `${anime}:${difficulty}`;
      
      const usageData = await redis.get(usageKey);
      const usage = usageData ? JSON.parse(usageData) : {};
      
      usage[trackingKey] = (usage[trackingKey] || 0) + 1;
      
      await redis.set(usageKey, JSON.stringify(usage), { expiration: new Date(Date.now() + 86400 * 1000) });
      
      console.log(`📊 Tracked puzzle usage: ${trackingKey} = ${usage[trackingKey]}`);
    } catch (error) {
      console.error('❌ Error tracking puzzle usage:', error);
    }
  }
}
