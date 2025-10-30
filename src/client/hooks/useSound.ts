import { useEffect, useCallback } from 'react';
import { SoundService } from '../services/soundService';

// Custom hook for using sound effects in React components
export const useSound = () => {
  // Initialize sound service on first use
  useEffect(() => {
    const initializeSound = async () => {
      await SoundService.initialize();
    };
    
    initializeSound();
  }, []);

  // Resume audio context on user interaction (required by browsers)
  const resumeAudio = useCallback(async () => {
    await SoundService.resumeAudioContext();
  }, []);

  // Play sound effect
  const playSound = useCallback((soundName: string, volume?: number) => {
    SoundService.play(soundName, volume);
  }, []);

  // Sound effect shortcuts
  const sounds = {
    click: () => playSound('click'),
    enter: () => playSound('enter'),
    success: () => playSound('success'),
    failure: () => playSound('failure'),
    hint: () => playSound('hint'),
    celebration: () => playSound('celebration'),
    button: () => playSound('button'),
    correct: () => playSound('correct'),
    wrong: () => playSound('wrong'),
    newQuiz: () => playSound('newQuiz')
  };

  // Settings
  const setVolume = useCallback((volume: number) => {
    SoundService.setVolume(volume);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    SoundService.setEnabled(enabled);
  }, []);

  const getVolume = useCallback(() => {
    return SoundService.getVolume();
  }, []);

  const getEnabled = useCallback(() => {
    return SoundService.getEnabled();
  }, []);

  return {
    playSound,
    sounds,
    resumeAudio,
    setVolume,
    setEnabled,
    getVolume,
    getEnabled
  };
};
