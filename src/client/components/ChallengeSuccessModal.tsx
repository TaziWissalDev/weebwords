import React from 'react';
import { useSound } from '../hooks/useSound';

interface Challenge {
  id: string;
  title: string;
  description: string;
  shareCode: string;
  anime: string;
  difficulty: string;
}

interface ChallengeSuccessModalProps {
  isOpen: boolean;
  challenge: Challenge | null;
  onClose: () => void;
  onPlayChallenge: () => void;
}

export const ChallengeSuccessModal: React.FC<ChallengeSuccessModalProps> = ({
  isOpen,
  challenge,
  onClose,
  onPlayChallenge
}) => {
  const { sounds } = useSound();

  if (!isOpen || !challenge) return null;

  const handleCopyShareCode = () => {
    navigator.clipboard.writeText(challenge.shareCode).then(() => {
      sounds.success();
      alert('Share code copied to clipboard! 📋');
    });
  };

  const handleShareChallenge = () => {
    const shareText = `🎮 I just created an awesome anime challenge!\n\n🎭 "${challenge.title}"\n📺 ${challenge.anime} | ⚡ ${challenge.difficulty}\n\n🔗 Join with code: ${challenge.shareCode}\n\nCan you beat my challenge? 🏆`;
    
    if (navigator.share) {
      navigator.share({
        title: `Anime Challenge: ${challenge.title}`,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        sounds.success();
        alert('Challenge details copied to clipboard! Share it with friends! 🚀');
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="neon-card max-w-md w-full p-6 animate-bounce-in">
        
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="anime-title text-2xl mb-2">CHALLENGE CREATED!</h2>
          <p className="text-gray-300 text-sm">Your challenge is ready to share with the world!</p>
        </div>

        {/* Challenge Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="anime-text-pixel text-cyan-400 font-bold mb-2">{challenge.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="anime-text-pixel text-purple-400 mb-1">ANIME</div>
              <div className="text-white">{challenge.anime}</div>
            </div>
            <div>
              <div className="anime-text-pixel text-yellow-400 mb-1">DIFFICULTY</div>
              <div className="text-white">{challenge.difficulty.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Share Code */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="anime-text-pixel text-cyan-400 text-sm mb-2">🔗 SHARE CODE</div>
            <div className="text-2xl font-bold text-white mb-3 tracking-wider">{challenge.shareCode}</div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopyShareCode}
                className="flex-1 pixel-button text-sm py-2"
              >
                📋 Copy Code
              </button>
              <button
                onClick={handleShareChallenge}
                className="flex-1 pixel-button text-sm py-2"
                style={{ 
                  background: 'linear-gradient(135deg, var(--neon-purple) 0%, var(--neon-pink) 100%)'
                }}
              >
                📤 Share Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              sounds.button();
              onPlayChallenge();
            }}
            className="flex-1 pixel-button py-3"
            style={{ 
              background: 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)'
            }}
          >
            🎮 Test Challenge
          </button>
          
          <button
            onClick={() => {
              sounds.button();
              onClose();
            }}
            className="flex-1 pixel-button py-3"
          >
            🏠 Back to Home
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="anime-text-pixel text-gray-400 text-xs">
            💡 Share the code with friends so they can play your challenge!
          </p>
        </div>
      </div>
    </div>
  );
};
