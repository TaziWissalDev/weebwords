import express from 'express';
import {
  InitResponse,
  GetPuzzleResponse,
  SubmitSolutionRequest,
  SubmitSolutionResponse,
  SubmitCharacterGuessRequest,
  GetHintRequest,
  GetHintResponse,
  GetLeaderboardResponse,
} from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import {
  getRandomPuzzle,
  getPuzzleById,
  validateSolution,
  getCharacterQuizById,
  validateCharacterGuess,
} from './core/puzzles';
import { GameStats } from '../shared/types/puzzle';
import {
  updateUserAnimeStats,
  getAllLeaderboards,
  getUserBadges,
  getAnimeLeaderboard,
  getTotalPlayersForAnime,
} from './core/leaderboard';
import { DatabaseService } from './services/databaseService';
import { DailyPuzzleManager } from './services/dailyPuzzleManager';
import { getRandomAnimeGuessQuiz, getAnimeGuessQuizById } from './data/animeGuessQuizzes';
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
  console.warn(
    '⚠️ Daily puzzle manager not initialized:',
    error instanceof Error ? error.message : 'Unknown error'
  );
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
          message: 'User not authenticated',
        });
        return;
      }

      // Track active player
      await DatabaseService.trackActivePlayer(username);

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
        experience: user.experience,
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
        gameStats,
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
          message: 'User not authenticated',
        });
        return;
      }

      let puzzle;
      let attempts = 0;
      const maxAttempts = 10;

      // Get list of used puzzles to avoid repetition
      const usedPuzzles = await DatabaseService.getUsedPuzzles(username);

      do {
        attempts++;

        // Try to use daily puzzles if available and requested
        if (useDailyPuzzles === 'true' && dailyPuzzleManager) {
          try {
            puzzle = await dailyPuzzleManager.getRandomPuzzleFromToday(
              anime as string,
              difficulty as string
            );

            // Track puzzle usage for automatic generation
            if (anime && difficulty) {
              await dailyPuzzleManager.trackPuzzleUsage(anime as string, difficulty as string);
            }

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

        // Check if this puzzle has been used
        const puzzleId =
          puzzle.type === 'word-puzzle' ? puzzle.wordPuzzle?.id : puzzle.characterQuiz?.id;

        if (!puzzleId || !usedPuzzles.includes(puzzleId)) {
          break; // Found an unused puzzle
        }

        console.log(`🔄 Puzzle ${puzzleId} already used, trying another... (attempt ${attempts})`);
      } while (attempts < maxAttempts);

      // If we couldn't find an unused puzzle after max attempts, clear the used puzzles and start fresh
      if (attempts >= maxAttempts) {
        console.log('🔄 Max attempts reached, clearing used puzzles for fresh start');
        await DatabaseService.clearUsedPuzzles(username);

        // Generate one more puzzle after clearing
        if (useDailyPuzzles === 'true' && dailyPuzzleManager) {
          try {
            puzzle = await dailyPuzzleManager.getRandomPuzzleFromToday(
              anime as string,
              difficulty as string
            );
          } catch (error) {
            puzzle = getRandomPuzzle();
          }
        } else {
          puzzle = getRandomPuzzle();
        }
      }

      // Store as current puzzle
      const currentPuzzleKey = `current_puzzle:${username}`;
      await redis.set(currentPuzzleKey, JSON.stringify(puzzle));

      res.json({
        type: 'puzzle',
        puzzle,
      });
    } catch (error) {
      console.error('Error generating new puzzle:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate new puzzle',
      });
    }
  }
);

router.post<
  {},
  SubmitSolutionResponse | { status: string; message: string },
  SubmitSolutionRequest
>('/api/puzzle/submit', async (req, res): Promise<void> => {
  try {
    const { puzzleId, solution, hintsUsed } = req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const gamePuzzle = getPuzzleById(puzzleId);
    if (!gamePuzzle || gamePuzzle.type !== 'word-puzzle' || !gamePuzzle.wordPuzzle) {
      res.status(404).json({
        status: 'error',
        message: 'Word puzzle not found',
      });
      return;
    }

    const puzzle = gamePuzzle.wordPuzzle;
    const isCorrect = validateSolution(puzzle, solution);
    let score = 0;

    if (isCorrect) {
      // Calculate score based on difficulty and hints used
      const baseScore =
        puzzle.difficulty === 'easy' ? 100 : puzzle.difficulty === 'medium' ? 200 : 300;
      const hintPenalty = hintsUsed * 25;
      score = Math.max(baseScore - hintPenalty, 10);

      // Update game stats
      const statsKey = `stats:${username}`;
      const statsData = await redis.get(statsKey);
      const gameStats: GameStats = statsData
        ? JSON.parse(statsData)
        : {
            totalPuzzlesSolved: 0,
            averageHintsUsed: 0,
            favoriteAnime: '',
            currentStreak: 0,
          };

      gameStats.totalPuzzlesSolved += 1;
      gameStats.currentStreak += 1;
      gameStats.averageHintsUsed =
        (gameStats.averageHintsUsed * (gameStats.totalPuzzlesSolved - 1) + hintsUsed) /
        gameStats.totalPuzzlesSolved;

      // Track favorite anime
      const animeCountKey = `anime_count:${username}:${puzzle.anime}`;
      const animeCount = await redis.incrBy(animeCountKey, 1);
      if (!gameStats.favoriteAnime || animeCount > 1) {
        gameStats.favoriteAnime = puzzle.anime;
      }

      await redis.set(statsKey, JSON.stringify(gameStats));

      // Mark puzzle as used to prevent repetition
      await DatabaseService.markPuzzleAsUsed(username, puzzleId);

      // Update max score if this is a new record
      const maxScoreResult = await DatabaseService.updateMaxScore(
        username,
        score,
        'word-puzzle',
        puzzle.anime,
        puzzle.difficulty
      );

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
        date: new Date().toISOString().split('T')[0],
        is_new_max_record: maxScoreResult.isNewRecord,
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
        nextPuzzle,
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
        score: 0,
      });
    }
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit solution',
    });
  }
});

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
          message: 'Character quiz not found',
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
            message: 'Invalid hint number',
          });
          return;
      }

      res.json({
        type: 'hint',
        hint,
        characterResponse,
      });
    } catch (error) {
      console.error('Error getting hint:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get hint',
      });
    }
  }
);

