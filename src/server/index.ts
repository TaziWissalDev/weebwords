import express from 'express';
import { InitResponse, GetPuzzleResponse, SubmitSolutionRequest, SubmitSolutionResponse, SubmitCharacterGuessRequest, GetHintRequest, GetHintResponse, GetLeaderboardResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { getRandomPuzzle, getPuzzleById, validateSolution, getCharacterQuizById, validateCharacterGuess } from './core/puzzles';
import { GameStats } from '../shared/types/puzzle';
import { 
  updateUserAnimeStats, 
  getAllLeaderboards, 
  getUserBadges, 
  getAnimeLeaderboard,
  getGlobalLeaderboard,
  getTotalPlayersForAnime
} from './core/leaderboard';
import { DatabaseService } from './services/databaseService';
import { DailyPuzzleManager } from './services/dailyPuzzleManager';
// import { DatabaseService } from './services/database';
// import { PackGenerator } from './services/pack-generator';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

// Initialize services
let dailyPuzzleManager: DailyPuzzleManager | null = null;

// Initialize daily puzzle manager if AI keys are available
try {
  dailyPuzzleManager = new DailyPuzzleManager();
} catch (error) {
  console.warn('⚠️ Daily puzzle manager not initialized:', error instanceof Error ? error.message : 'Unknown error');
}

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }
      
      // Get or create user in database
      let user = await DatabaseService.getUser(username);
      if (!user) {
        user = await DatabaseService.createOrUpdateUser(username, {});
        await DatabaseService.registerUser(username);
      }

      // Update energy if needed (every 10 minutes)
      const now = Date.now();
      const lastReset = new Date(user.last_energy_reset).getTime();
      const timeDiff = now - lastReset;
      const resetInterval = 10 * 60 * 1000; // 10 minutes

      if (timeDiff >= resetInterval) {
        const energyToAdd = Math.floor(timeDiff / resetInterval);
        const newEnergy = Math.min(user.energy + energyToAdd, user.max_energy);
        user = await DatabaseService.updateUserEnergy(username, newEnergy);
      }

      // Convert to GameStats format
      const gameStats: GameStats = {
        totalPuzzlesSolved: user.total_puzzles_solved,
        averageHintsUsed: 0, // Calculate from recent games
        favoriteAnime: user.favorite_anime || '',
        currentStreak: user.current_streak,
        hearts: user.hearts,
        maxHearts: user.max_hearts,
        energy: user.energy,
        maxEnergy: user.max_energy,
        lastEnergyReset: new Date(user.last_energy_reset).getTime(),
        badges: [],
        unlockedBadges: [],
        level: user.level,
        experience: user.experience
      };

      // Get current puzzle or create new one
      const currentPuzzleKey = `current_puzzle:${username}`;
      const currentPuzzleData = await redis.get(currentPuzzleKey);
      let currentPuzzle = null;
      
      if (currentPuzzleData) {
        currentPuzzle = JSON.parse(currentPuzzleData);
      } else {
        // Generate new puzzle
        currentPuzzle = getRandomPuzzle();
        await redis.set(currentPuzzleKey, JSON.stringify(currentPuzzle));
      }

      res.json({
        type: 'init',
        postId: postId,
        username: username ?? 'anonymous',
        currentPuzzle,
        gameStats
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.get<{}, GetPuzzleResponse | { status: string; message: string }>(
  '/api/puzzle/new',
  async (req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();
      const { anime, difficulty, useDailyPuzzles } = req.query;
      
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }
      
      let puzzle;
      
      // Try to use daily puzzles if available and requested
      if (useDailyPuzzles === 'true' && dailyPuzzleManager) {
        try {
          puzzle = await dailyPuzzleManager.getRandomPuzzleFromToday(
            anime as string, 
            difficulty as string
          );
          console.log('🎯 Using AI-generated daily puzzle');
        } catch (error) {
          console.log('⚠️ Daily puzzle not available, falling back to static puzzles');
          puzzle = getRandomPuzzle();
        }
      } else {
        // Use static puzzles
        puzzle = getRandomPuzzle();
        console.log('📚 Using static puzzle');
      }
      
      // Store as current puzzle
      const currentPuzzleKey = `current_puzzle:${username}`;
      await redis.set(currentPuzzleKey, JSON.stringify(puzzle));

      res.json({
        type: 'puzzle',
        puzzle
      });
    } catch (error) {
      console.error('Error generating new puzzle:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate new puzzle'
      });
    }
  }
);

