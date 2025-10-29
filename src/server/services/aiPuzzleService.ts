import { redis } from '@devvit/web/server';

type AIProvider = 'groq' | 'openai' | 'anthropic';
type Difficulty = 'easy' | 'medium' | 'hard';

export class AIPuzzleService {
  private static readonly CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds
  
  static async generateDailyPuzzles(date: string = new Date().toISOString().split('T')[0]) {
    const cacheKey = `daily_puzzles:${date}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const animes = ['Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'My Hero Academia'];
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const puzzles: any[] = [];

    try {
      for (const anime of animes) {
        for (const difficulty of difficulties) {
          console.log(`🎨 Generating ${anime} ${difficulty} puzzles...`);
          
          const animePuzzles = await this.generatePuzzlesForAnime(anime, difficulty, 5);
          puzzles.push(...animePuzzles);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const dailyPuzzles = {
        date,
        puzzles,
        total: puzzles.length,
        generated_at: new Date().toISOString()
      };

      // Cache for 24 hours
      await redis.setex(cacheKey, this.CACHE_DURATION, JSON.stringify(dailyPuzzles));
      
      console.log(`🎉 Generated ${puzzles.length} total puzzles for ${date}`);
      return dailyPuzzles;
      
    } catch (error) {
      console.error('❌ Failed to generate daily puzzles:', error);
      throw error;
    }
  }

  static async generatePuzzlesForAnime(anime: string, difficulty: Difficulty, count: number = 5) {
    const provider = this.getAvailableProvider();
    if (!provider) {
      throw new Error('No AI provider available');
    }

    const prompt = this.createPuzzlePrompt(anime, difficulty, count);
    
    try {
      const response = await this.callAIProvider(provider, prompt);
      const puzzles = this.parsePuzzleResponse(response, anime, difficulty);
      
      return puzzles.slice(0, count); // Ensure we don't exceed requested count
    } catch (error) {
      console.error(`Failed to generate ${anime} ${difficulty} puzzles:`, error);
      return [];
    }
  }

  private static getAvailableProvider(): AIProvider | null {
    if (process.env.GROQ_API_KEY) return 'groq';
    if (process.env.OPENAI_API_KEY) return 'openai';
    if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
    return null;
  }

  private static async callAIProvider(provider: AIProvider, prompt: string): Promise<string> {
    switch (provider) {
      case 'groq':
        return this.callGroq(prompt);
      case 'openai':
        return this.callOpenAI(prompt);
      case 'anthropic':
        return this.callAnthropic(prompt);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private static async callGroq(prompt: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private static createPuzzlePrompt(anime: string, difficulty: Difficulty, count: number): string {
    return `Generate ${count} anime word puzzles for ${anime} at ${difficulty} difficulty level.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "character": "Character Name",
    "quote_original": "Complete quote",
    "quote_puzzle": "Quote with ____ blanks",
    "blanks": ["word1", "word2"],
    "tiles": ["word1", "word2", "distractor1", "distractor2", "distractor3", "distractor4"],
    "hints": {
      "character": "Character description",
      "context": "Quote context",
      "emoji": "🎌✨"
    }
  }
]

Requirements:
- Use authentic ${anime} characters and quotes
- ${difficulty} difficulty: ${this.getDifficultyGuidelines(difficulty)}
- Include 2-4 distractors that are plausible but wrong
- Make hints helpful but not too obvious
- Use appropriate anime emojis
- Ensure quotes are character-appropriate`;
  }

  private static getDifficultyGuidelines(difficulty: Difficulty): string {
    switch (difficulty) {
      case 'easy':
        return 'Simple vocabulary, well-known characters, 1-2 blanks';
      case 'medium':
        return 'Moderate complexity, mix of popular/lesser-known characters, 2-3 blanks';
      case 'hard':
        return 'Complex vocabulary, obscure references, 3-4 blanks';
    }
  }

  private static parsePuzzleResponse(response: string, anime: string, difficulty: Difficulty): any[] {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const puzzles = JSON.parse(jsonStr);
      
      return puzzles.map((puzzle: any, index: number) => ({
        id: `ai-${anime.toLowerCase().replace(/\s+/g, '')}-${difficulty}-${Date.now()}-${index}`,
        anime,
        difficulty,
        source: 'AI Generated',
        ...puzzle
      }));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return [];
    }
  }

  static async getRandomDailyPuzzle(anime?: string, difficulty?: Difficulty) {
    const today = new Date().toISOString().split('T')[0];
    const dailyPuzzles = await this.generateDailyPuzzles(today);
    
    let availablePuzzles = dailyPuzzles.puzzles;
    
    if (anime) {
      availablePuzzles = availablePuzzles.filter((p: any) => p.anime === anime);
    }
    
    if (difficulty) {
      availablePuzzles = availablePuzzles.filter((p: any) => p.difficulty === difficulty);
    }
    
    if (availablePuzzles.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    return availablePuzzles[randomIndex];
  }

  static async getDailyPuzzleStatus() {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_puzzles:${today}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      const data = JSON.parse(cached);
      return {
        available: true,
        date: today,
        total_puzzles: data.total,
        generated_at: data.generated_at,
        provider: this.getAvailableProvider()
      };
    }
    
    return {
      available: false,
      date: today,
      total_puzzles: 0,
      provider: this.getAvailableProvider()
    };
  }

  static async regenerateDailyPuzzles() {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_puzzles:${today}`;
    
    // Clear existing cache
    await redis.del(cacheKey);
    
    // Generate fresh puzzles
    return this.generateDailyPuzzles(today);
  }
}