router.post<
  {},
  SubmitSolutionResponse | { status: string; message: string },
  SubmitCharacterGuessRequest
>('/api/character/submit', async (req, res): Promise<void> => {
  try {
    const { quizId, guess, hintsUsed } = req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const quiz = getCharacterQuizById(quizId);
    if (!quiz) {
      res.status(404).json({
        status: 'error',
        message: 'Character quiz not found',
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
      const gameStats: GameStats = statsData
        ? JSON.parse(statsData)
        : {
            totalPuzzlesSolved: 0,
            averageHintsUsed: 0,
            favoriteAnime: '',
            currentStreak: 0,
          };

      gameStats.totalPuzzlesSolved += 1;
      gameStats.currentStreak += 1;
      gameStats.averageHintsUsed =
        (gameStats.averageHintsUsed * (gameStats.totalPuzzlesSolved - 1) + hintsUsed) /
        gameStats.totalPuzzlesSolved;

      // Track favorite anime
      const animeCountKey = `anime_count:${username}:${quiz.anime}`;
      const animeCount = await redis.incrBy(animeCountKey, 1);
      if (!gameStats.favoriteAnime || animeCount > 1) {
        gameStats.favoriteAnime = quiz.anime;
      }

      await redis.set(statsKey, JSON.stringify(gameStats));

      // Mark puzzle as used to prevent repetition
      await DatabaseService.markPuzzleAsUsed(username, quizId);

      // Update max score if this is a new record
      const maxScoreResult = await DatabaseService.updateMaxScore(
        username,
        score,
        'character-guess',
        quiz.anime,
        quiz.difficulty
      );

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
        date: new Date().toISOString().split('T')[0],
        is_new_max_record: maxScoreResult.isNewRecord,
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
        nextPuzzle,
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
        score: 0,
      });
    }
  } catch (error) {
    console.error('Error submitting character guess:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit character guess',
    });
  }
});

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
          message: 'User not authenticated',
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
          userBadges,
        });
      } else {
        // Get all leaderboards
        const leaderboards = await getAllLeaderboards(username);
        const userBadges = await getUserBadges(username);

        res.json({
          type: 'leaderboard',
          leaderboards,
          userBadges,
        });
      }
    } catch (error) {
      console.error('Error getting leaderboards:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get leaderboards',
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
        message: 'User not authenticated',
      });
      return;
    }

    // Track active player
    await DatabaseService.trackActivePlayer(username);

    const globalLeaderboard = await DatabaseService.getGlobalLeaderboardWithUser(username, 50);

    res.json({
      type: 'global-leaderboard',
      topUsers: globalLeaderboard.topUsers,
      userRank: globalLeaderboard.userRank,
      userEntry: globalLeaderboard.userEntry,
      totalPlayers: globalLeaderboard.totalPlayers,
    });
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get global leaderboard',
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
        message: 'User not authenticated',
      });
      return;
    }

    if (!anime || typeof score !== 'number') {
      res.status(400).json({
        status: 'error',
        message: 'Anime and score are required',
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
      score,
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit score',
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
        message: 'User not authenticated',
      });
      return;
    }

    const leaderboard = await getAnimeLeaderboard(anime, username);

    res.json({
      anime,
      rank: leaderboard.userRank || 0,
      stats: leaderboard.userStats,
      totalPlayers: await getTotalPlayersForAnime(anime),
    });
  } catch (error) {
    console.error('Error getting user rank:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user rank',
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
        message: 'User not authenticated',
      });
      return;
    }

    const userProfile = await DatabaseService.getUserProfile(username);

    if (!userProfile) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.json({
      type: 'profile',
      username: userProfile.username,
      totalScore: userProfile.total_score,
      totalPuzzlesSolved: userProfile.total_puzzles_solved,
      currentStreak: userProfile.current_streak,
      bestStreak: userProfile.best_streak,
      favoriteAnime: userProfile.favorite_anime,
      level: userProfile.level,
      experience: userProfile.experience,
      hearts: userProfile.hearts,
      maxHearts: userProfile.max_hearts,
      energy: userProfile.energy,
      maxEnergy: userProfile.max_energy,
      badges: userProfile.badges,
      maxScore: userProfile.maxScore,
      maxScoreDetails: userProfile.maxScoreDetails,
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile',
    });
  }
});

