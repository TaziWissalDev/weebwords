export type FeedbackType = 'perfect' | 'good' | 'average' | 'bad';

export interface CharacterFeedback {
  perfect: string[];
  good: string[];
  average: string[];
  bad: string[];
}

export interface AnimeFeedbackPool {
  [character: string]: CharacterFeedback;
}

export const ANIME_FEEDBACK: AnimeFeedbackPool = {
  // Naruto Characters
  'Rock Lee': {
    perfect: ['YOUTH POWER EXPLOSION! 💥', 'The flames of youth burn bright! 🔥', 'Beautiful! A lotus blooms! 🌸'],
    good: ['Your youth is showing! 💪', 'Gai-sensei would be proud! 👍', 'The power of hard work! ⚡'],
    average: ['Keep training! Youth never gives up! 🌱', 'Even geniuses started somewhere! 😅'],
    bad: ['More push-ups needed! 💀', 'The springtime of youth requires effort! 🥲']
  },
  'Naruto Uzumaki': {
    perfect: ['BELIEVE IT! That was amazing! 💥', 'Hokage-level performance! 🍃', 'Rasengan of knowledge! ⚡'],
    good: ['Not bad, dattebayo! 👍', 'You\'re getting stronger! 💪', 'Ichiraku ramen worthy! 🍜'],
    average: ['Keep trying, dattebayo! 😅', 'Even I failed the graduation exam three times! 🌱'],
    bad: ['That was worse than my sexy jutsu! 💀', 'Time for more training, dattebayo! 🥲']
  },
  
  // One Piece Characters
  'Monkey D. Luffy': {
    perfect: ['SUUUUPER! That was awesome! 💥', 'Pirate King material! 👑', 'Gomu Gomu no GENIUS! 🏴‍☠️'],
    good: ['Shishishi! Not bad! 👍', 'You\'re getting stronger! 💪', 'Meat party worthy! 🍖'],
    average: ['Keep going! I believe in you! 😅', 'Even pirates make mistakes! 🌱'],
    bad: ['That was... interesting! 💀', 'Time to train harder! 🥲']
  },
  
  // Death Note Characters
  'Light Yagami': {
    perfect: ['According to my calculations... perfect! 💥', 'Kira-level intellect! 📓', 'Justice has been served! ⚖️'],
    good: ['Acceptable performance 👍', 'Your logic is sound ⚡', 'L would be impressed 🧠'],
    average: ['Room for improvement exists 😅', 'Even gods make errors sometimes 🌱'],
    bad: ['Disappointing... very disappointing 💀', 'This requires more thought 🥲']
  },
  
  // Attack on Titan Characters
  'Eren Yeager': {
    perfect: ['TATAKAE! Perfect execution! 💥', 'Freedom achieved! 🗡️', 'That\'s the spirit of humanity! ⚡'],
    good: ['Good! Keep fighting! 👍', 'Humanity\'s hope! 💪', 'Survey Corps approved! 🦅'],
    average: ['Don\'t give up! Keep moving forward! 😅', 'Every soldier starts somewhere! 🌱'],
    bad: ['We can\'t afford mistakes like this! 💀', 'The titans won\'t wait for you! 🥲']
  },
  
  // Demon Slayer Characters
  'Tanjiro Kamado': {
    perfect: ['Beautiful! Like a perfect water breathing form! 💥', 'Your kindness shows through! 🌊', 'Nezuko would be proud! ✨'],
    good: ['Well done! Your heart is pure! 👍', 'The smell of success! 💪', 'Demon slayer worthy! ⚡'],
    average: ['Keep trying! I believe in your potential! 😅', 'Even the strongest had to learn! 🌱'],
    bad: ['Don\'t lose hope! We all struggle! 💀', 'Let me help you improve! 🥲']
  },
  
  // My Hero Academia Characters
  'All Might': {
    perfect: ['PLUS ULTRA! Magnificent! 💥', 'True hero performance! 💪', 'Symbol of Peace approved! ✨'],
    good: ['Excellent work, young hero! 👍', 'Your quirk is developing! ⚡', 'Hero material! 🦸'],
    average: ['Keep training! Heroes never give up! 😅', 'Even I had to learn control! 🌱'],
    bad: ['A hero must do better! 💀', 'More training is needed! 🥲']
  },
  
  // Jujutsu Kaisen Characters
  'Yuji Itadori': {
    perfect: ['Incredible! That was amazing! 💥', 'Sukuna\'s impressed (maybe)! 👹', 'Jujutsu sorcerer level! ⚡'],
    good: ['Nice work! You\'re getting stronger! 👍', 'Gojo-sensei would approve! 💪', 'Cursed energy flowing! ✨'],
    average: ['Keep going! We all start somewhere! 😅', 'Even sorcerers make mistakes! 🌱'],
    bad: ['Ouch... that hurt to watch! 💀', 'Time for more training! 🥲']
  },
  
  // Spy x Family Characters
  'Anya Forger': {
    perfect: ['Waku waku! That was perfect! 💥', 'Anya is impressed! ⭐', 'Peanuts for everyone! 🥜'],
    good: ['Good job! Anya approves! 👍', 'Papa would be proud! 💪', 'Elegant! ✨'],
    average: ['Anya thinks you can do better! 😅', 'Even Anya makes mistakes! 🌱'],
    bad: ['Anya is disappointed... 💀', 'More studying needed! 🥲']
  },
  
  // Bleach Characters
  'Ichigo Kurosaki': {
    perfect: ['Bankai-level performance! 💥', 'Soul Reaper approved! ⚔️', 'Hollow-crushing good! 👹'],
    good: ['Not bad! Getting stronger! 👍', 'Your spiritual pressure is rising! ⚡', 'Rukia would be impressed! 💪'],
    average: ['Keep training! Protect what matters! 😅', 'Even captains had to learn! 🌱'],
    bad: ['That was... rough! 💀', 'Time to get serious! 🥲']
  },
  
  // Dragon Ball Z Characters
  'Goku': {
    perfect: ['Kamehameha of knowledge! 💥', 'Ultra Instinct achieved! ⚡', 'That was incredible! 🔥'],
    good: ['Great job! You\'re getting stronger! 👍', 'Vegeta would be jealous! 💪', 'Saiyan pride! 🦍'],
    average: ['Keep training! I believe in you! 😅', 'Even I lost fights before! 🌱'],
    bad: ['Oops! Time for more training! 💀', 'Don\'t give up! 🥲']
  },
  
  // Default fallbacks for unknown characters
  'Unknown': {
    perfect: ['Legendary performance! 💥', 'Anime protagonist energy! ⚡', 'Main character moment! 🌟'],
    good: ['Solid work, future hero! 👍', 'Your power level is rising! 💪', 'Senpai approved! ✨'],
    average: ['Training arc in progress! 😅', 'Even legends started somewhere! 🌱'],
    bad: ['Plot armor needed! 💀', 'Time for a training montage! 🥲']
  }
};
