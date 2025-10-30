// Comprehensive Character Quiz Database for Regular Game Mode
// Separate from daily challenge questions

import { CharacterQuiz } from '../../shared/types/puzzle';

export const CHARACTER_QUIZ_DATABASE: CharacterQuiz[] = [
  // EASY DIFFICULTY - NARUTO
  {
    id: 'char-naruto-easy-001',
    anime: 'Naruto',
    character: 'Naruto Uzumaki',
    difficulty: 'easy',
    description: 'I dream of becoming Hokage! I have a fox spirit inside me and I love ramen more than anything!',
    characterVoice: 'Dattebayo! I am gonna be the next Hokage!',
    hints: {
      hint1: 'I have blonde hair and blue eyes',
      hint2: 'I wear an orange jumpsuit',
      hint3: 'The Nine-Tailed Fox is sealed inside me',
      finalHint: 'My signature jutsu is the Shadow Clone Technique'
    },
    hintResponses: {
      hint1Response: 'Yeah! My blonde hair is pretty cool, right? Just like the Fourth Hokage!',
      hint2Response: 'Orange is the best color! It makes me stand out and shows my ninja way!',
      hint3Response: 'The Nine-Tails... Kurama and I are partners now. We fight together!',
      finalHintResponse: 'Shadow Clone Jutsu is my specialty! I can make thousands of myself!'
    },
    correctAnswer: 'Naruto Uzumaki',
    alternativeAnswers: ['Naruto', 'Uzumaki Naruto']
  },
  {
    id: 'char-naruto-easy-002',
    anime: 'Naruto',
    character: 'Sakura Haruno',
    difficulty: 'easy',
    description: 'I have pink hair and incredible strength! I am a medical ninja trained by Lady Tsunade.',
    characterVoice: 'Shannarooo! Do not underestimate me!',
    hints: {
      hint1: 'I have pink hair and green eyes',
      hint2: 'I can punch with superhuman strength',
      hint3: 'I am the best medical ninja of my generation',
      finalHint: 'I had a crush on Sasuke since childhood'
    },
    hintResponses: {
      hint1Response: 'My pink hair is natural! And my forehead is not that big!',
      hint2Response: 'I trained under Lady Tsunade to become strong! CHA!',
      hint3Response: 'I can heal any injury and save lives on the battlefield!',
      finalHintResponse: 'Sasuke-kun... I have always cared about him, even when he left the village.'
    },
    correctAnswer: 'Sakura Haruno',
    alternativeAnswers: ['Sakura', 'Haruno Sakura']
  },
  {
    id: 'char-naruto-easy-003',
    anime: 'Naruto',
    character: 'Kakashi Hatake',
    difficulty: 'easy',
    description: 'I am always late and I love reading. I have silver hair and wear a mask. I am known as the Copy Ninja.',
    characterVoice: 'Sorry I am late, I got lost on the path of life.',
    hints: {
      hint1: 'I have silver hair and wear a face mask',
      hint2: 'I am always reading romance novels',
      hint3: 'I have a Sharingan eye that I got from my teammate',
      finalHint: 'I was the sensei of Team 7'
    },
    hintResponses: {
      hint1Response: 'My mask? It is just a habit. And my hair defies gravity naturally.',
      hint2Response: 'Make-Out Paradise is a masterpiece of literature! *ahem*',
      hint3Response: 'This Sharingan... it is a gift from my best friend Obito.',
      finalHintResponse: 'Team 7... Naruto, Sasuke, and Sakura taught me as much as I taught them.'
    },
    correctAnswer: 'Kakashi Hatake',
    alternativeAnswers: ['Kakashi', 'Hatake Kakashi', 'Copy Ninja Kakashi']
  },
  {
    id: 'char-naruto-easy-004',
    anime: 'Naruto',
    character: 'Rock Lee',
    difficulty: 'easy',
    description: 'I cannot use ninjutsu or genjutsu, but my taijutsu is incredible! I have thick eyebrows and wear green spandex.',
    characterVoice: 'The power of youth will never fade!',
    hints: {
      hint1: 'I have very thick eyebrows and a bowl cut',
      hint2: 'I wear a green jumpsuit like my sensei',
      hint3: 'I can only use taijutsu, no ninjutsu or genjutsu',
      finalHint: 'I can open the Eight Gates'
    },
    hintResponses: {
      hint1Response: 'My eyebrows are a symbol of my determination and youth!',
      hint2Response: 'Gai-sensei and I match! Green is the color of youth!',
      hint3Response: 'Hard work can overcome any natural talent! That is my ninja way!',
      finalHintResponse: 'The Eight Gates... the ultimate taijutsu technique that Gai-sensei taught me!'
    },
    correctAnswer: 'Rock Lee',
    alternativeAnswers: ['Lee', 'Rock Lee']
  },

  // EASY DIFFICULTY - ONE PIECE
  {
    id: 'char-onepiece-easy-001',
    anime: 'One Piece',
    character: 'Monkey D. Luffy',
    difficulty: 'easy',
    description: 'I am gonna be the Pirate King! I ate the Gum-Gum Fruit and my body is made of rubber!',
    characterVoice: 'I am gonna be King of the Pirates!',
    hints: {
      hint1: 'I wear a straw hat that is very important to me',
      hint2: 'My body can stretch like rubber',
      hint3: 'I love meat more than anything',
      finalHint: 'Shanks gave me my hat and inspired my dream'
    },
    hintResponses: {
      hint1Response: 'This hat... Shanks gave it to me! I promised to return it when I become a great pirate!',
      hint2Response: 'Gomu Gomu no... my rubber powers are awesome! I can stretch and bounce!',
      hint3Response: 'MEAT! I could eat meat all day! It makes me strong!',
      finalHintResponse: 'Shanks is the coolest! He saved my life and showed me what it means to be a pirate!'
    },
    correctAnswer: 'Monkey D. Luffy',
    alternativeAnswers: ['Luffy', 'Monkey D Luffy', 'Straw Hat Luffy']
  },
  {
    id: 'char-onepiece-easy-002',
    anime: 'One Piece',
    character: 'Roronoa Zoro',
    difficulty: 'easy',
    description: 'I use three swords and I am gonna be the world greatest swordsman! I have terrible sense of direction.',
    characterVoice: 'I will become the world greatest swordsman!',
    hints: {
      hint1: 'I have green hair and three earrings',
      hint2: 'I fight with three swords at once',
      hint3: 'I get lost very easily',
      finalHint: 'I made a promise to a girl named Kuina'
    },
    hintResponses: {
      hint1Response: 'Green hair? Yeah, so what? It is natural!',
      hint2Response: 'Three-sword style is my specialty! Santoryu!',
      hint3Response: 'I do not get lost! The world just moves around me!',
      finalHintResponse: 'Kuina... I promised her I would become the strongest. I will not lose to anyone!'
    },
    correctAnswer: 'Roronoa Zoro',
    alternativeAnswers: ['Zoro', 'Roronoa Zoro', 'Pirate Hunter Zoro']
  },

  // MEDIUM DIFFICULTY
  {
    id: 'char-naruto-medium-001',
    anime: 'Naruto',
    character: 'Itachi Uchiha',
    difficulty: 'medium',
    description: 'I massacred my entire clan to prevent a coup. I joined Akatsuki as a spy and I suffer from a terminal illness.',
    characterVoice: 'Forgive me, Sasuke... this is the last time.',
    hints: {
      hint1: 'I have long black hair and lines under my eyes',
      hint2: 'I killed my entire family except my little brother',
      hint3: 'I am a member of Akatsuki but secretly loyal to Konoha',
      finalHint: 'I used Tsukuyomi and Amaterasu with my Mangekyo Sharingan'
    },
    hintResponses: {
      hint1Response: 'These lines... they are from the tears I have shed for my sins.',
      hint2Response: 'I had to choose between my clan and the village... I chose peace.',
      hint3Response: 'Akatsuki was just a cover. I was always protecting Konoha from the shadows.',
      finalHintResponse: 'My eyes... they have seen too much pain. But it was necessary for peace.'
    },
    correctAnswer: 'Itachi Uchiha',
    alternativeAnswers: ['Itachi', 'Uchiha Itachi']
  },

  // HARD DIFFICULTY
  {
    id: 'char-naruto-hard-001',
    anime: 'Naruto',
    character: 'Madara Uchiha',
    difficulty: 'hard',
    description: 'I founded Konoha with Hashirama but was betrayed. I seek to cast the Infinite Tsukuyomi on the world.',
    characterVoice: 'In this world, wherever there is light, there are also shadows.',
    hints: {
      hint1: 'I have long black hair and can use Perfect Susanoo',
      hint2: 'I was the co-founder of Konohagakure',
      hint3: 'I was resurrected by Edo Tensei during the Fourth War',
      finalHint: 'I seek to become the Ten-Tails Jinchuriki'
    },
    hintResponses: {
      hint1Response: 'This Susanoo... it is the perfect form of the Uchiha power!',
      hint2Response: 'Hashirama and I built this village, but he chose a different path.',
      hint3Response: 'Death was merely a temporary setback. My will transcends mortality.',
      finalHintResponse: 'The Infinite Tsukuyomi will create a world without pain or suffering!'
    },
    correctAnswer: 'Madara Uchiha',
    alternativeAnswers: ['Madara', 'Uchiha Madara']
  }
];