router.post<{}, SubmitSolutionResponse | { status: string; message: string }, SubmitSolutionRequest>(
  '/api/puzzle/submit',
  async (req, res): Promise<void> => {
    try {
      const { puzzleId, solution, hintsUsed } = req.body;
      const username = await reddit.getCurrentUsername();
      
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }
      
      const gamePuzzle = getPuzzleById(puzzleId);
      if (!gamePuzzle || gamePuzzle.type !== 'word-puzzle' || !gamePuzzle.wordPuzzle) {
        res.status(404).json({
          status: 'error',
          message: 'Word puzzle not found'
        });
        return;
      }

      const puzzle = gamePuzzle.wordPuzzle;
      const isCorrect = validateSolution(puzzle, solution);
      let score = 0;
      
      if (isCorrect) {
        // Calculate score based on difficulty and hints used
        const baseScore = puzzle.difficulty === 'easy' ? 100 : puzzle.difficulty === 'medium' ? 200 : 300;
        const hintPenalty = hintsUsed * 25;
        score = Math.max(baseScore - hintPenalty, 10);
        
        // Update game stats
        const statsKey = `stats:${username}`;
        const statsData = await redis.get(statsKey);
        const gameStats: GameStats = statsData ? JSON.parse(statsData) : {
          totalPuzzlesSolved: 0,
          averageHintsUsed: 0,
          favoriteAnime: '',
          currentStreak: 0
        };
        
        gameStats.totalPuzzlesSolved += 1;
        gameStats.currentStreak += 1;
        gameStats.averageHintsUsed = ((gameStats.averageHintsUsed * (gameStats.totalPuzzlesSolved - 1)) + hintsUsed) / gameStats.totalPuzzlesSolved;
        
        // Track favorite anime
        const animeCountKey = `anime_count:${username}:${puzzle.anime}`;
        const animeCount = await redis.incrBy(animeCountKey, 1);
        if (!gameStats.favoriteAnime || animeCount > 1) {
          gameStats.favoriteAnime = puzzle.anime;
        }
        
        await redis.set(statsKey, JSON.stringify(gameStats));
        
        // Update database with score and stats
        await DatabaseService.addPuzzleScore(username, {
          puzzle_id: puzzleId,
          puzzle_type: 'word-puzzle',
          anime: puzzle.anime,
          character: puzzle.character,
          difficulty: puzzle.difficulty,
          score,
          max_possible_score: baseScore,
          hints_used: hintsUsed,
          date: new Date().toISOString().split('T')[0]
        });

        // Update global leaderboard
        await DatabaseService.updateGlobalLeaderboard(username);
        
        // Track daily stats
        await DatabaseService.incrementDailyStats('puzzles_solved');
        await DatabaseService.incrementDailyStats('total_score', score);

        // Update anime-specific leaderboard stats (legacy)
        await updateUserAnimeStats(username, puzzle.anime, score, puzzle.difficulty, 'word-puzzle');
        
        // Generate next puzzle
        const nextPuzzle = getRandomPuzzle();
        
        const currentPuzzleKey = `current_puzzle:${username}`;
        await redis.set(currentPuzzleKey, JSON.stringify(nextPuzzle));
        
        res.json({
          type: 'solution',
          isCorrect: true,
          score,
          nextPuzzle
        });
      } else {
        // Reset streak on wrong answer
        const statsKey = `stats:${username}`;
        const statsData = await redis.get(statsKey);
        if (statsData) {
          const gameStats: GameStats = JSON.parse(statsData);
          gameStats.currentStreak = 0;
          await redis.set(statsKey, JSON.stringify(gameStats));
        }
        
        res.json({
          type: 'solution',
          isCorrect: false,
          score: 0
        });
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit solution'
      });
    }
  }
);

