import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Anime Line',
      backgroundUri: 'default-splash.png',
      buttonLabel: '🎮 Play Now',
      description: 'Complete iconic anime quotes by dragging word tiles! Test your knowledge of Naruto, One Piece, JJK, and more!',
      entryUri: 'index.html',
      heading: 'Anime Line - Word Puzzle Game 🎌',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameType: 'anime-puzzle',
      totalPuzzles: 10,
      difficulty: 'mixed'
    },
    subredditName: subredditName,
    title: '🎌 Anime Line - Complete the Quote! | Word Puzzle Game',
  });
};