// Function to get character quizzes by difficulty
export const getCharacterQuizzesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): CharacterQuiz[] => {
  return CHARACTER_QUIZ_DATABASE.filter(quiz => quiz.difficulty === difficulty);
};

// Function to get character quizzes by anime
export const getCharacterQuizzesByAnime = (anime: string): CharacterQuiz[] => {
  return CHARACTER_QUIZ_DATABASE.filter(quiz => quiz.anime === anime);
};

// Function to get character quizzes by anime and difficulty
export const getCharacterQuizzes = (anime?: string, difficulty?: 'easy' | 'medium' | 'hard'): CharacterQuiz[] => {
  let filtered = CHARACTER_QUIZ_DATABASE;
  
  if (anime && anime !== 'Mixed') {
    filtered = filtered.filter(quiz => quiz.anime === anime);
  }
  
  if (difficulty) {
    filtered = filtered.filter(quiz => quiz.difficulty === difficulty);
  }
  
  return filtered;
};

// Function to get a random character quiz
export const getRandomCharacterQuiz = (anime?: string, difficulty?: 'easy' | 'medium' | 'hard'): CharacterQuiz | null => {
  const filtered = getCharacterQuizzes(anime, difficulty);
  
  if (filtered.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

// Function to get quiz count
export const getCharacterQuizCount = (anime?: string, difficulty?: 'easy' | 'medium' | 'hard'): number => {
  return getCharacterQuizzes(anime, difficulty).length;
};

// Additional questions to expand the database
// Note: In a production system, you would want to:
// 1. Have a content management system for adding questions
// 2. Load questions from a server/database
// 3. Implement user-generated content with moderation
// 4. Use AI to generate questions automatically
// 5. Have seasonal/event-based questions

// For now, this starter set provides variety across different animes and difficulties
// The system will cycle through available questions and provide fallbacks
