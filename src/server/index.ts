import express from 'express';
import { InitResponse, GetPuzzleResponse, SubmitSolutionRequest, SubmitSolutionResponse, SubmitCharacterGuessRequest, GetHintRequest, GetHintResponse, GetLeaderboardResponse } from '../shared/types/api';
import { DailyPack, ScoreSubmission, LeaderboardResponse, PuzzleType } from '../shared/types/daily-pack';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { getRandomPuzzle, getPuzzleById, validateSolution, shuffleArray, getCharacterQuizById, validateCharacterGuess } from './core/puzzles';
import { GameStats } from '../shared/types/puzzle';
import { updateUserAnimeStats, getAllLeaderboards, getUserBadges } from './core/leaderboard';
// import { DatabaseService } from './services/database';
// import { PackGenerator } from './services/pack-generator';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

// Initialize services - commented out for now
// const db = new DatabaseService();
// const packGenerator = new PackGenerator();

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
      
      // Get or initialize game stats
      const statsKey = `stats:${username}`;
      const statsData = await redis.get(statsKey);
      const gameStats: GameStats = statsData ? JSON.parse(statsData) : {
        totalPuzzlesSolved: 0,
        averageHintsUsed: 0,
        favoriteAnime: '',
        currentStreak: 0
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
  async (_req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();
      const puzzle = getRandomPuzzle();
      
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
        
        // Update anime-specific leaderboard stats
        await updateUserAnimeStats(username, puzzle.anime, score);
        
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
        
        // Update anime-specific leaderboard stats
        await updateUserAnimeStats(username, quiz.anime, score);
        
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

// Leaderboard API Endpoints
router.get<{}, GetLeaderboardResponse | { status: string; message: string }>(
  '/api/leaderboard',
  async (_req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();
      
      const leaderboards = await getAllLeaderboards(username);
      const userBadges = await getUserBadges(username);
      
      res.json({
        type: 'leaderboard',
        leaderboards,
        userBadges
      });
    } catch (error) {
      console.error('Error getting leaderboards:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get leaderboards'
      });
    }
  }
);

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
