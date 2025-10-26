# Daily Anime Puzzle Pack 🎌

A Reddit-ready daily anime puzzle game with 5 different puzzle types, leaderboards, and pixel emoji reactions.

## Features

### 🧩 Puzzle Types
- **Quote Fill**: Fill missing words in anime quotes
- **Emoji Sensei**: Express quotes with appropriate emojis  
- **Who Said It**: Multiple choice speaker identification
- **Mood Match**: Pick the right emotion emoji for the context
- **Who Am I**: First-person character riddles with hint system

### 🏆 Scoring & Leaderboards
- Per-type rankings + global leaderboard
- Streak bonuses and speed scoring
- Hint penalties (Who Am I: -20 points per hint)
- Semantic similarity scoring for Emoji Sensei

### 🎭 Pixel Reactions
- Character-specific pixel emoji animations
- Trigger on correct/failed answers
- Fallback to puzzle-type defaults

### 📊 Content Pipeline
- Daily mixed puzzle packs (6-10 puzzles)
- Attributed quotes ≤120 characters
- Duplicate prevention via content hashing
- Funny anime-style feedback (4 tiers)

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd daily-anime-puzzle-pack
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Generate today's puzzle pack:**
   ```bash
   npm run generate-pack
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### GET /api/daily-pack
Returns today's puzzle pack with 6-10 mixed puzzles.

**Response:**
```json
{
  "meta": {
    "date": "2024-01-15",
    "language": "en", 
    "pack": "daily-2024-01-15"
  },
  "puzzles": [
    {
      "id": "quote_fill_123",
      "type": "quote_fill",
      "anime": "Naruto",
      "character": "Naruto Uzumaki",
      "data": {
        "quote": "I never go back on my ____!",
        "options": ["word", "promise", "ninja", "way"],
        "correct": [0],
        "original": "I never go back on my word!"
      },
      "feedback": {
        "perfect": "Naruto: Perfect! You know my words by heart!",
        "good": "Naruto: Well done! You understand me!",
        "average": "Naruto: Not bad, but you can do better!",
        "bad": "Naruto: Did you even listen to what I said?"
      },
      "pixel_reaction": {
        "on_correct": "naruto_cheer",
        "on_fail": "naruto_disappointed"
      }
    }
  ]
}
```

### POST /api/score
Submit puzzle completion score.

**Request:**
```json
{
  "user": "u/AnimeExpert",
  "puzzleId": "quote_fill_123", 
  "type": "quote_fill",
  "metrics": {
    "timeMs": 15000,
    "hintsUsed": 0,
    "accuracy": 1.0
  }
}
```

**Response:**
```json
{
  "success": true,
  "rank": 42,
  "message": "Score submitted successfully"
}
```

### GET /api/leaderboard?type=quote_fill
Get leaderboard for specific puzzle type or global.

**Parameters:**
- `type`: `quote_fill` | `emoji_sensei` | `who_said_it` | `mood_match` | `who_am_i` | `global`
- `limit`: Number of entries (default: 50)

**Response:**
```json
{
  "type": "quote_fill",
  "date": "2024-01-15",
  "entries": [
    {
      "rank": 1,
      "user": "u/AnimeExpert", 
      "score": 2847,
      "streak": 12
    }
  ]
}
```

## Database Schema

The system uses SQLite with the following tables:
- `users` - User accounts
- `daily_packs` - Generated puzzle packs by date
- `puzzle_templates` - Reusable puzzle content
- `scores` - User puzzle completion scores  
- `user_stats` - Streaks, badges, and statistics

## Development

### Generate New Daily Pack
```bash
npm run generate-pack
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm run deploy  # For Reddit/Devvit deployment
```

## Configuration

Key environment variables:
- `DATABASE_PATH`: SQLite database file location
- `PORT`: Server port (default: 3000)
- `DAILY_PACK_SIZE`: Number of puzzles per pack (default: 8)
- `MAX_LEADERBOARD_SIZE`: Max leaderboard entries (default: 100)

## Content Guidelines

- Quotes ≤120 characters
- No plot-critical spoilers
- No NSFW content or slurs
- Properly attributed to anime/character
- Duplicate prevention via content hashing

## Scoring System

- **Base Score**: Accuracy × 100
- **Speed Bonus**: Up to +20 points for fast completion
- **Hint Penalty**: -20 points per hint (Who Am I only)
- **Emoji Sensei**: Semantic similarity × 100
- **Streaks**: Consecutive daily completions

## License

BSD-3-Clause
