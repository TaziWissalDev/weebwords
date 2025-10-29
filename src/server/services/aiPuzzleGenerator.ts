import { AnimePuzzle, CharacterQuiz } from '../../shared/types/puzzle';
import { DailyPuzzleSet, PuzzleTemplate } from '../../shared/types/dailyPuzzles';

export interface AIProvider {
  name: string;
  generatePuzzles(prompt: string): Promise<any>;
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePuzzles(prompt: string): Promise<any> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an anime expert who creates engaging word puzzles and character quizzes. Always respond with valid JSON only. Make puzzles challenging but fair, with authentic character voices and memorable quotes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}

// Anthropic Claude Provider
export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  private apiKey: string;
  private baseURL = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePuzzles(prompt: string): Promise<any> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `You are an anime expert who creates engaging word puzzles and character quizzes. Always respond with valid JSON only.\n\n${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.content[0].text);
  }
}

// Groq Provider (Fast and Free)
export class GroqProvider implements AIProvider {
  name = 'Groq';
  private apiKey: string;
  private baseURL = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePuzzles(prompt: string): Promise<any> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are an anime expert who creates engaging word puzzles and character quizzes. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}

export class AIPuzzleGenerator {
  private provider: AIProvider;
  private animeDatabase = {
    'Naruto': {
      characters: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake', 'Rock Lee', 'Gaara', 'Itachi Uchiha', 'Jiraiya'],
      themes: ['ninja way', 'friendship', 'perseverance', 'dreams', 'village protection', 'chakra', 'jutsu'],
      iconicQuotes: [
        'I will never give up!',
        'Believe it, dattebayo!',
        'I will become Hokage!',
        'Hard work beats talent!'
      ]
    },
    'One Piece': {
      characters: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Sanji', 'Usopp', 'Tony Tony Chopper', 'Nico Robin', 'Franky'],
      themes: ['pirate king', 'adventure', 'treasure', 'crew bonds', 'freedom', 'devil fruit'],
      iconicQuotes: [
        'I will become the Pirate King!',
        'Adventure awaits!',
        'Nakama means everything!'
      ]
    },
    'Attack on Titan': {
      characters: ['Eren Yeager', 'Mikasa Ackerman', 'Armin Arlert', 'Levi Ackerman', 'Erwin Smith', 'Annie Leonhart'],
      themes: ['freedom', 'survival', 'humanity', 'titans', 'walls', 'sacrifice'],
      iconicQuotes: [
        'Tatakae! Fight!',
        'If you win, you live. If you lose, you die.',
        'Freedom is worth fighting for!'
      ]
    },
    'Demon Slayer': {
      characters: ['Tanjiro Kamado', 'Nezuko Kamado', 'Zenitsu Agatsuma', 'Inosuke Hashibira', 'Giyu Tomioka', 'Rengoku Kyojuro'],
      themes: ['family bonds', 'breathing techniques', 'demon hunting', 'compassion', 'determination'],
      iconicQuotes: [
        'I will not let anyone else die!',
        'Protect what matters most!',
        'Never give up hope!'
      ]
    },
    'Jujutsu Kaisen': {
      characters: ['Yuji Itadori', 'Megumi Fushiguro', 'Nobara Kugisaki', 'Satoru Gojo', 'Sukuna', 'Maki Zenin'],
      themes: ['cursed energy', 'jujutsu sorcery', 'saving people', 'strength', 'friendship'],
      iconicQuotes: [
        'I want to save people unequally.',
        'You are strong.',
        'Cursed techniques lapse!'
      ]
    },
    'My Hero Academia': {
      characters: ['Izuku Midoriya', 'Katsuki Bakugo', 'Ochaco Uraraka', 'Tenya Iida', 'Shoto Todoroki', 'All Might'],
      themes: ['heroism', 'quirks', 'plus ultra', 'saving people', 'justice', 'dreams'],
      iconicQuotes: [
        'Plus Ultra!',
        'A real hero always finds a way!',
        'I can do it too!'
      ]
    }
  };

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  async generateDailyPuzzles(
    anime: string, 
    difficulty: 'easy' | 'medium' | 'hard', 
    count: number = 5
  ): Promise<DailyPuzzleSet> {
    const animeData = this.animeDatabase[anime as keyof typeof this.animeDatabase];
    if (!animeData) {
      throw new Error(`Anime "${anime}" not supported`);
    }

    const prompt = this.createPrompt(anime, difficulty, count, animeData);
    
    try {
      const generatedData = await this.provider.generatePuzzles(prompt);
      
      return {
        date: new Date().toISOString().split('T')[0],
        anime,
        difficulty,
        wordPuzzles: this.processWordPuzzles(generatedData.wordPuzzles, anime, difficulty),
        characterQuizzes: this.processCharacterQuizzes(generatedData.characterQuizzes, anime, difficulty),
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error generating puzzles for ${anime} (${difficulty}):`, error);
      throw error;
    }
  }

  private createPrompt(anime: string, difficulty: string, count: number, animeData: any): string {
    return `Generate ${count} anime word puzzles and ${count} character guessing quizzes for "${anime}" at ${difficulty} difficulty level.

ANIME CONTEXT:
- Characters: ${animeData.characters.join(', ')}
- Themes: ${animeData.themes.join(', ')}
- Sample quotes: ${animeData.iconicQuotes.join(' | ')}

DIFFICULTY GUIDELINES:
- Easy: Simple vocabulary, well-known characters, obvious clues
- Medium: Moderate vocabulary, mix of main/side characters, moderate clues  
- Hard: Complex vocabulary, obscure characters, subtle clues

WORD PUZZLE REQUIREMENTS:
- Create quotes that sound authentic to the character
- Use 2-3 blanks per quote (marked with ____)
- Include 6-8 total tiles (correct + distractors)
- Distractors should be plausible but wrong
- Keep quotes under 120 characters
- Make puzzles solvable without deep anime knowledge

CHARACTER QUIZ REQUIREMENTS:
- Provide 4 progressive hints (getting more obvious)
- Include character responses for each hint
- Cover physical traits, personality, abilities, relationships
- Make final hint very obvious
- Include both main and supporting characters

RESPONSE FORMAT (JSON only):
{
  "wordPuzzles": [
    {
      "character": "Character Name",
      "quote_original": "Full quote",
      "quote_puzzle": "Quote with ____ blanks",
      "blanks": ["word1", "word2"],
      "tiles": ["word1", "word2", "distractor1", "distractor2", "distractor3", "distractor4"],
      "hints": {
        "character": "Who said this hint",
        "context": "When/why said (no spoilers)",
        "emoji": "🎌⚡"
      }
    }
  ],
  "characterQuizzes": [
    {
      "character": "Character Name",
      "hints": {
        "hint1": "Vague physical trait",
        "hint2": "Personality trait", 
        "hint3": "Ability or role",
        "finalHint": "Very obvious identifier"
      },
      "hintResponses": {
        "hint1Response": "Character's response to hint 1",
        "hint2Response": "Character's response to hint 2", 
        "hint3Response": "Character's response to hint 3",
        "finalHintResponse": "Character's response to final hint"
      }
    }
  ]
}

Generate exactly ${count} of each type. Make them engaging and authentic to ${anime}!`;
  }

  private processWordPuzzles(puzzles: any[], anime: string, difficulty: string): AnimePuzzle[] {
    return puzzles.map((puzzle, index) => ({
      id: `ai-${anime.toLowerCase().replace(/\s+/g, '')}-${difficulty}-word-${Date.now()}-${index}`,
      anime,
      character: puzzle.character,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      quote_original: puzzle.quote_original,
      quote_puzzle: puzzle.quote_puzzle,
      blanks: puzzle.blanks,
      tiles: this.shuffleArray(puzzle.tiles),
      distractors: puzzle.tiles.filter((tile: string) => !puzzle.blanks.includes(tile)),
      hints: puzzle.hints,
      source: `AI Generated - ${new Date().toISOString().split('T')[0]}`
    }));
  }

  private processCharacterQuizzes(quizzes: any[], anime: string, difficulty: string): CharacterQuiz[] {
    return quizzes.map((quiz, index) => ({
      id: `ai-${anime.toLowerCase().replace(/\s+/g, '')}-${difficulty}-char-${Date.now()}-${index}`,
      anime,
      character: quiz.character,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      hints: quiz.hints,
      hintResponses: quiz.hintResponses
    }));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
