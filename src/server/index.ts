import express from 'express';
import { InitResponse, GetPuzzleResponse, SubmitSolutionRequest, SubmitSolutionResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { getRandomPuzzle, getPuzzleById, validateSolution, shuffleArray } from './core/puzzles';
import { GameStats } from '../shared/types/puzzle';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

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
        // Shuffle tiles for variety
        currentPuzzle.tiles = shuffleArray(currentPuzzle.tiles);
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
      
      // Shuffle tiles for variety
      puzzle.tiles = shuffleArray(puzzle.tiles);
      
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
      
      const puzzle = getPuzzleById(puzzleId);
      if (!puzzle) {
        res.status(404).json({
          status: 'error',
          message: 'Puzzle not found'
        });
        return;
      }

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
        
        // Generate next puzzle
        const nextPuzzle = getRandomPuzzle();
        nextPuzzle.tiles = shuffleArray(nextPuzzle.tiles);
        
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