// Get max score leaderboard
router.get('/api/leaderboard/max-scores', async (_req, res): Promise<void> => {
  try {
    const maxScoreLeaderboard = await DatabaseService.getGlobalMaxScoreLeaderboard(20);

    res.json({
      type: 'max-score-leaderboard',
      leaderboard: maxScoreLeaderboard,
    });
  } catch (error) {
    console.error('Error getting max score leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get max score leaderboard',
    });
  }
});

// Home page statistics
router.get('/api/home/stats', async (_req, res): Promise<void> => {
  try {
    const homeStats = await DatabaseService.getHomePageStats();

    res.json({
      type: 'home-stats',
      ...homeStats,
    });
  } catch (error) {
    console.error('Error getting home stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get home statistics',
    });
  }
});

// Daily challenge leaderboard
router.get('/api/daily-challenge/leaderboard', async (req, res): Promise<void> => {
  try {
    const { date } = req.query;
    const challengeDate =
      typeof date === 'string' && date ? date : new Date().toISOString().split('T')[0];

    const leaderboard = await DatabaseService.getDailyLeaderboard(challengeDate as string, 20);

    res.json({
      type: 'daily-challenge-leaderboard',
      date: challengeDate,
      leaderboard,
    });
  } catch (error) {
    console.error('Error getting daily challenge leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily challenge leaderboard',
    });
  }
});

// Submit individual daily challenge puzzle score
router.post('/api/daily-challenge/puzzle-score', async (req, res): Promise<void> => {
  try {
    const { puzzle_id, puzzle_type, anime, character, difficulty, score, hints_used, is_correct } =
      req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    if (is_correct) {
      // Mark puzzle as used to prevent repetition
      await DatabaseService.markPuzzleAsUsed(username, puzzle_id);

      // Update max score if this is a new record
      const maxScoreResult = await DatabaseService.updateMaxScore(
        username,
        score,
        puzzle_type,
        anime,
        difficulty
      );

      // Add individual puzzle score
      await DatabaseService.addPuzzleScore(username, {
        puzzle_id,
        puzzle_type: `daily-${puzzle_type}`,
        anime,
        character,
        difficulty,
        score,
        max_possible_score: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300,
        hints_used,
        date: new Date().toISOString().split('T')[0],
        is_new_max_record: maxScoreResult.isNewRecord,
        is_daily_challenge: true,
      });

      // Update global leaderboard
      await DatabaseService.updateGlobalLeaderboard(username);

      // Track daily stats
      await DatabaseService.incrementDailyStats('puzzles_solved');
      await DatabaseService.incrementDailyStats('total_score', score);

      res.json({
        status: 'success',
        message: 'Daily challenge puzzle score submitted',
        score,
        isNewMaxRecord: maxScoreResult.isNewRecord,
      });
    } else {
      res.json({
        status: 'success',
        message: 'Puzzle attempt recorded',
        score: 0,
      });
    }
  } catch (error) {
    console.error('Error submitting daily challenge puzzle score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit daily challenge puzzle score',
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
        message: 'User not authenticated',
      });
      return;
    }

    const challengeDate = new Date().toISOString().split('T')[0];

    const challengeScore = await DatabaseService.addDailyChallengeScore(
      username as string,
      challengeDate,
      {
        score,
        completion_time,
        puzzles_completed,
        hints_used,
      }
    );

    // Update daily stats
    await DatabaseService.incrementDailyStats('daily_challenges_completed');
    await DatabaseService.incrementDailyStats('daily_challenge_score', score);

    res.json({
      status: 'success',
      message: 'Daily challenge score submitted',
      challengeScore,
    });
  } catch (error) {
    console.error('Error submitting daily challenge score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit daily challenge score',
    });
  }
});

// Submit regular puzzle score
router.post('/api/puzzle/submit-score', async (req, res): Promise<void> => {
  try {
    const { puzzle_id, puzzle_type, anime, character, difficulty, score, hints_used } = req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    // Mark puzzle as used to prevent repetition
    await DatabaseService.markPuzzleAsUsed(username, puzzle_id);

    // Update max score if this is a new record
    const maxScoreResult = await DatabaseService.updateMaxScore(
      username,
      score,
      puzzle_type,
      anime,
      difficulty
    );

    // Add puzzle score to database
    await DatabaseService.addPuzzleScore(username, {
      puzzle_id,
      puzzle_type,
      anime,
      character,
      difficulty,
      score,
      max_possible_score: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300,
      hints_used: hints_used || 0,
      date: new Date().toISOString().split('T')[0],
      is_new_max_record: maxScoreResult.isNewRecord,
    });

    // Update global leaderboard
    await DatabaseService.updateGlobalLeaderboard(username);

    // Track daily stats
    await DatabaseService.incrementDailyStats('puzzles_solved');
    await DatabaseService.incrementDailyStats('total_score', score);

    // Track active player
    await DatabaseService.trackActivePlayer(username);

    res.json({
      status: 'success',
      message: 'Score submitted successfully',
      score,
      isNewMaxRecord: maxScoreResult.isNewRecord,
    });
  } catch (error) {
    console.error('Error submitting puzzle score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit puzzle score',
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
        message: 'User not authenticated',
      });
      return;
    }

    const user = await DatabaseService.updateUserHearts(username, hearts);

    res.json({
      status: 'success',
      hearts: user?.hearts || 0,
    });
  } catch (error) {
    console.error('Error updating user hearts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update hearts',
    });
  }
});

