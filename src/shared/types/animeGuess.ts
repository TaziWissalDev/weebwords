// Anime Guessing Game Types

export interface AnimeGuessQuiz {
  id: string;
  character: string;
  correctAnime: string;
  characterImage: string;
  characterDescription: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: string[];
  hints: {
    character: string;
    context: string;
    emoji: string;
  };
  source: string;
}

export interface AnimeGuessState {
  currentQuiz: AnimeGuessQuiz;
  selectedAnswer: string | null;
  isCompleted: boolean;
  isCorrect: boolean;
  score: number;
  hintsUsed: number;
  timeStarted: number;
  timeCompleted?: number;
  timeRemaining?: number;
  isTimerActive?: boolean;
}

export interface AnimeGuessResponse {
  type: 'anime-guess-result';
  isCorrect: boolean;
  correctAnswer: string;
  score: number;
  feedback: string;
  characterInfo: {
    name: string;
    anime: string;
    description: string;
  };
}

export interface AnimeGuessRequest {
  quizId: string;
  selectedAnswer: string;
  hintsUsed: number;
  timeSpent: number;
}
