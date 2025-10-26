# 🏆 Anime Leaderboard & Badge System

The Anime Line game now features a comprehensive leaderboard and badge system that tracks user mastery across different anime series.

## 🎖️ Badge System

### Badge Levels
Users earn badges for each anime series based on their performance:

| Badge | Name | Emoji | Requirements | Color |
|-------|------|-------|-------------|-------|
| **Bronze** | Apprentice | 🥉 | 3+ puzzles solved | Amber |
| **Silver** | Scholar | 🥈 | 5+ puzzles, 75+ avg score | Gray |
| **Gold** | Expert | 🥇 | 8+ puzzles, 100+ avg score | Yellow |
| **Platinum** | Master | 💎 | 12+ puzzles, 150+ avg score | Blue |
| **Master** | Legendary | 👑 | 15+ puzzles, 200+ avg score | Purple |

### Badge Calculation
- **Puzzles Solved**: Total number of puzzles completed for that anime
- **Average Score**: Mean score across all puzzles for that anime
- **Both criteria** must be met to earn the badge level

## 🏆 Leaderboard Features

### Per-Anime Leaderboards
- **Separate leaderboard** for each anime series (Naruto, One Piece, JJK, etc.)
- **Top 10 players** displayed for each anime
- **User ranking** shown even if not in top 10
- **Badge display** for each user's mastery level

### Leaderboard Sorting
Users are ranked by:
1. **Average Score** (primary)
2. **Puzzles Solved** (tiebreaker)

### Real-time Updates
- Leaderboards update immediately after puzzle completion
- Badge levels recalculated on each successful solve
- User stats persist across sessions

## 📊 Data Storage (Redis)

### User Anime Stats
```
Key: anime_stats:{username}:{anime}
Value: {
  username: string,
  anime: string,
  puzzlesSolved: number,
  totalScore: number,
  averageScore: number,
  badgeLevel: BadgeLevel,
  lastPlayed: string
}
```

### Anime Leaderboards
```
Key: leaderboard:{anime}
Value: UserAnimeStats[] (top 50 users)
```

## 🎮 User Experience

### Splash Screen
- **Badge Showcase**: Displays user's earned badges
- **Master Count**: Shows number of Legendary/Platinum badges
- **Visual Progress**: Encourages continued play

### In-Game
- **Leaderboard Button**: Access leaderboards during gameplay
- **Badge Progress**: See progress toward next badge level
- **Real-time Updates**: Immediate feedback on achievements

### Leaderboard Modal
- **Anime Selection**: Browse leaderboards by series
- **User Ranking**: See your position and stats
- **Badge Legend**: Understand badge requirements
- **Top Players**: View the best performers

## 🔧 Technical Implementation

### API Endpoints
- `GET /api/leaderboard` - Get all leaderboards and user badges
- Automatic updates via existing puzzle submission endpoints

### Components
- `LeaderboardModal` - Full leaderboard interface
- `BadgeDisplay` - Individual badge with progress
- `BadgeShowcase` - Collection of user's badges

### Utilities
- `badgeUtils.ts` - Badge calculation and info functions
- `leaderboard.ts` - Server-side leaderboard management

## 🎯 Gamification Benefits

### Motivation
- **Clear Progression**: Visual badge system shows advancement
- **Competition**: Leaderboards encourage friendly rivalry
- **Specialization**: Users can focus on favorite anime series
- **Achievement**: Multiple badge levels provide goals

### Retention
- **Long-term Goals**: Master badges require significant commitment
- **Series Exploration**: Encourages trying different anime puzzles
- **Social Proof**: Badges visible to other players
- **Progress Tracking**: Clear metrics for improvement

## 🚀 Future Enhancements

### Potential Additions
- **Global Rankings**: Cross-anime master leaderboard
- **Seasonal Competitions**: Time-limited events
- **Badge Sharing**: Social media integration
- **Achievement Notifications**: Celebrate badge upgrades
- **Streak Tracking**: Consecutive solve bonuses

### Analytics
- **Popular Anime**: Track which series are most played
- **Difficulty Trends**: See which puzzles are hardest
- **User Engagement**: Monitor badge progression rates

## 📈 Success Metrics

### User Engagement
- **Badge Completion Rate**: % of users earning each level
- **Leaderboard Views**: How often users check rankings
- **Series Diversity**: Average anime series played per user
- **Return Rate**: Users coming back to improve rankings

### Game Balance
- **Score Distribution**: Ensure fair badge requirements
- **Puzzle Difficulty**: Balance across anime series
- **Progression Rate**: Time to earn each badge level

---

The leaderboard and badge system transforms Anime Line from a simple puzzle game into a competitive, achievement-driven experience that encourages long-term engagement and mastery across multiple anime series! 🌟