// Character quiz endpoints
router.post<{}, GetHintResponse | { status: string; message: string }, GetHintRequest>(
  '/api/character/hint',
  async (req, res): Promise<void> => {
    try {
      const { quizId, hintNumber } = req.body;
      
      const quiz = getCharacterQuizById(quizId);
      if (!quiz) {
        res.status(404).json({
          status: 'error',
          message: 'Character quiz not found'
        });
        return;
      }

      let hint = '';
      let characterResponse = '';
      
      switch (hintNumber) {
        case 1:
          hint = quiz.hints.hint1;
          characterResponse = quiz.hintResponses.hint1Response;
          break;
        case 2:
          hint = quiz.hints.hint2;
          characterResponse = quiz.hintResponses.hint2Response;
          break;
        case 3:
          hint = quiz.hints.hint3;
          characterResponse = quiz.hintResponses.hint3Response;
          break;
        case 4:
          hint = quiz.hints.finalHint;
          characterResponse = quiz.hintResponses.finalHintResponse;
          break;
        default:
          res.status(400).json({
            status: 'error',
            message: 'Invalid hint number'
          });
          return;
      }

      res.json({
        type: 'hint',
        hint,
        characterResponse
      });
    } catch (error) {
      console.error('Error getting hint:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get hint'
      });
    }
  }
);

router.post<{}, SubmitSolutionResponse | { status: string; message: string }, SubmitCharacterGuessRequest>(
  '/api/character/submit',
  async (req, res): Promise<void> => {
    try {
      const { quizId, guess, hintsUsed } = req.body;
      const username = await reddit.getCurrentUsername();
      
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }
      
      const quiz = getCharacterQuizById(quizId);
      if (!quiz) {
        res.status(404).json({
          status: 'error',
          message: 'Character quiz not found'
        });
        return;
      }

      const isCorrect = validateCharacterGuess(quiz, guess);
      let score = 0;
      
      if (isCorrect) {
        // Calculate score based on difficulty and hints used
        const baseScore = quiz.difficulty === 'easy' ? 150 : quiz.difficulty === 'medium' ? 250 : 350;
        const hintPenalty = hintsUsed * 30;
        score = Math.max(baseScore - hintPenalty, 15);
        
        // Update game stats
        const statsKey = `stats:${username}`;
        const statsData = await redis.get(statsKey);
        const gameStats: GameStats = statsData ? JSON.parse(statsData) : {
          totalPuzzlesSolved: 0,
          averageHintsUsed: 0,
          favoriteAnime: '',
          currentStreak: 0
        };
        
        gameStats.totalPuzzlesSolved += 1;
        gameStats.currentStreak += 1;
        gameStats.averageHintsUsed = ((gameStats.averageHintsUsed * (gameStats.totalPuzzlesSolved - 1)) + hintsUsed) / gameStats.totalPuzzlesSolved;
        
        // Track favorite anime
        const animeCountKey = `anime_count:${username}:${quiz.anime}`;
        const animeCount = await redis.incrBy(animeCountKey, 1);
        if (!gameStats.favoriteAnime || animeCount > 1) {
          gameStats.favoriteAnime = quiz.anime;
        }
        
        await redis.set(statsKey, JSON.stringify(gameStats));
        
        // Update database with score and stats
        await DatabaseService.addPuzzleScore(username, {
          puzzle_id: quizId,
          puzzle_type: 'character-guess',
          anime: quiz.anime,
          character: quiz.character,
          difficulty: quiz.difficulty,
          score,
          max_possible_score: baseScore,
          hints_used: hintsUsed,
          date: new Date().toISOString().split('T')[0]
        });

        // Update global leaderboard
        await DatabaseService.updateGlobalLeaderboard(username);
        
        // Track daily stats
        await DatabaseService.incrementDailyStats('puzzles_solved');
        await DatabaseService.incrementDailyStats('total_score', score);

        // Update anime-specific leaderboard stats (legacy)
        await updateUserAnimeStats(username, quiz.anime, score, quiz.difficulty, 'character-guess');
        
        // Generate next puzzle
        const nextPuzzle = getRandomPuzzle();
        
        const currentPuzzleKey = `current_puzzle:${username}`;
        await redis.set(currentPuzzleKey, JSON.stringify(nextPuzzle));
        
        res.json({
          type: 'solution',
          isCorrect: true,
          score,
          nextPuzzle
        });
      } else {
        // Reset streak on wrong answer
        const statsKey = `stats:${username}`;
        const statsData = await redis.get(statsKey);
        if (statsData) {
          const gameStats: GameStats = JSON.parse(statsData);
          gameStats.currentStreak = 0;
          await redis.set(statsKey, JSON.stringify(gameStats));
        }
        
        res.json({
          type: 'solution',
          isCorrect: false,
          score: 0
        });
      }
    } catch (error) {
      console.error('Error submitting character guess:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit character guess'
      });
    }
  }
);

