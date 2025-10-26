import { AnimeTheme } from '../../shared/types/puzzle';

export const animeThemes: Record<string, AnimeTheme> = {
  'Naruto': {
    name: 'Naruto',
    colors: {
      primary: 'from-orange-400 to-red-500',
      secondary: 'from-blue-400 to-blue-600',
      accent: 'from-yellow-400 to-orange-500',
      background: 'from-orange-50 to-red-50'
    },
    fonts: {
      primary: 'font-bold',
      secondary: 'font-medium'
    },
    effects: {
      particles: true,
      animations: ['bounce', 'pulse']
    }
  },
  'One Piece': {
    name: 'One Piece',
    colors: {
      primary: 'from-blue-400 to-cyan-500',
      secondary: 'from-red-400 to-red-600',
      accent: 'from-yellow-400 to-yellow-600',
      background: 'from-blue-50 to-cyan-50'
    },
    fonts: {
      primary: 'font-bold',
      secondary: 'font-medium'
    },
    effects: {
      particles: true,
      animations: ['wave', 'bounce']
    }
  },
  'Attack on Titan': {
    name: 'Attack on Titan',
    colors: {
      primary: 'from-gray-600 to-red-600',
      secondary: 'from-gray-700 to-gray-900',
      accent: 'from-red-500 to-red-700',
      background: 'from-gray-100 to-red-100'
    },
    fonts: {
      primary: 'font-bold',
      secondary: 'font-semibold'
    },
    effects: {
      particles: false,
      animations: ['shake', 'pulse']
    }
  },
  'Demon Slayer': {
    name: 'Demon Slayer',
    colors: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-indigo-500 to-purple-600',
      accent: 'from-pink-400 to-red-500',
      background: 'from-purple-50 to-pink-50'
    },
    fonts: {
      primary: 'font-bold',
      secondary: 'font-medium'
    },
    effects: {
      particles: true,
      animations: ['pulse', 'bounce']
    }
  },
  'My Hero Academia': {
    name: 'My Hero Academia',
    colors: {
      primary: 'from-green-400 to-blue-500',
      secondary: 'from-blue-500 to-indigo-600',
      accent: 'from-yellow-400 to-green-500',
      background: 'from-green-50 to-blue-50'
    },
    fonts: {
      primary: 'font-bold',
      secondary: 'font-medium'
    },
    effects: {
      particles: true,
      animations: ['bounce', 'pulse']
    }
  },
  'Death Note': {
    name: 'Death Note',
    colors: {
      primary: 'from-gray-800 to-black',
      secondary: 'from-red-600 to-red-800',
      accent: 'from-gray-600 to-gray-800',
      background: 'from-gray-100 to-gray-200'
    },
    fonts: {
      primary: 'font-bold',
      secondary: 'font-semibold'
    },
    effects: {
      particles: false,
      animations: ['pulse']
    }
  }
};

export const getThemeForAnime = (anime: string): AnimeTheme => {
  return animeThemes[anime] || animeThemes['Naruto'];
};

export const getThemeClasses = (anime: string) => {
  const theme = getThemeForAnime(anime);
  return {
    background: `bg-gradient-to-br ${theme.colors.background}`,
    primary: `bg-gradient-to-r ${theme.colors.primary}`,
    secondary: `bg-gradient-to-r ${theme.colors.secondary}`,
    accent: `bg-gradient-to-r ${theme.colors.accent}`,
    primaryText: theme.fonts.primary,
    secondaryText: theme.fonts.secondary
  };
};
