# 🤖 AI-Powered Daily Puzzle Setup Guide

This guide explains how to set up AI-powered daily puzzle generation for your Anime Line game.

## 🎯 Overview

The AI system generates **5 fresh puzzles per anime per difficulty level every day**, creating:

- **90 total puzzles daily** (6 animes × 3 difficulties × 5 puzzles)
- **Word puzzles** with authentic character quotes
- **Character guessing quizzes** with progressive hints
- **Automatic daily refresh** at midnight UTC

## 🔑 API Key Setup

### Option 1: OpenAI (Recommended - Devvit Approved)

1. **Sign up** at [https://platform.openai.com](https://platform.openai.com)
2. **Create API key** in API settings
3. **Add to environment**:
   ```bash
   OPENAI_API_KEY=sk-your_api_key_here
   ```

**Benefits:**

- 🧠 High-quality generation
- 📚 Excellent anime knowledge
- 🎨 Creative puzzle variety

### Option 2: Google Gemini (Alternative - Devvit Approved)

1. **Sign up** at [https://console.cloud.google.com](https://console.cloud.google.com)
2. **Enable Generative Language API**
3. **Create API key** in credentials
4. **Add to environment**:
   ```bash
   GOOGLE_API_KEY=your_google_api_key_here
   ```

**Benefits:**

- 🧠 High-quality generation
- 📚 Excellent anime knowledge
- 🆓 Generous free tier
- ✅ Devvit approved

## 🚀 Environment Setup

### Local Development (.env file)

```bash
# Choose ONE of these Devvit-approved providers
OPENAI_API_KEY=sk-your_openai_key_here
# OR
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Redis configuration (uses Devvit's Redis by default)
# REDIS_URL=redis://localhost:6379
```

### Production Deployment

Set environment variables in your hosting platform:

**Vercel:**

```bash
vercel env add OPENAI_API_KEY
```

**Railway:**

```bash
railway variables set OPENAI_API_KEY=sk-your_key_here
```

**Heroku:**

```bash
heroku config:set OPENAI_API_KEY=sk-your_key_here
```

## 🎮 How It Works

### Daily Generation Process

```typescript
// Automatic daily generation
6 animes × 3 difficulties × 5 puzzles = 90 puzzles/day

Supported Animes:
- Naruto
- One Piece
- Attack on Titan
- Demon Slayer
- Jujutsu Kaisen
- My Hero Academia

Difficulty Levels:
- Easy: Simple vocabulary, well-known characters
- Medium: Moderate complexity, mix of characters
- Hard: Complex vocabulary, obscure references
```

### Puzzle Types Generated

**Word Puzzles:**

```json
{
  "character": "Naruto Uzumaki",
  "quote_original": "I will never give up, dattebayo!",
  "quote_puzzle": "I will never ____ ____, dattebayo!",
  "blanks": ["give", "up"],
  "tiles": ["give", "up", "back", "down", "stop", "quit"],
  "hints": {
    "character": "Orange jumpsuit ninja with whiskers",
    "context": "His never-give-up attitude",
    "emoji": "🍃💪"
  }
}
```

**Character Quizzes:**

```json
{
  "character": "Tanjiro Kamado",
  "hints": {
    "hint1": "Has a distinctive scar on forehead",
    "hint2": "Uses water breathing techniques",
    "hint3": "Has a demon sister he protects",
    "finalHint": "Main character of Demon Slayer"
  },
  "hintResponses": {
    "hint1Response": "This scar? It's from protecting my family!",
    "hint2Response": "Water breathing, first form!",
    "hint3Response": "Nezuko is precious to me!",
    "finalHintResponse": "I'm Tanjiro Kamado!"
  }
}
```

## 🎯 API Endpoints

### Get Daily Puzzle Status

```typescript
GET / api / daily - puzzles / status;
// Returns: generation status, puzzle count, timing
```

### Get Today's Puzzles

```typescript
GET / api / daily - puzzles;
// Returns: complete daily puzzle collection
```

### Get Random Daily Puzzle

```typescript
GET /api/daily-puzzles/random?anime=Naruto&difficulty=easy
// Returns: random puzzle matching criteria
```

### Force Regeneration

```typescript
POST / api / daily - puzzles / regenerate;
// Triggers fresh puzzle generation
```

## 🔧 Integration with Game

### Enable AI Mode

```typescript
// In your game component
const [dailyModeEnabled, setDailyModeEnabled] = useState(true);

// Get AI-generated puzzle
const puzzle = await DailyPuzzleService.getNewPuzzle(
  selectedAnime,
  selectedDifficulty,
  dailyModeEnabled // prefer daily puzzles
);
```

### Fallback System

```typescript
// Automatic fallback to static puzzles if AI unavailable
try {
  const aiPuzzle = await DailyPuzzleService.getRandomDailyPuzzle();
  return aiPuzzle;
} catch (error) {
  console.log('AI puzzles unavailable, using static puzzles');
  return MockDataService.getRandomPuzzle();
}
```

## 📊 Monitoring & Management

### Daily Puzzle Status Component

```typescript
<DailyPuzzleStatus
  onToggleDailyMode={setDailyModeEnabled}
  dailyModeEnabled={dailyModeEnabled}
/>
```

**Features:**

- ✅ Shows generation status
- 🔄 Manual refresh button
- 🎲 Force regeneration
- ⚙️ Enable/disable AI mode

### Console Logging

```bash
🤖 Using OpenAI/Gemini AI for puzzle generation
🎯 Generating puzzles for 6 animes x 3 difficulties
🎨 Generating Naruto easy puzzles...
✅ Generated 10 puzzles for Naruto easy
🎉 Generated 90 total puzzles for 2024-01-15
💾 Cached daily puzzles for 24 hours
```

## 💰 Cost Estimation

### Google Gemini (Recommended)

- **Free tier**: 15 requests/minute, 1,500 requests/day
- **Daily usage**: ~18 requests (6 animes × 3 difficulties)
- **Cost**: FREE for most usage

### OpenAI GPT-3.5-Turbo

- **Cost**: ~$0.002 per puzzle generation
- **Daily cost**: ~$0.18 (90 puzzles)
- **Monthly cost**: ~$5.40

### Google Gemini Pro

- **Cost**: ~$0.0005 per puzzle generation
- **Daily cost**: ~$0.045 (90 puzzles)
- **Monthly cost**: ~$1.35

## 🚨 Troubleshooting

### No AI Provider Available

```bash
⚠️ No AI API keys found. Daily puzzle generation will be disabled.
```

**Solution**: Add at least one API key to environment variables

### Rate Limiting

```bash
❌ Failed to generate puzzles for Naruto easy: API rate limit
```

**Solution**: Add delays between requests or upgrade API plan

### Invalid API Key

```bash
❌ OpenAI API error: 401
```

**Solution**: Verify API key is correct and has sufficient credits

### Generation Failures

```bash
⚠️ Daily puzzle not available, falling back to static puzzles
```

**Solution**: Check API key, network connection, and service status

## 🎉 Benefits of AI Generation

### For Players

- 🆕 **Fresh content daily** - never see the same puzzle twice
- 🎯 **Authentic quotes** - AI generates character-appropriate dialogue
- 📈 **Scalable difficulty** - perfect progression from easy to hard
- 🌟 **Variety** - different puzzle styles and approaches

### For Developers

- 🤖 **Automated content** - no manual puzzle creation needed
- 📊 **Consistent quality** - AI maintains puzzle standards
- 🔄 **Easy updates** - add new animes by updating the database
- 💾 **Efficient caching** - puzzles cached for 24 hours

---

With AI-powered daily puzzle generation, your Anime Line game will have unlimited fresh content that keeps players engaged every single day! 🎌✨
