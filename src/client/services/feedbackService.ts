import { ANIME_FEEDBACK, FeedbackType, CharacterFeedback } from '../../shared/types/feedback';

export class FeedbackService {
  static getFeedback(
    character: string, 
    score: number, 
    maxScore: number, 
    hintsUsed: number
  ): string {
    const feedbackType = this.determineFeedbackType(score, maxScore, hintsUsed);
    const characterFeedback = this.getCharacterFeedback(character);
    const feedbackArray = characterFeedback[feedbackType];
    
    // Get random feedback from the array
    const randomIndex = Math.floor(Math.random() * feedbackArray.length);
    return feedbackArray[randomIndex];
  }

  private static determineFeedbackType(
    score: number, 
    maxScore: number, 
    hintsUsed: number
  ): FeedbackType {
    const percentage = (score / maxScore) * 100;
    
    // Perfect: 90%+ score with 0-1 hints
    if (percentage >= 90 && hintsUsed <= 1) {
      return 'perfect';
    }
    
    // Good: 70%+ score with 0-2 hints
    if (percentage >= 70 && hintsUsed <= 2) {
      return 'good';
    }
    
    // Average: 40%+ score or any score with many hints
    if (percentage >= 40) {
      return 'average';
    }
    
    // Bad: Low score
    return 'bad';
  }

  private static getCharacterFeedback(character: string): CharacterFeedback {
    // Try exact character match first
    if (ANIME_FEEDBACK[character]) {
      return ANIME_FEEDBACK[character];
    }
    
    // Try partial matches for character variations
    const characterKey = Object.keys(ANIME_FEEDBACK).find(key => 
      key.toLowerCase().includes(character.toLowerCase()) ||
      character.toLowerCase().includes(key.toLowerCase())
    );
    
    if (characterKey) {
      return ANIME_FEEDBACK[characterKey];
    }
    
    // Fallback to unknown character
    return ANIME_FEEDBACK['Unknown'];
  }

  static getWrongAnswerFeedback(character: string): string {
    const characterFeedback = this.getCharacterFeedback(character);
    const badFeedback = characterFeedback.bad;
    const randomIndex = Math.floor(Math.random() * badFeedback.length);
    return badFeedback[randomIndex];
  }

  static getHintFeedback(character: string, hintNumber: number): string {
    // Character-specific hint reactions
    const hintReactions: { [key: string]: string[] } = {
      'Rock Lee': [
        'The flames of youth guide you! 🔥',
        'Let your passion show the way! 💪',
        'Youth never gives up! Keep going! ⚡'
      ],
      'Naruto Uzumaki': [
        'Believe it! Here\'s a hint, dattebayo! 🍃',
        'Even Hokages need help sometimes! 💪',
        'Don\'t give up! That\'s my ninja way! ⚡'
      ],
      'Monkey D. Luffy': [
        'Shishishi! Let me help you out! 🏴‍☠️',
        'Pirates help their crew! 💪',
        'Adventure requires teamwork! ⚡'
      ],
      'Light Yagami': [
        'Allow me to enlighten you... 📓',
        'Knowledge is power, use it wisely ⚡',
        'Even gods provide guidance 💭'
      ],
      'Tanjiro Kamado': [
        'Let me help you with kindness! 🌊',
        'We\'re stronger when we help each other! 💪',
        'Don\'t worry, I believe in you! ✨'
      ],
      'Anya Forger': [
        'Anya will share her wisdom! ⭐',
        'Waku waku! Here\'s a clue! 🥜',
        'Elegant assistance incoming! ✨'
      ]
    };

    const characterReactions = hintReactions[character] || [
      'Here\'s some help! 💡',
      'Let me guide you! ⚡',
      'Don\'t worry, we\'ve got this! 💪'
    ];

    const reactionIndex = Math.min(hintNumber - 1, characterReactions.length - 1);
    return characterReactions[reactionIndex];
  }

  static getCompletionFeedback(character: string, totalScore: number): string {
    const completionMessages: { [key: string]: string[] } = {
      'Rock Lee': [
        'The beautiful lotus of knowledge has bloomed! 🌸',
        'Your youth has conquered this challenge! 💪',
        'Gai-sensei would shed tears of joy! 😭'
      ],
      'Naruto Uzumaki': [
        'Dattebayo! You did it! 🍃',
        'That\'s the spirit of a future Hokage! 👑',
        'Believe it! You\'re amazing! ⚡'
      ],
      'Monkey D. Luffy': [
        'Shishishi! You\'re definitely crew material! 🏴‍☠️',
        'That was an adventure worth taking! 🌊',
        'Meat party to celebrate! 🍖'
      ],
      'Light Yagami': [
        'Impressive intellectual capacity... 🧠',
        'Your logic rivals even L\'s... 📓',
        'Justice has been served efficiently ⚖️'
      ],
      'Tanjiro Kamado': [
        'Your kind heart led you to victory! ❤️',
        'Beautiful work, like perfect water breathing! 🌊',
        'Nezuko would be so proud! 👹'
      ],
      'Anya Forger': [
        'Waku waku! Anya is super impressed! ⭐',
        'Elegant victory! Papa would be proud! 🥜',
        'Time for peanuts celebration! 🎉'
      ]
    };

    const messages = completionMessages[character] || [
      'Incredible work! You\'re a true anime hero! 🌟',
      'Legendary performance! 💥',
      'You\'ve mastered this challenge! ⚡'
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }
}
