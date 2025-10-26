import React, { useEffect, useState } from 'react';
import { FeedbackService } from '../services/feedbackService';

interface CompletionCelebrationProps {
  character: string;
  score: number;
  isVisible: boolean;
  onComplete: () => void;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  character,
  score,
  isVisible,
  onComplete
}) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      setCelebrationMessage(FeedbackService.getCompletionFeedback(character, score));
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowFireworks(false);
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, character, score, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="text-center text-white max-w-md mx-auto p-8">
        {/* Fireworks Effect */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              >
                {['🎆', '✨', '🌟', '💥', '⚡'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        {/* Main Celebration */}
        <div className="anime-card rounded-2xl p-8 animate-bounce-in">
          <div className="text-6xl mb-4 animate-glow">🏆</div>
          
          <h2 className="text-3xl font-black mb-4 anime-text-glow anime-text-outline">
            PUZZLE COMPLETE!
          </h2>
          
          <div className="text-5xl font-bold mb-4 anime-gradient-warning bg-clip-text text-transparent">
            {score} POINTS
          </div>
          
          <div className="text-lg font-semibold mb-6 anime-text-glow">
            {celebrationMessage}
          </div>

          {/* Character-specific celebration emoji */}
          <div className="text-4xl animate-float">
            {getCharacterEmoji(character)}
          </div>
        </div>
      </div>
    </div>
  );
};

function getCharacterEmoji(character: string): string {
  const characterEmojis: { [key: string]: string } = {
    'Rock Lee': '💪🍃',
    'Naruto Uzumaki': '🍃🦊',
    'Monkey D. Luffy': '🏴‍☠️🍖',
    'Light Yagami': '📓⚖️',
    'Eren Yeager': '⚔️🗡️',
    'Tanjiro Kamado': '🌊⚔️',
    'All Might': '💪✨',
    'Yuji Itadori': '👊⚡',
    'Anya Forger': '⭐🥜',
    'Ichigo Kurosaki': '⚔️👹',
    'Goku': '⚡🔥'
  };

  return characterEmojis[character] || '🌟⚡';
}