// Daily Puzzle API Endpoints
router.get('/api/daily-puzzles', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured',
      });
      return;
    }

    const puzzles = await dailyPuzzleManager.getTodaysPuzzles();
    res.json(puzzles);
  } catch (error) {
    console.error('Error getting daily puzzles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily puzzles',
    });
  }
});

router.get('/api/daily-puzzles/random', async (req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured',
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
      puzzle,
    });
  } catch (error) {
    console.error('Error getting random daily puzzle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get random daily puzzle',
    });
  }
});

router.get('/api/daily-puzzles/status', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.json({
        available: false,
        reason: 'No AI API keys configured',
      });
      return;
    }

    const status = await dailyPuzzleManager.getGenerationStatus();
    res.json({
      available: true,
      ...status,
    });
  } catch (error) {
    console.error('Error getting daily puzzle status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily puzzle status',
    });
  }
});

router.post('/api/daily-puzzles/regenerate', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured',
      });
      return;
    }

    console.log('🔄 Manual regeneration requested');
    const puzzles = await dailyPuzzleManager.forceRegenerateToday();

    res.json({
      status: 'success',
      message: 'Daily puzzles regenerated successfully',
      totalPuzzles: puzzles.totalPuzzles,
    });
  } catch (error) {
    console.error('Error regenerating daily puzzles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to regenerate daily puzzles',
    });
  }
});

// Auto-generate more puzzles when running low
router.post('/api/daily-puzzles/expand', async (_req, res): Promise<void> => {
  try {
    if (!dailyPuzzleManager) {
      res.status(503).json({
        status: 'error',
        message: 'Daily puzzle generation not available - no AI API keys configured',
      });
      return;
    }

    console.log('🔄 Manual puzzle expansion requested');

    // Get current puzzles and force expansion
    const currentPuzzles = await dailyPuzzleManager.getTodaysPuzzles();

    // Simulate high usage to trigger expansion
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `puzzle_usage:${today}`;
    const mockUsage: { [key: string]: number } = {};

    // Mark 90% of puzzles as used to trigger expansion
    const animes = [
      'Naruto',
      'One Piece',
      'Attack on Titan',
      'Demon Slayer',
      'Jujutsu Kaisen',
      'My Hero Academia',
    ];
    const difficulties = ['easy', 'medium', 'hard'];

    animes.forEach((anime) => {
      difficulties.forEach((difficulty) => {
        mockUsage[`${anime}:${difficulty}`] = Math.floor(currentPuzzles.totalPuzzles * 0.15); // 90% usage
      });
    });

    await redis.set(usageKey, JSON.stringify(mockUsage), {
      expiration: new Date(Date.now() + 86400 * 1000),
    });

    // Trigger expansion check
    const updatedPuzzles = await dailyPuzzleManager.getTodaysPuzzles();

    res.json({
      status: 'success',
      message: 'Puzzle expansion triggered successfully',
      originalPuzzles: currentPuzzles.totalPuzzles,
      newTotal: updatedPuzzles.totalPuzzles,
    });
  } catch (error) {
    console.error('Error expanding daily puzzles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to expand daily puzzles',
    });
  }
});

// Anime Guess Game Mode Endpoints

// Get a random anime guess quiz
router.get('/api/anime-guess/quiz', async (req, res): Promise<void> => {
  try {
    const { difficulty } = req.query;
    const validDifficulty = ['easy', 'medium', 'hard'].includes(difficulty as string)
      ? (difficulty as 'easy' | 'medium' | 'hard')
      : undefined;

    const quiz = getRandomAnimeGuessQuiz(validDifficulty);

    res.json({
      status: 'success',
      quiz,
    });
  } catch (error) {
    console.error('Error getting anime guess quiz:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get quiz',
    });
  }
});

