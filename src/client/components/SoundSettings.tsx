import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

interface SoundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundSettings: React.FC<SoundSettingsProps> = ({ isOpen, onClose }) => {
  const { getEnabled, getVolume, setEnabled, setVolume, sounds } = useSound();
  const [soundEnabled, setSoundEnabled] = useState(getEnabled());
  const [volume, setVolumeState] = useState(getVolume());

  useEffect(() => {
    setSoundEnabled(getEnabled());
    setVolumeState(getVolume());
  }, [getEnabled, getVolume]);

  const handleToggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    setEnabled(newEnabled);
    
    if (newEnabled) {
      sounds.button();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    setVolume(newVolume);
    sounds.click();
  };

  const testSound = (soundName: string) => {
    if (soundEnabled) {
      switch (soundName) {
        case 'click': sounds.click(); break;
        case 'success': sounds.success(); break;
        case 'failure': sounds.failure(); break;
        case 'celebration': sounds.celebration(); break;
        case 'hint': sounds.hint(); break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="neon-card max-w-md w-full p-6 animate-bounce-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="anime-title text-xl">🔊 SOUND SETTINGS</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="anime-text-pixel text-white">Sound Effects</span>
            <button
              onClick={handleToggleSound}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            {soundEnabled ? 'Sound effects are enabled' : 'Sound effects are disabled'}
          </p>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="anime-text-pixel text-white">Volume</span>
            <span className="text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            disabled={!soundEnabled}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, var(--neon-cyan) 0%, var(--neon-cyan) ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
            }}
          />
        </div>

        {/* Sound Test Buttons */}
        <div className="mb-6">
          <h3 className="anime-text-pixel text-cyan-400 mb-3">Test Sounds</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => testSound('click')}
              disabled={!soundEnabled}
              className="pixel-button text-sm py-2 disabled:opacity-50"
            >
              🖱️ Click
            </button>
            <button
              onClick={() => testSound('success')}
              disabled={!soundEnabled}
              className="pixel-button text-sm py-2 disabled:opacity-50"
            >
              ✅ Success
            </button>
            <button
              onClick={() => testSound('failure')}
              disabled={!soundEnabled}
              className="pixel-button text-sm py-2 disabled:opacity-50"
            >
              ❌ Failure
            </button>
            <button
              onClick={() => testSound('celebration')}
              disabled={!soundEnabled}
              className="pixel-button text-sm py-2 disabled:opacity-50"
            >
              🎉 Celebration
            </button>
            <button
              onClick={() => testSound('hint')}
              disabled={!soundEnabled}
              className="pixel-button text-sm py-2 disabled:opacity-50"
            >
              💡 Hint
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-3 mb-4">
          <p className="anime-text-pixel text-blue-300 text-xs">
            💡 Sound effects enhance your gaming experience with audio feedback for actions, successes, and failures.
          </p>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="pixel-button px-6 py-2"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
