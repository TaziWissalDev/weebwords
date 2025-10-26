import { useCallback, useEffect, useState } from 'react';
import type { InitResponse, GetPuzzleResponse, SubmitSolutionRequest, SubmitSolutionResponse } from '../../shared/types/api';
import { AnimePuzzle, GameStats } from '../../shared/types/puzzle';

interface PuzzleGameState {
  currentPuzzle: AnimePuzzle | null;
  gameStats: GameStats;
  username: string | null;
  loading: boolean;
  error: string | null;
}

export const usePuzzleGame = () => {
  const [state, setState] = useState<PuzzleGameState>({
    currentPuzzle: null,
    gameStats: {
      totalPuzzlesSolved: 0,
      averageHintsUsed: 0,
      favoriteAnime: '',
      currentStreak: 0
    },
    username: null,
    loading: true,
    error: null
  });

  // Initialize game data
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        if (data.type !== 'init') throw new Error('Unexpected response');
        
        setState({
          currentPuzzle: data.currentPuzzle,
          gameStats: data.gameStats,
          username: data.username,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Failed to init puzzle game', err);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: err instanceof Error ? err.message : 'Failed to initialize game'
        }));
      }
    };
    void init();
  }, []);

  // Get a new puzzle
  const getNewPuzzle = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const res = await fetch('/api/puzzle/new');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: GetPuzzleResponse = await res.json();
      
      if (data.type !== 'puzzle') throw new Error('Unexpected response');
      
      setState(prev => ({
        ...prev,
        currentPuzzle: data.puzzle,
        loading: false
      }));
      
      return data.puzzle;
    } catch (err) {
      console.error('Failed to get new puzzle', err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'Failed to get new puzzle'
      }));
      return null;
    }
  }, []);

  // Submit puzzle solution
  const submitSolution = useCallback(async (
    puzzleId: string, 
    solution: string[], 
    hintsUsed: number
  ) => {
    try {
      const requestData: SubmitSolutionRequest = {
        puzzleId,
        solution,
        hintsUsed
      };

      const res = await fetch('/api/puzzle/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SubmitSolutionResponse = await res.json();
      
      if (data.type !== 'solution') throw new Error('Unexpected response');
      
      // Update current puzzle if there's a next one
      if (data.nextPuzzle) {
        setState(prev => ({
          ...prev,
          currentPuzzle: data.nextPuzzle,
          gameStats: {
            ...prev.gameStats,
            totalPuzzlesSolved: prev.gameStats.totalPuzzlesSolved + (data.isCorrect ? 1 : 0),
            currentStreak: data.isCorrect ? prev.gameStats.currentStreak + 1 : 0
          }
        }));
      }
      
      return data;
    } catch (err) {
      console.error('Failed to submit solution', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to submit solution'
      }));
      return null;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getNewPuzzle,
    submitSolution,
    clearError
  } as const;
};