// Submit anime guess answer
router.post('/api/anime-guess/submit', async (req, res): Promise<void> => {
  try {
    const { quizId, selectedAnswer, hintsUsed, timeSpent } = req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const quiz = getAnimeGuessQuizById(quizId);
    if (!quiz) {
      res.status(404).json({
        status: 'error',
        message: 'Quiz not found',
      });
      return;
    }

    const isCorrect = selectedAnswer === quiz.correctAnime;

    // Calculate score based on difficulty, time, and hints used
    let baseScore = 0;
    switch (quiz.difficulty) {
      case 'easy':
        baseScore = 50;
        break;
      case 'medium':
        baseScore = 100;
        break;
      case 'hard':
        baseScore = 200;
        break;
    }

    // Time bonus (faster = more points, max 60 seconds for full bonus)
    const timeBonus = Math.max(0, 60 - Math.floor(timeSpent / 1000)) * 2;

    // Hint penalty
    const hintPenalty = hintsUsed * 25;

    const finalScore = isCorrect ? Math.max(10, baseScore + timeBonus - hintPenalty) : 0;

    // Update user stats if correct
    if (isCorrect) {
      // Update max score if this is a new record
      const maxScoreResult = await DatabaseService.updateMaxScore(
        username,
        finalScore,
        'anime-guess',
        quiz.correctAnime,
        quiz.difficulty
      );

      // Add puzzle score record
      await DatabaseService.addPuzzleScore(username, {
        puzzle_id: quizId,
        puzzle_type: 'anime-guess',
        anime: quiz.correctAnime,
        character: quiz.character,
        difficulty: quiz.difficulty,
        score: finalScore,
        max_possible_score: baseScore + 120, // Max possible with time bonus
        hints_used: hintsUsed,
        date: new Date().toISOString().split('T')[0],
        is_new_max_record: maxScoreResult.isNewRecord,
      });

      // Update puzzle type leaderboard
      await DatabaseService.updatePuzzleTypeLeaderboard(username, 'anime-guess', finalScore);

      // Update global leaderboard
      await DatabaseService.updateGlobalLeaderboard(username);

      // Track daily stats
      await DatabaseService.incrementDailyStats('puzzles_solved');
      await DatabaseService.incrementDailyStats('total_score', finalScore);
    }

    // Generate feedback
    let feedback = '';
    if (isCorrect) {
      if (finalScore >= 150) {
        feedback = '🌟 PERFECT! Amazing anime knowledge!';
      } else if (finalScore >= 100) {
        feedback = '✨ EXCELLENT! Great job identifying the character!';
      } else if (finalScore >= 50) {
        feedback = '👍 GOOD! Well done!';
      } else {
        feedback = '✅ CORRECT! Nice work!';
      }
    } else {
      feedback = `❌ Wrong! The correct answer was ${quiz.correctAnime}`;
    }

    res.json({
      type: 'anime-guess-result',
      isCorrect,
      correctAnswer: quiz.correctAnime,
      score: finalScore,
      feedback,
      characterInfo: {
        name: quiz.character,
        anime: quiz.correctAnime,
        description: quiz.characterDescription,
      },
    });
  } catch (error) {
    console.error('Error submitting anime guess answer:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit answer',
    });
  }
});