// Comprehensive Leaderboard API Endpoints
router.get<{}, GetLeaderboardResponse | { status: string; message: string }>(
  '/api/leaderboard',
  async (req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();
      const { anime } = req.query;
      
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }
      
      if (anime && anime !== 'all') {
        // Get specific anime leaderboard
        const leaderboard = await getAnimeLeaderboard(anime as string, username);
        const userBadges = await getUserBadges(username);
        
        res.json({
          type: 'leaderboard',
          leaderboards: [leaderboard],
          userBadges
        });
      } else {
        // Get all leaderboards
        const leaderboards = await getAllLeaderboards(username);
        const userBadges = await getUserBadges(username);
        
        res.json({
          type: 'leaderboard',
          leaderboards,
          userBadges
        });
      }
    } catch (error) {
      console.error('Error getting leaderboards:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get leaderboards'
      });
    }
  }
);

// Global leaderboard endpoint
router.get('/api/leaderboard/global', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
      return;
    }
    
    const globalLeaderboard = await getGlobalLeaderboard(username);
    
    res.json({
      type: 'global-leaderboard',
      ...globalLeaderboard
    });
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get global leaderboard'
    });
  }
});

// Submit score endpoint
router.post('/api/leaderboard/score', async (req, res): Promise<void> => {
  try {
    const { anime, score, difficulty, puzzleType } = req.body;
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
      return;
    }
    
    if (!anime || typeof score !== 'number') {
      res.status(400).json({
        status: 'error',
        message: 'Anime and score are required'
      });
      return;
    }
    
    // Update user stats and leaderboard
    await updateUserAnimeStats(username, anime, score, difficulty, puzzleType);
    
    // Get updated rank
    const leaderboard = await getAnimeLeaderboard(anime, username);
    const userRank = leaderboard.userRank || 0;
    
    res.json({
      status: 'success',
      message: 'Score submitted successfully',
      newRank: userRank,
      anime,
      score
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit score'
    });
  }
});

// Get user rank endpoint
router.get('/api/leaderboard/rank/:anime', async (req, res): Promise<void> => {
  try {
    const { anime } = req.params;
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
      return;
    }
    
    const leaderboard = await getAnimeLeaderboard(anime, username);
    
    res.json({
      anime,
      rank: leaderboard.userRank || 0,
      stats: leaderboard.userStats,
      totalPlayers: await getTotalPlayersForAnime(anime)
    });
  } catch (error) {
    console.error('Error getting user rank:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user rank'
    });
  }
});

// Get user's complete profile
router.get('/api/profile', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
      return;
    }
    
    const user = await DatabaseService.getUser(username);
    const badges = await DatabaseService.getUserBadges(username);
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.json({
      type: 'profile',
      username: user.username,
      totalScore: user.total_score,
      totalPuzzlesSolved: user.total_puzzles_solved,
      currentStreak: user.current_streak,
      bestStreak: user.best_streak,
      favoriteAnime: user.favorite_anime,
      level: user.level,
      experience: user.experience,
      hearts: user.hearts,
      maxHearts: user.max_hearts,
      energy: user.energy,
      maxEnergy: user.max_energy,
      badges
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile'
    });
  }
});

// Home page statistics
router.get('/api/home/stats', async (_req, res): Promise<void> => {
  try {
    const homeStats = await DatabaseService.getHomePageStats();
    
    res.json({
      type: 'home-stats',
      ...homeStats
    });
  } catch (error) {
    console.error('Error getting home stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get home statistics'
    });
  }
});

