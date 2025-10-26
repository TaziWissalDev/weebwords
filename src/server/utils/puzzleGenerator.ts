import { AnimePuzzle } from '../../shared/types/puzzle';

/**
 * Utility to generate new anime puzzles
 * This can be used to expand the puzzle database
 */

export interface PuzzleTemplate {
  anime: string;
  character: string;
  difficulty: 'easy' | 'medium' | 'hard';
  quote_original: string;
  hints: {
    character: string;
    context: string;
    emoji: string;
  };
  source: string;
}

export function generatePuzzleFromTemplate(template: PuzzleTemplate): AnimePuzzle {
  const id = `${template.anime.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`;
  
  // Find words to make into blanks (simple heuristic: important words)
  const words = template.quote_original.split(' ');
  const importantWords = words.filter(word => 
    word.length > 3 && 
    !['the', 'and', 'but', 'for', 'are', 'will', 'can', 'not'].includes(word.toLowerCase())
  );
  
  // Take up to 2 important words as blanks
  const blanks = importantWords.slice(0, 2).map(word => word.replace(/[.,!?]/, ''));
  
  // Create puzzle quote with blanks
  let quote_puzzle = template.quote_original;
  blanks.forEach(blank => {
    quote_puzzle = quote_puzzle.replace(new RegExp(`\\b${blank}\\b`, 'i'), '____');
  });
  
  // Generate distractor words (same length and type)
  const distractors = generateDistractors(blanks, template.anime);
  
  // Combine blanks and distractors for tiles
  const tiles = [...blanks, ...distractors];
  
  return {
    id,
    anime: template.anime,
    character: template.character,
    difficulty: template.difficulty,
    quote_original: template.quote_original,
    quote_puzzle,
    blanks,
    tiles: shuffleArray(tiles),
    distractors,
    hints: template.hints,
    source: template.source
  };
}

function generateDistractors(blanks: string[], anime: string): string[] {
  // Common anime-related words that could serve as distractors
  const commonWords = [
    'power', 'strength', 'friend', 'enemy', 'battle', 'fight', 'dream', 'hope',
    'justice', 'peace', 'truth', 'love', 'hate', 'fear', 'courage', 'honor',
    'ninja', 'pirate', 'hero', 'villain', 'master', 'student', 'sensei', 'rival',
    'protect', 'save', 'defeat', 'win', 'lose', 'train', 'learn', 'grow',
    'world', 'future', 'past', 'destiny', 'fate', 'legend', 'story', 'journey'
  ];
  
  const distractors: string[] = [];
  
  blanks.forEach(blank => {
    const blankLength = blank.length;
    const similarWords = commonWords.filter(word => 
      Math.abs(word.length - blankLength) <= 2 && 
      word !== blank.toLowerCase()
    );
    
    // Add 2 distractors per blank
    const selected = similarWords.slice(0, 2);
    distractors.push(...selected);
  });
  
  // Ensure we have at least 4 distractors total
  while (distractors.length < 4) {
    const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
    if (!distractors.includes(randomWord) && !blanks.includes(randomWord)) {
      distractors.push(randomWord);
    }
  }
  
  return distractors.slice(0, 6); // Limit to 6 distractors
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Example usage:
export const ADDITIONAL_PUZZLE_TEMPLATES: PuzzleTemplate[] = [
  {
    anime: 'Fullmetal Alchemist',
    character: 'Edward Elric',
    difficulty: 'medium',
    quote_original: 'A lesson without pain is meaningless.',
    hints: {
      character: 'Short alchemist with automail arm',
      context: 'Philosophy about learning and growth',
      emoji: '⚗️💪'
    },
    source: 'https://anilist.co/anime/121/Fullmetal-Alchemist'
  },
  {
    anime: 'Hunter x Hunter',
    character: 'Gon Freecss',
    difficulty: 'easy',
    quote_original: 'I can see why this is fun!',
    hints: {
      character: 'Spiky green-haired boy hunter',
      context: 'His enthusiasm for challenges',
      emoji: '🎣😄'
    },
    source: 'https://anilist.co/anime/136/Hunter-x-Hunter'
  }
];

/**
 * Generate puzzles from templates and add to database
 */
export function generatePuzzlesFromTemplates(templates: PuzzleTemplate[]): AnimePuzzle[] {
  return templates.map(generatePuzzleFromTemplate);
}
