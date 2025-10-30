// Comprehensive question database for challenges
// Each anime has 10+ questions per difficulty level

export interface ChallengeQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  anime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: {
    hint1: string;
    hint2: string;
    hint3: string;
  };
}

export const challengeQuestions: ChallengeQuestion[] = [
  // NARUTO - EASY (10 questions)
  {
    id: 'naruto_easy_001',
    question: "What is the name of Naruto's signature jutsu?",
    correctAnswer: 'Shadow Clone Jutsu',
    wrongAnswers: ['Rasengan', 'Chidori', 'Fireball Jutsu'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'It creates multiple copies of the user',
      hint2: 'Naruto learned this jutsu from a forbidden scroll',
      hint3: 'The jutsu name includes the word "Shadow"'
    }
  },
  {
    id: 'naruto_easy_002',
    question: "Who is Naruto's sensei in Team 7?",
    correctAnswer: 'Kakashi Hatake',
    wrongAnswers: ['Iruka Umino', 'Jiraiya', 'Asuma Sarutobi'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'He has silver hair and wears a mask',
      hint2: 'Known as the Copy Ninja',
      hint3: 'He has a Sharingan eye'
    }
  },
  {
    id: 'naruto_easy_003',
    question: 'What is the name of the Nine-Tailed Fox inside Naruto?',
    correctAnswer: 'Kurama',
    wrongAnswers: ['Shukaku', 'Matatabi', 'Isobu'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'It is a powerful tailed beast',
      hint2: 'Has nine tails and orange fur',
      hint3: 'The name starts with "K"'
    }
  },
  {
    id: 'naruto_easy_004',
    question: "Who are Naruto's teammates in Team 7?",
    correctAnswer: 'Sasuke and Sakura',
    wrongAnswers: ['Shikamaru and Choji', 'Kiba and Hinata', 'Neji and Tenten'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'One is an Uchiha, one has pink hair',
      hint2: 'The Uchiha seeks revenge against his brother',
      hint3: 'The girl has a crush on the Uchiha'
    }
  },
  {
    id: 'naruto_easy_005',
    question: 'What village is Naruto from?',
    correctAnswer: 'Hidden Leaf Village',
    wrongAnswers: ['Hidden Sand Village', 'Hidden Mist Village', 'Hidden Cloud Village'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'It is also called Konohagakure',
      hint2: 'The symbol is a leaf',
      hint3: 'It is in the Land of Fire'
    }
  },
  {
    id: 'naruto_easy_006',
    question: 'What does Naruto want to become?',
    correctAnswer: 'Hokage',
    wrongAnswers: ['Anbu Captain', 'Jonin', 'Sage'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'It is the leader of the village',
      hint2: 'The strongest ninja in the village',
      hint3: "Naruto's dream since childhood"
    }
  },
  {
    id: 'naruto_easy_007',
    question: "Who is Sasuke's older brother?",
    correctAnswer: 'Itachi Uchiha',
    wrongAnswers: ['Madara Uchiha', 'Obito Uchiha', 'Shisui Uchiha'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'He massacred the Uchiha clan',
      hint2: 'Member of the Akatsuki',
      hint3: 'Has long black hair in a ponytail'
    }
  },
  {
    id: 'naruto_easy_008',
    question: "What is Sakura's special ability?",
    correctAnswer: 'Medical Ninjutsu and Super Strength',
    wrongAnswers: ['Genjutsu Mastery', 'Lightning Release', 'Summoning Jutsu'],
    anime: 'Naruto',
    difficulty: 'easy',
    hints: {
      hint1: 'She can heal injuries',
      hint2: 'She can punch with incredible force',
      hint3: 'Trained by Tsunade'
    }
  }
];

// Function to get questions for a specific anime and difficulty
export const getQuestionsForChallenge = (
  anime: string, 
  difficulty: 'easy' | 'medium' | 'hard', 
  count: number = 8
): ChallengeQuestion[] => {
  const filtered = challengeQuestions.filter(
    q => q.anime === anime && q.difficulty === difficulty
  );
  
  // Shuffle and return the requested number of questions
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Function to get all available animes
export const getAvailableAnimes = (): string[] => {
  const animes = [...new Set(challengeQuestions.map(q => q.anime))];
  return animes.sort();
};

// Function to get question count for anime/difficulty combination
export const getQuestionCount = (anime: string, difficulty: 'easy' | 'medium' | 'hard'): number => {
  return challengeQuestions.filter(q => q.anime === anime && q.difficulty === difficulty).length;
};
