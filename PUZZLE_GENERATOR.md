# Anime Line - Puzzle Generator Guide

This document explains how to use and extend the anime word-tile puzzle system in **Anime Line**.

## 🎯 Overview

Anime Line is a word-tile puzzle game where players drag tiles to complete iconic anime quotes. The system includes:

- **Pre-built puzzle database** with 10+ puzzles from popular anime
- **Automatic puzzle generator** for creating new puzzles
- **Difficulty levels**: Easy, Medium, Hard
- **Scoring system** based on difficulty and hints used
- **Hint system** with character and context clues

## 🧩 Current Puzzle Database

The game includes puzzles from:
- **Naruto** (Rock Lee, etc.)
- **One Piece** (Luffy)
- **Death Note** (Light Yagami)
- **Attack on Titan** (Eren)
- **Demon Slayer** (Tanjiro)
- **My Hero Academia** (All Might)
- **Jujutsu Kaisen** (Yuji)
- **Spy x Family** (Anya)
- **Bleach** (Ichigo)
- **Dragon Ball Z** (Goku)

## 📝 Adding New Puzzles

### Method 1: Direct Addition to Database

Edit `src/server/core/puzzles.ts` and add to the `ANIME_PUZZLES` array:

```typescript
{
  id: 'unique-id-001',
  anime: 'Anime Name',
  character: 'Character Name',
  difficulty: 'easy', // 'easy' | 'medium' | 'hard'
  quote_original: 'The complete original quote',
  quote_puzzle: 'Quote with ____ blanks',
  blanks: ['word1', 'word2'], // Words that go in blanks
  tiles: ['word1', 'word2', 'distractor1', 'distractor2', ...], // All available tiles
  distractors: ['distractor1', 'distractor2', ...], // Wrong answer options
  hints: {
    character: 'Description of who said it',
    context: 'When/why it was said (no spoilers)',
    emoji: '🎌⚡' // Relevant emojis
  },
  source: 'https://anilist.co/anime/...' // Reference URL
}
```

### Method 2: Using the Puzzle Generator

Use the template system in `src/server/utils/puzzleGenerator.ts`:

```typescript
const newTemplate: PuzzleTemplate = {
  anime: 'Your Anime',
  character: 'Character Name',
  difficulty: 'medium',
  quote_original: 'The original quote here',
  hints: {
    character: 'Character description',
    context: 'Context clue',
    emoji: '🎯🔥'
  },
  source: 'https://anilist.co/anime/...'
};

// Generate puzzle automatically
const puzzle = generatePuzzleFromTemplate(newTemplate);
```

## 🎮 Puzzle Design Guidelines

### Quote Selection
- **Length**: Keep quotes under 120 characters
- **Recognition**: Use iconic, memorable lines
- **Safety**: Avoid violence, spoilers, or inappropriate content
- **Clarity**: Quotes should make sense without full context

### Difficulty Levels
- **Easy**: 2 blanks, common words, popular anime
- **Medium**: 2-3 blanks, moderate vocabulary
- **Hard**: 3+ blanks, complex words, lesser-known quotes

### Blank Selection
- Choose **important words** (nouns, verbs, adjectives)
- Avoid **articles** (the, a, an) and **conjunctions** (and, but, or)
- Pick words that are **meaningful** to the quote's impact
- Ensure blanks create a **solvable puzzle**

### Distractor Words
- Same **word type** (noun for noun, verb for verb)
- Similar **length** (±2 characters)
- **Thematically related** but incorrect
- **Plausible alternatives** that could fit grammatically

### Hints
- **Character**: Physical description or notable trait
- **Context**: Arc, situation, or emotional state (no spoilers)
- **Emoji**: Visual clues that hint at the answer

## 🔧 Technical Implementation

### API Endpoints

- `GET /api/init` - Initialize game with user stats and current puzzle
- `GET /api/puzzle/new` - Get a new random puzzle
- `POST /api/puzzle/submit` - Submit solution and get score

### Data Storage (Redis)

- `stats:{username}` - User game statistics
- `current_puzzle:{username}` - User's current puzzle
- `anime_count:{username}:{anime}` - Track favorite anime

### Scoring System

```typescript
const baseScore = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300;
const hintPenalty = hintsUsed * 25;
const finalScore = Math.max(baseScore - hintPenalty, 10);
```

## 🚀 Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run dev
   ```

3. **Deploy to Reddit**:
   ```bash
   npm run deploy
   ```

4. **Publish for review**:
   ```bash
   npm run launch
   ```

## 📊 Analytics & Stats

The game tracks:
- **Total puzzles solved**
- **Average hints used**
- **Current streak**
- **Favorite anime** (most solved)

## 🎨 Customization

### Adding New Anime Series

1. Create puzzles following the format above
2. Add to `ANIME_PUZZLES` array
3. Update the splash screen description if needed
4. Test with `npm run dev`

### Modifying Difficulty

Adjust scoring in `src/server/index.ts`:
```typescript
const baseScore = puzzle.difficulty === 'easy' ? 100 : 
                 puzzle.difficulty === 'medium' ? 200 : 300;
```

### UI Customization

- **Colors**: Edit Tailwind classes in components
- **Layout**: Modify component structure
- **Animations**: Add CSS transitions or animations

## 🐛 Troubleshooting

### Common Issues

1. **Puzzle not loading**: Check console for API errors
2. **Tiles not dragging**: Ensure drag handlers are properly set
3. **Scoring incorrect**: Verify solution validation logic
4. **Hints not showing**: Check hint button state management

### Debug Mode

Add logging to track puzzle state:
```typescript
console.log('Current puzzle:', puzzleState.currentPuzzle);
console.log('Placed tiles:', puzzleState.placedTiles);
```

## 📚 Resources

- [Devvit Documentation](https://developers.reddit.com/docs)
- [AniList API](https://anilist.co/) - For anime references
- [AnimeChan API](https://animechan.vercel.app/) - For quote inspiration
- [Tailwind CSS](https://tailwindcss.com/) - For styling

---

**Happy puzzle creating!** 🎌✨