// Get anime guess leaderboard
router.get('/api/anime-guess/leaderboard', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    // Get top players for anime guess mode
    const leaderboard = await DatabaseService.getLeaderboardByPuzzleType('anime-guess', 20);

    res.json({
      status: 'success',
      leaderboard,
    });
  } catch (error) {
    console.error('Error getting anime guess leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get leaderboard',
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

// Challenge API Endpoints
router.post('/api/challenges/create', async (req, res): Promise<void> => {
  try {
    const challenge = req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    // Store challenge in Redis
    const challengeKey = `challenge:${challenge.id}`;
    const userChallengesKey = `user_challenges:${username}`;

    // Set challenge data
    await redis.set(
      challengeKey,
      JSON.stringify({
        ...challenge,
        createdBy: username,
      })
    );

    // Add to user's challenges list (using JSON array instead of Redis sets)
    const userChallenges = await redis.get(userChallengesKey);
    const challengesList = userChallenges ? JSON.parse(userChallenges) : [];
    if (!challengesList.includes(challenge.id)) {
      challengesList.push(challenge.id);
      await redis.set(userChallengesKey, JSON.stringify(challengesList));
    }

    // Add to public challenges if public
    if (challenge.isPublic) {
      const publicChallenges = await redis.get('public_challenges');
      const publicList = publicChallenges ? JSON.parse(publicChallenges) : [];
      if (!publicList.includes(challenge.id)) {
        publicList.push(challenge.id);
        await redis.set('public_challenges', JSON.stringify(publicList));
        console.log(`✅ Added challenge ${challenge.id} to public challenges. Total public: ${publicList.length + 1}`);
      }
    }

    // Update user stats
    await DatabaseService.incrementUserStat(username, 'challenges_created');

    res.json({
      status: 'success',
      message: 'Challenge created successfully',
      challenge: {
        ...challenge,
        createdBy: username,
      },
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create challenge',
    });
  }
});

// Validate custom question endpoint
router.post('/api/challenges/validate-question', async (req, res): Promise<void> => {
  try {
    const { question, correctAnswer, wrongAnswers, anime } = req.body;

    // Basic validation
    if (!question || !correctAnswer || !wrongAnswers || !anime) {
      res.status(400).json({
        isValid: false,
        error: 'Missing required fields',
      });
      return;
    }

    if (wrongAnswers.length !== 3) {
      res.status(400).json({
        isValid: false,
        error: 'Exactly 3 wrong answers are required',
      });
      return;
    }

    // Check for duplicate answers
    const allAnswers = [correctAnswer, ...wrongAnswers];
    const uniqueAnswers = new Set(allAnswers.map((a) => a.toLowerCase().trim()));
    if (uniqueAnswers.size !== allAnswers.length) {
      res.status(400).json({
        isValid: false,
        error: 'All answers must be unique',
      });
      return;
    }

    // Check answer lengths
    if (correctAnswer.length > 100 || wrongAnswers.some((a) => a.length > 100)) {
      res.status(400).json({
        isValid: false,
        error: 'Answers must be 100 characters or less',
      });
      return;
    }

    // Check question length
    if (question.length > 200) {
      res.status(400).json({
        isValid: false,
        error: 'Question must be 200 characters or less',
      });
      return;
    }

    // Enhanced content validation with anime-specific terminology
    const questionLower = question.toLowerCase();
    const animeLower = anime.toLowerCase();
    const correctAnswerLower = correctAnswer.toLowerCase();
    const allAnswersLower = [correctAnswer, ...wrongAnswers].map((a) => a.toLowerCase());

    // Anime-specific terminology by series
    const animeTerms: { [key: string]: string[] } = {
      'naruto': [
        'jutsu',
        'ninja',
        'hokage',
        'chakra',
        'sharingan',
        'byakugan',
        'rinnegan',
        'tailed beast',
        'jinchuriki',
        'village',
        'clan',
        'sensei',
      ],
      'demon slayer': [
        'demon',
        'slayer',
        'breathing',
        'upper moon',
        'lower moon',
        'hashira',
        'corps',
        'sword',
        'technique',
        'pillar',
        'muzan',
        'tanjiro',
        'nezuko',
        'zenitsu',
        'inosuke',
        'giyu',
        'rengoku',
        'tengen',
        'mitsuri',
        'obanai',
        'sanemi',
        'gyomei',
        'shinobu',
        'akaza',
        'doma',
        'kokushibo',
        'enmu',
        'rui',
        'kaigaku',
      ],
      'one piece': [
        'pirate',
        'devil fruit',
        'haki',
        'crew',
        'marine',
        'grand line',
        'treasure',
        'ship',
        'captain',
        'admiral',
        'yonko',
        'warlord',
      ],
      'attack on titan': [
        'titan',
        'wall',
        'survey corps',
        'garrison',
        'military police',
        'shifter',
        'eldian',
        'marley',
        'founding',
        'colossal',
      ],
      'jujutsu kaisen': [
        'curse',
        'sorcerer',
        'technique',
        'domain',
        'expansion',
        'grade',
        'special grade',
        'finger',
        'sukuna',
        'jujutsu',
      ],
      'my hero academia': [
        'quirk',
        'hero',
        'villain',
        'plus ultra',
        'ua',
        'pro hero',
        'license',
        'all might',
        'deku',
        'class 1-a',
      ],
      'death note': [
        'death note',
        'shinigami',
        'kira',
        'l',
        'light',
        'ryuk',
        'misa',
        'notebook',
        'rule',
        'investigation',
      ],
      'dragon ball': [
        'saiyan',
        'ki',
        'kamehameha',
        'dragon ball',
        'wish',
        'transformation',
        'super saiyan',
        'frieza',
        'cell',
        'buu',
      ],
      'bleach': [
        'soul reaper',
        'hollow',
        'zanpakuto',
        'bankai',
        'shikai',
        'soul society',
        'arrancar',
        'espada',
        'quincy',
        'fullbring',
      ],
    };

    // General anime terms that apply to most series
    const generalAnimeTerms = [
      'character',
      'protagonist',
      'antagonist',
      'main character',
      'episode',
      'season',
      'arc',
      'manga',
      'anime',
      'series',
      'story',
      'plot',
      'battle',
      'fight',
      'power',
      'ability',
      'technique',
      'skill',
      'name',
      'who',
      'what',
      'where',
      'when',
      'how',
      'which',
      'first',
      'last',
      'strongest',
      'weakest',
      'leader',
      'member',
      'team',
      'group',
      'organization',
      'school',
      'academy',
      'training',
      'master',
      'student',
      'teacher',
      'friend',
      'enemy',
      'rival',
      'ally',
      'family',
      'brother',
      'sister',
      'father',
      'mother',
      'son',
      'daughter',
    ];

    // Get anime-specific terms for the current anime
    const specificTerms = animeTerms[animeLower] || [];
    const allRelevantTerms = [...specificTerms, ...generalAnimeTerms];

    // Check if question contains anime name, specific terms, or character names from answers
    const hasAnimeName = questionLower.includes(animeLower);
    const hasSpecificTerms = allRelevantTerms.some((term) => questionLower.includes(term));
    const hasCharacterNames = allAnswersLower.some((answer) => {
      // Check if full answer is in question
      if (questionLower.includes(answer)) return true;

      // Check if any word from the answer is in question (for multi-word names)
      const answerWords = answer.split(' ').filter((word) => word.length > 2); // Ignore short words like "the", "of"
      return answerWords.some((word) => questionLower.includes(word));
    });

    // More lenient validation - question should have at least one indicator of anime relevance
    if (!hasAnimeName && !hasSpecificTerms && !hasCharacterNames) {
      res.status(400).json({
        isValid: false,
        error:
          'Question should be more specific to the anime series. Try including character names, anime-specific terms, or the series name.',
      });
      return;
    }

    // Additional check: if it's a "who/what/which" question, it's likely anime-related
    const questionWords = ['who', 'what', 'which', 'where', 'when', 'how', 'name'];
    const hasQuestionWord = questionWords.some((word) => questionLower.includes(word));

    // If it has a question word and mentions the anime or has character names, it's probably valid
    if (hasQuestionWord && (hasAnimeName || hasCharacterNames)) {
      // Skip further validation for question-type queries
    } else if (!hasAnimeName && !hasSpecificTerms) {
      // Only reject if it has no anime relevance at all
      res.status(400).json({
        isValid: false,
        error:
          'Question should be more specific to the anime series. Try including character names, anime-specific terms, or the series name.',
      });
      return;
    }

    // Provide helpful feedback about what made the question valid
    let validationReasons = [];
    if (hasAnimeName) validationReasons.push('mentions anime series');
    if (hasSpecificTerms) validationReasons.push('contains anime-specific terminology');
    if (hasCharacterNames) validationReasons.push('references character names');
    if (hasQuestionWord) validationReasons.push('is a proper question format');

    res.json({
      isValid: true,
      message: 'Question validated successfully',
      reasons: validationReasons,
      detectedTerms: {
        animeName: hasAnimeName,
        specificTerms: hasSpecificTerms,
        characterNames: hasCharacterNames,
        questionFormat: hasQuestionWord,
      },
    });
  } catch (error) {
    console.error('Error validating question:', error);
    res.status(500).json({
      isValid: false,
      error: 'Failed to validate question',
    });
  }
});

router.get('/api/challenges/recent', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const userChallengesKey = `user_challenges:${username}`;
    const userChallenges = await redis.get(userChallengesKey);
    const challengeIds = userChallenges ? JSON.parse(userChallenges) : [];

    const challenges = [];
    for (const challengeId of challengeIds.slice(0, 10)) {
      const challengeData = await redis.get(`challenge:${challengeId}`);
      if (challengeData) {
        challenges.push(JSON.parse(challengeData));
      }
    }

    // Sort by creation date
    challenges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      status: 'success',
      challenges,
    });
  } catch (error) {
    console.error('Error getting recent challenges:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get recent challenges',
    });
  }
});

