import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Pixel Art Anime Splash Screen Configuration
      appDisplayName: 'Anime Pixel Quest',
      backgroundUri: 'default-splash.png',
      buttonLabel: '🥢 Play Now – Channel your inner sensei',
      description:
        'Guess, drag, and flex your anime IQ! Complete legendary anime quotes, guess the speaker, or match the mood — all in one word-tile challenge! Test your knowledge of Naruto, One Piece, JJK, and more, then climb the global leaderboard.',
      heading: 'Anime Pixel Quest 🎌',
      appIconUri: 'app-icon.png',
    },
    postData: {
      gameType: 'anime-puzzle',
      totalPuzzles: 10,
      difficulty: 'mixed',
    },
    subredditName: subredditName,
    title: '🎌 Anime Pixel Quest - Guess, Drag & Flex Your Anime IQ! 🥢',
  });
};
