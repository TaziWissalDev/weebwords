// Image utility functions for anime guess mode

export const getCharacterImageUrl = (characterName: string, animeName: string): string => {
  // For now, return placeholder images
  // In production, these would be actual character images from a CDN
  const placeholders = [
    'https://via.placeholder.com/256x256/1a1a2e/16213e?text=Character+1',
    'https://via.placeholder.com/256x256/16213e/1a1a2e?text=Character+2',
    'https://via.placeholder.com/256x256/0f3460/16213e?text=Character+3',
    'https://via.placeholder.com/256x256/533483/16213e?text=Character+4',
    'https://via.placeholder.com/256x256/7209b7/533483?text=Character+5',
  ];
  
  // Use character name hash to consistently return same placeholder
  const hash = characterName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return placeholders[Math.abs(hash) % placeholders.length] || placeholders[0];
};

export const getPlaceholderCharacterImage = (): string => {
  return 'https://via.placeholder.com/256x256/1a1a2e/16213e?text=Character';
};
