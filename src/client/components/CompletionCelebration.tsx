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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="text-center max-w-sm sm:max-w-md mx-auto">
        {/* Fireworks Effect */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl sm:text-4xl animate-sparkle"
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

        {/* Main Celebration - Responsive Design */}
        <div className="neon-card p-6 sm:p-8 animate-bounce-in relative overflow-hidden">
          <div className="cyber-grid opacity-30"></div>
          <div className="scan-lines"></div>
          <div className="relative z-10">
            <div className="text-4xl sm:text-6xl mb-4 animate-neon-glow">🏆</div>
            
            <h2 className="anime-text-neon text-xl sm:text-3xl mb-4">
              PUZZLE COMPLETE!
            </h2>
            
            <div className="text-3xl sm:text-5xl font-bold mb-4 text-cyan-400 animate-pulse">
              {score} POINTS
            </div>
            
            <div className="anime-text-pixel text-sm sm:text-base mb-6 text-yellow-400">
              Legendary performance! ⚡
            </div>

            {/* Character-specific celebration emoji */}
            <div className="text-3xl sm:text-4xl animate-float">
              {getCharacterEmoji(character)}
            </div>
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
