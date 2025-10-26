import { DailyPack, Puzzle, PuzzleType } from '../../shared/types/daily-pack';

export class MockDailyPackService {
  static generateMockDailyPack(): DailyPack {
    const today = new Date().toISOString().split('T')[0];
    
    const puzzles: Puzzle[] = [
      // Quote Fill Puzzle
      {
        id: 'quote_fill_1',
        type: 'quote_fill',
        anime: 'Naruto',
        character: 'Naruto Uzumaki',
        data: {
          quote: 'I never go back on my ____!',
          options: ['word', 'promise', 'ninja', 'way'],
          correct: [0], // "word" is correct
          original: 'I never go back on my word!'
        },
        feedback: {
          perfect: 'Naruto: "Perfect! You know my words by heart!"',
          good: 'Naruto: "Well done! You understand me!"',
          average: 'Naruto: "Not bad, but you can do better!"',
          bad: 'Naruto: "Did you even listen to what I said?"'
        },
        pixel_reaction: {
          on_correct: 'naruto_cheer',
          on_fail: 'naruto_disappointed'
        }
      },
      
      // Who Said It Puzzle
      {
        id: 'who_said_it_1',
        type: 'who_said_it',
        anime: 'One Piece',
        character: 'Monkey D. Luffy',
        data: {
          quote: 'I will become the Pirate King!',
          options: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Sanji'],
          correct: 0 // Luffy is correct
        },
        feedback: {
          perfect: 'Luffy: "You know exactly who I am!"',
          good: 'Luffy: "You recognized my voice!"',
          average: 'Luffy: "Close, but not quite right!"',
          bad: 'Luffy: "Do I really sound like them?"'
        },
        pixel_reaction: {
          on_correct: 'luffy_grin',
          on_fail: 'luffy_confused'
        }
      },
      
      // Emoji Sensei Puzzle
      {
        id: 'emoji_sensei_1',
        type: 'emoji_sensei',
        anime: 'Demon Slayer',
        character: 'Tanjiro Kamado',
        data: {
          text: 'Express determination and kindness: ____ ____',
          blanks: ['determination', 'kindness'],
          correct_emojis: ['💪', '❤️'],
          emoji_options: ['💪', '❤️', '😢', '⚔️', '🔥', '🌸', '⭐', '💎']
        },
        feedback: {
          perfect: 'Tanjiro: "Your emoji mastery is incredible!"',
          good: 'Tanjiro: "Good emotional understanding!"',
          average: 'Tanjiro: "You\'re getting the hang of it!"',
          bad: 'Tanjiro: "Emotions are more complex than that!"'
        },
        pixel_reaction: {
          on_correct: 'tanjiro_smile',
          on_fail: 'tanjiro_sigh'
        }
      },
      
      // Mood Match Puzzle
      {
        id: 'mood_match_1',
        type: 'mood_match',
        anime: 'Attack on Titan',
        character: 'Eren Yeager',
        data: {
          quote: 'If you win, you live. If you lose, you die.',
          context: 'Eren speaking about the harsh reality of their world',
          mood_options: ['😤', '😢', '😊', '😨'],
          correct: 0 // 😤 (determined/serious)
        },
        feedback: {
          perfect: 'Eren: "You perfectly captured my feelings!"',
          good: 'Eren: "You understand my emotions!"',
          average: 'Eren: "You\'re reading the mood okay!"',
          bad: 'Eren: "That\'s not how I was feeling at all!"'
        },
        pixel_reaction: {
          on_correct: 'eren_determined',
          on_fail: 'eren_angry'
        }
      },
      
      // Who Am I Puzzle
      {
        id: 'who_am_i_1',
        type: 'who_am_i',
        anime: 'My Hero Academia',
        character: 'Izuku Midoriya',
        data: {
          riddle: 'I was born quirkless but inherited the power of the Symbol of Peace!',
          hints: [
            'I have a quirk called One For All',
            'I study at U.A. High School in Class 1-A',
            'My hero name is Deku and I have green hair'
          ] as [string, string, string],
          answer: 'Izuku Midoriya',
          alternatives: ['Deku', 'Midoriya']
        },
        feedback: {
          perfect: 'Deku: "You figured me out completely!"',
          good: 'Deku: "You know me well!"',
          average: 'Deku: "You\'re on the right track!"',
          bad: 'Deku: "You need more clues about me!"'
        },
        pixel_reaction: {
          on_correct: 'deku_excited',
          on_fail: 'deku_nervous'
        }
      }
    ];

    return {
      meta: {
        date: today,
        language: 'en',
        pack: `daily-${today}`
      },
      puzzles
    };
  }

  static validateAnswer(puzzle: Puzzle, answer: any): { correct: boolean; accuracy: number } {
    switch (puzzle.type) {
      case 'quote_fill':
        const correctIndices = puzzle.data.correct;
        const isCorrect = correctIndices.includes(puzzle.data.options.indexOf(answer));
        return { correct: isCorrect, accuracy: isCorrect ? 1 : 0 };
        
      case 'who_said_it':
        const correctOption = puzzle.data.options[puzzle.data.correct];
        const isWhoSaidItCorrect = correctOption.toLowerCase() === answer.toLowerCase();
        return { correct: isWhoSaidItCorrect, accuracy: isWhoSaidItCorrect ? 1 : 0 };
        
      case 'emoji_sensei':
        // For demo, just check if any correct emoji is selected
        const hasCorrectEmoji = puzzle.data.correct_emojis.some(emoji => 
          Array.isArray(answer) ? answer.includes(emoji) : answer === emoji
        );
        return { correct: hasCorrectEmoji, accuracy: hasCorrectEmoji ? 0.8 : 0.2 };
        
      case 'mood_match':
        const correctMood = puzzle.data.mood_options[puzzle.data.correct];
        const isMoodCorrect = correctMood === answer;
        return { correct: isMoodCorrect, accuracy: isMoodCorrect ? 1 : 0 };
        
      case 'who_am_i':
        const answerLower = answer.toLowerCase().trim();
        const correctAnswer = puzzle.data.answer.toLowerCase();
        const alternatives = puzzle.data.alternatives.map(alt => alt.toLowerCase());
        const isWhoAmICorrect = answerLower === correctAnswer || alternatives.includes(answerLower);
        return { correct: isWhoAmICorrect, accuracy: isWhoAmICorrect ? 1 : 0 };
        
      default:
        return { correct: false, accuracy: 0 };
    }
  }

  static calculateScore(accuracy: number, timeMs: number, hintsUsed: number, puzzleType: PuzzleType): number {
    let baseScore = Math.round(accuracy * 100);
    
    // Type-specific scoring
    if (puzzleType === 'who_am_i') {
      baseScore = Math.max(baseScore - (hintsUsed * 20), 0);
    }
    
    // Speed bonus (max 20 points)
    const speedBonus = Math.min(Math.max(0, (30000 - timeMs) / 30000) * 20, 20);
    
    return Math.round(baseScore + speedBonus);
  }
}