// Get public challenges endpoint
router.get('/api/challenges/public', async (_req, res): Promise<void> => {
  try {
    const publicChallengesData = await redis.get('public_challenges');
    const publicChallengeIds = publicChallengesData ? JSON.parse(publicChallengesData) : [];
    
    console.log(`📋 Fetching public challenges. Found ${publicChallengeIds.length} public challenge IDs:`, publicChallengeIds);

    const challenges = [];
    for (const challengeId of publicChallengeIds.slice(0, 20)) {
      // Get up to 20 public challenges
      const challengeData = await redis.get(`challenge:${challengeId}`);
      if (challengeData) {
        const challenge = JSON.parse(challengeData);
        console.log(`📝 Found challenge: ${challenge.title} (public: ${challenge.isPublic})`);
        if (challenge.isPublic) {
          challenges.push(challenge);
        }
      } else {
        console.log(`❌ No data found for challenge ID: ${challengeId}`);
      }
    }

    console.log(`✅ Returning ${challenges.length} public challenges`);

    // Sort by creation date (newest first)
    challenges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      status: 'success',
      challenges,
    });
  } catch (error) {
    console.error('Error getting public challenges:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get public challenges',
    });
  }
});

router.get('/api/dashboard/stats', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    // Get user's challenge statistics
    const userChallengesKey = `user_challenges:${username}`;
    const userChallenges = await redis.get(userChallengesKey);
    const challengeIds = userChallenges ? JSON.parse(userChallenges) : [];

    const challengesByAnime: { [anime: string]: { created: number; won: number; lost: number } } =
      {};
    let totalCompleted = 0;
    let totalWins = 0;
    let totalScore = 0;
    let scoreCount = 0;

    // Analyze each challenge
    for (const challengeId of challengeIds) {
      const challengeData = await redis.get(`challenge:${challengeId}`);
      if (challengeData) {
        const challenge = JSON.parse(challengeData);
        const anime = challenge.anime || 'Mixed';

        if (!challengesByAnime[anime]) {
          challengesByAnime[anime] = { created: 0, won: 0, lost: 0 };
        }
        challengesByAnime[anime].created++;

        // Count completions and wins/losses
        if (challenge.completions) {
          totalCompleted += challenge.completions.length;

          challenge.completions.forEach((completion: any) => {
            if (completion.username === username) {
              totalScore += completion.totalScore;
              scoreCount++;

              // Determine if it's a win (completed successfully)
              if (completion.puzzleResults && completion.puzzleResults.length > 0) {
                const correctAnswers = completion.puzzleResults.filter(
                  (r: any) => r.isCorrect
                ).length;
                const winThreshold = Math.ceil(completion.puzzleResults.length * 0.6); // 60% correct = win

                if (correctAnswers >= winThreshold) {
                  challengesByAnime[anime].won++;
                  totalWins++;
                } else {
                  challengesByAnime[anime].lost++;
                }
              }
            }
          });
        }
      }
    }

    const stats = {
      totalChallengesCreated: challengeIds.length,
      totalChallengesCompleted: totalCompleted,
      challengesByAnime,
      averageScore: scoreCount > 0 ? totalScore / scoreCount : 0,
      bestTime: 0, // TODO: Track best completion times
      favoriteAnime: Object.keys(challengesByAnime).reduce(
        (a, b) => (challengesByAnime[a].created > challengesByAnime[b].created ? a : b),
        'Mixed'
      ),
      winRate: totalCompleted > 0 ? totalWins / totalCompleted : 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics',
    });
  }
});