// Daily challenge leaderboard
router.get('/api/daily-challenge/leaderboard', async (req, res): Promise<void> => {
  try {
    const { date } = req.query;
    const challengeDate = (typeof date === 'string' && date) ? date : new Date().toISOString().split('T')[0];
    
    const leaderboard = await DatabaseService.getDailyLeaderboard(challengeDate as string, 20);
    
    res.json({
      type: 'daily-challenge-leaderboard',
      date: challengeDate,
      leaderboard
    });
  } catch (error) {
    console.error('Error getting daily challenge leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily challenge leaderboard'
    });
  }
});

// Submit daily challenge score
router.post('/api/daily-challenge/score', async (req, res): Promise<void> => {
  try {
    const { score, completion_time, puzzles_completed, hints_used } = req.body;
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
      return;
    }
    
    const challengeDate = new Date().toISOString().split('T')[0];
    
    const challengeScore = await DatabaseService.addDailyChallengeScore(username as string, challengeDate, {
      score,
      completion_time,
      puzzles_completed,
      hints_used
    });
    
    // Update daily stats
    await DatabaseService.incrementDailyStats('daily_challenges_completed');
    await DatabaseService.incrementDailyStats('daily_challenge_score', score);
    
    res.json({
      status: 'success',
      message: 'Daily challenge score submitted',
      challengeScore
    });
  } catch (error) {
    console.error('Error submitting daily challenge score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit daily challenge score'
    });
  }
});

// Update user hearts (when spending on hints)
router.post('/api/user/hearts', async (req, res): Promise<void> => {
  try {
    const { hearts } = req.body;
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
      return;
    }
    
    const user = await DatabaseService.updateUserHearts(username, hearts);
    
    res.json({
      status: 'success',
      hearts: user?.hearts || 0
    });
  } catch (error) {
    console.error('Error updating user hearts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update hearts'
    });
  }
});

// Daily Puzzle API Endpoints
router.get('/api/daily-puzzles', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured'
      });
      return;
    }

    const puzzles = await dailyPuzzleManager.getTodaysPuzzles();
    res.json(puzzles);
  } catch (error) {
    console.error('Error getting daily puzzles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily puzzles'
    });
  }
});

router.get('/api/daily-puzzles/random', async (req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured'
      });
      return;
    }

    const { anime, difficulty } = req.query;
    const puzzle = await dailyPuzzleManager.getRandomPuzzleFromToday(
      anime as string, 
      difficulty as string
    );
    
    res.json({
      type: 'daily-puzzle',
      puzzle
    });
  } catch (error) {
    console.error('Error getting random daily puzzle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get random daily puzzle'
    });
  }
});

router.get('/api/daily-puzzles/status', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.json({
        available: false,
        reason: 'No AI API keys configured'
      });
      return;
    }

    const status = await dailyPuzzleManager.getGenerationStatus();
    res.json({
      available: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting daily puzzle status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily puzzle status'
    });
  }
});

router.post('/api/daily-puzzles/regenerate', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured'
      });
      return;
    }

    console.log('🔄 Manual regeneration requested');
    const puzzles = await dailyPuzzleManager.forceRegenerateToday();
    
    res.json({
      status: 'success',
      message: 'Daily puzzles regenerated successfully',
      totalPuzzles: puzzles.totalPuzzles
    });
  } catch (error) {
    console.error('Error regenerating daily puzzles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to regenerate daily puzzles'
    });
  }
});

// Daily Pack API Endpoints - commented out for now since we're using mock data
/*
// GET /api/daily-pack - Returns today's puzzle pack
router.get('/api/daily-pack', async (_req, res): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if pack already exists for today
    let pack = db.getDailyPack(today);
    
    if (!pack) {
      // Generate new pack for today
      pack = packGenerator.generateDailyPack(today);
      db.saveDailyPack(today, pack);
    }
    
    res.json(pack);
  } catch (error) {
    console.error('Error getting daily pack:', error);
    res.status(500).json({
      error: 'Failed to get daily pack',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
*/

/*
// POST /api/score - Submit score and get updated rank
router.post('/api/score', async (req, res): Promise<void> => {
  // Commented out for now - using mock data
});

// GET /api/leaderboard - Get leaderboard for specific type or global  
router.get('/api/leaderboard', async (req, res): Promise<void> => {
  // Commented out for now - using mock data
});

// GET /api/user-rank - Get user's current rank
router.get('/api/user-rank', async (req, res): Promise<void> => {
  // Commented out for now - using mock data
});
*/

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