router.get('/api/challenges/:shareCode', async (req, res): Promise<void> => {
  try {
    const { shareCode } = req.params;

    // Find challenge by share code
    const publicChallengesData = await redis.get('public_challenges');
    const publicChallenges = publicChallengesData ? JSON.parse(publicChallengesData) : [];

    for (const challengeId of publicChallenges) {
      const challengeData = await redis.get(`challenge:${challengeId}`);
      if (challengeData) {
        const challenge = JSON.parse(challengeData);
        if (challenge.shareCode === shareCode) {
          res.json({
            status: 'success',
            challenge,
          });
          return;
        }
      }
    }

    res.status(404).json({
      status: 'error',
      message: 'Challenge not found',
    });
  } catch (error) {
    console.error('Error getting challenge by share code:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get challenge',
    });
  }
});

router.post('/api/challenges/:challengeId/complete', async (req, res): Promise<void> => {
  try {
    const { challengeId } = req.params;
    const { totalScore, timeUsed, hintsUsed, puzzleResults } = req.body;
    const username = await reddit.getCurrentUsername();

    if (!username) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const challengeKey = `challenge:${challengeId}`;
    const challengeData = await redis.get(challengeKey);

    if (!challengeData) {
      res.status(404).json({
        status: 'error',
        message: 'Challenge not found',
      });
      return;
    }

    const challenge = JSON.parse(challengeData);

    // Add completion
    const completion = {
      username,
      completedAt: new Date().toISOString(),
      totalScore,
      timeUsed,
      hintsUsed,
      puzzleResults,
    };

    if (!challenge.completions) {
      challenge.completions = [];
    }
    challenge.completions.push(completion);

    // Update challenge
    await redis.set(challengeKey, JSON.stringify(challenge));

    // Update user stats
    await DatabaseService.incrementUserStat(username, 'challenges_completed');

    // Calculate badge progress and award badges
    const correctAnswers = puzzleResults.filter((result: any) => result.isCorrect).length;
    const totalQuestions = puzzleResults.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Determine badge level based on performance
    let badgeLevel = 'bronze';
    if (accuracy >= 90 && totalScore >= 800) {
      badgeLevel = 'master';
    } else if (accuracy >= 80 && totalScore >= 600) {
      badgeLevel = 'platinum';
    } else if (accuracy >= 70 && totalScore >= 400) {
      badgeLevel = 'gold';
    } else if (accuracy >= 60 && totalScore >= 200) {
      badgeLevel = 'silver';
    }

    // Update badge for the specific anime
    const badgeData = {
      badge_level: badgeLevel,
      puzzles_solved: correctAnswers,
      total_score: totalScore,
      accuracy: Math.round(accuracy),
      challenges_completed: 1,
      best_time: timeUsed
    };

    const updatedBadge = await DatabaseService.updateUserBadge(username, challenge.anime, badgeData);

    // Update leaderboard
    const leaderboardData = {
      username,
      score: totalScore,
      anime: challenge.anime,
      difficulty: challenge.difficulty,
      completedAt: new Date().toISOString(),
      timeUsed,
      accuracy: Math.round(accuracy),
      challengeId
    };

    // Add to anime-specific leaderboard
    const leaderboardKey = `leaderboard:${challenge.anime}:${challenge.difficulty}`;
    const existingLeaderboard = await redis.get(leaderboardKey);
    const leaderboard = existingLeaderboard ? JSON.parse(existingLeaderboard) : [];
    
    // Add new entry
    leaderboard.push(leaderboardData);
    
    // Sort by score (descending) and keep top 100
    leaderboard.sort((a: any, b: any) => b.score - a.score);
    const topLeaderboard = leaderboard.slice(0, 100);
    
    await redis.set(leaderboardKey, JSON.stringify(topLeaderboard));

    console.log(`🏆 ${username} completed challenge ${challengeId}: ${totalScore} points, ${accuracy}% accuracy, ${badgeLevel} badge`);

    res.json({
      status: 'success',
      message: 'Challenge completion recorded',
      completion,
      badge: updatedBadge,
      leaderboardRank: topLeaderboard.findIndex((entry: any) => entry.username === username && entry.completedAt === leaderboardData.completedAt) + 1,
      totalScore,
      accuracy: Math.round(accuracy),
      badgeLevel
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to record challenge completion',
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
