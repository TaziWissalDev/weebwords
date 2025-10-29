import { AnimePuzzle } from '../../shared/types/puzzle';

// Comprehensive puzzle dataset: 5 puzzles per anime per difficulty level
export const COMPREHENSIVE_ANIME_PUZZLES: AnimePuzzle[] = [
  // NARUTO - EASY (5 puzzles)
  {
    id: 'naruto-easy-001',
    anime: 'Naruto',
    character: 'Naruto Uzumaki',
    difficulty: 'easy',
    quote_original: 'I will become Hokage!',
    quote_puzzle: 'I will become ____!',
    blanks: ['Hokage'],
    tiles: ['Hokage', 'ninja', 'strong', 'leader', 'hero', 'champion', 'master', 'sensei'],
    distractors: ['ninja', 'strong', 'leader', 'hero', 'champion', 'master', 'sensei'],
    hints: {
      character: 'Orange jumpsuit wearing ninja with whisker marks',
      context: 'His lifelong dream and goal',
      emoji: '🍃👑'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-easy-002',
    anime: 'Naruto',
    character: 'Rock Lee',
    difficulty: 'easy',
    quote_original: 'A dropout will beat a genius through hard work.',
    quote_puzzle: 'A ____ will beat a ____ through hard work.',
    blanks: ['dropout', 'genius'],
    tiles: ['dropout', 'genius', 'student', 'master', 'loser', 'winner', 'fighter', 'ninja'],
    distractors: ['student', 'master', 'loser', 'winner', 'fighter', 'ninja'],
    hints: {
      character: 'Green jumpsuit and endless push-ups',
      context: 'Training vs Neji arc',
      emoji: '💪🍃'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-easy-003',
    anime: 'Naruto',
    character: 'Iruka Umino',
    difficulty: 'easy',
    quote_original: 'Never give up!',
    quote_puzzle: 'Never ____ ____!',
    blanks: ['give', 'up'],
    tiles: ['give', 'up', 'back', 'down', 'stop', 'quit', 'run', 'away'],
    distractors: ['back', 'down', 'stop', 'quit', 'run', 'away'],
    hints: {
      character: 'Academy teacher with scar across nose',
      context: 'Encouraging his students',
      emoji: '📚💪'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-easy-004',
    anime: 'Naruto',
    character: 'Hinata Hyuga',
    difficulty: 'easy',
    quote_original: 'I want to be strong too!',
    quote_puzzle: 'I want to be ____ too!',
    blanks: ['strong'],
    tiles: ['strong', 'brave', 'fast', 'smart', 'kind', 'happy', 'useful', 'better'],
    distractors: ['brave', 'fast', 'smart', 'kind', 'happy', 'useful', 'better'],
    hints: {
      character: 'Shy girl with white eyes and dark hair',
      context: 'Her determination to improve',
      emoji: '👁️💜'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-easy-005',
    anime: 'Naruto',
    character: 'Kakashi Hatake',
    difficulty: 'easy',
    quote_original: 'Teamwork is everything.',
    quote_puzzle: '____ is everything.',
    blanks: ['Teamwork'],
    tiles: ['Teamwork', 'Friendship', 'Power', 'Training', 'Victory', 'Strength', 'Courage', 'Honor'],
    distractors: ['Friendship', 'Power', 'Training', 'Victory', 'Strength', 'Courage', 'Honor'],
    hints: {
      character: 'Copy ninja with silver hair and mask',
      context: 'Teaching Team 7 about cooperation',
      emoji: '👥⚡'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },

  // NARUTO - MEDIUM (5 puzzles)
  {
    id: 'naruto-medium-001',
    anime: 'Naruto',
    character: 'Sasuke Uchiha',
    difficulty: 'medium',
    quote_original: 'I have long since closed my eyes. My only goal is in the darkness.',
    quote_puzzle: 'I have long since closed my ____. My only goal is in the ____.',
    blanks: ['eyes', 'darkness'],
    tiles: ['eyes', 'darkness', 'heart', 'light', 'mind', 'shadow', 'soul', 'past'],
    distractors: ['heart', 'light', 'mind', 'shadow', 'soul', 'past'],
    hints: {
      character: 'Last Uchiha with Sharingan eyes',
      context: 'His path of revenge and isolation',
      emoji: '👁️⚫'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-medium-002',
    anime: 'Naruto',
    character: 'Gaara',
    difficulty: 'medium',
    quote_original: 'I fight for my sake only and live to love only myself.',
    quote_puzzle: 'I fight for my ____ only and live to love only ____.',
    blanks: ['sake', 'myself'],
    tiles: ['sake', 'myself', 'village', 'others', 'power', 'family', 'friends', 'people'],
    distractors: ['village', 'others', 'power', 'family', 'friends', 'people'],
    hints: {
      character: 'Sand ninja with red hair and dark circles',
      context: 'His lonely philosophy before change',
      emoji: '🏜️💔'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-medium-003',
    anime: 'Naruto',
    character: 'Jiraiya',
    difficulty: 'medium',
    quote_original: 'A real ninja is one who endures no matter what gets thrown at him.',
    quote_puzzle: 'A real ninja is one who ____ no matter what gets thrown at him.',
    blanks: ['endures'],
    tiles: ['endures', 'fights', 'runs', 'hides', 'survives', 'struggles', 'persists', 'continues'],
    distractors: ['fights', 'runs', 'hides', 'survives', 'struggles', 'persists', 'continues'],
    hints: {
      character: 'White-haired sage and author',
      context: 'Teaching about ninja perseverance',
      emoji: '📖🐸'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-medium-004',
    anime: 'Naruto',
    character: 'Neji Hyuga',
    difficulty: 'medium',
    quote_original: 'Fate is not a cage except for those who fear it.',
    quote_puzzle: 'Fate is not a ____ except for those who ____ it.',
    blanks: ['cage', 'fear'],
    tiles: ['cage', 'fear', 'prison', 'love', 'trap', 'hate', 'barrier', 'embrace'],
    distractors: ['prison', 'love', 'trap', 'hate', 'barrier', 'embrace'],
    hints: {
      character: 'Byakugan user with long brown hair',
      context: 'His changed view on destiny',
      emoji: '👁️🕊️'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-medium-005',
    anime: 'Naruto',
    character: 'Shikamaru Nara',
    difficulty: 'medium',
    quote_original: 'How troublesome. I guess I have no choice.',
    quote_puzzle: 'How ____. I guess I have no ____.',
    blanks: ['troublesome', 'choice'],
    tiles: ['troublesome', 'choice', 'annoying', 'option', 'boring', 'chance', 'difficult', 'way'],
    distractors: ['annoying', 'option', 'boring', 'chance', 'difficult', 'way'],
    hints: {
      character: 'Lazy genius with shadow jutsu',
      context: 'His reluctant acceptance of responsibility',
      emoji: '🌫️😴'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },

  // NARUTO - HARD (5 puzzles)
  {
    id: 'naruto-hard-001',
    anime: 'Naruto',
    character: 'Itachi Uchiha',
    difficulty: 'hard',
    quote_original: 'Those who forgive themselves and are able to accept their true nature, they are the strong ones.',
    quote_puzzle: 'Those who forgive themselves and are able to accept their ____ ____, they are the ____ ones.',
    blanks: ['true', 'nature', 'strong'],
    tiles: ['true', 'nature', 'strong', 'false', 'destiny', 'weak', 'real', 'character', 'brave'],
    distractors: ['false', 'destiny', 'weak', 'real', 'character', 'brave'],
    hints: {
      character: 'Sasuke\'s older brother with Mangekyo Sharingan',
      context: 'His wisdom about self-acceptance',
      emoji: '👁️🔴'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-hard-002',
    anime: 'Naruto',
    character: 'Pain',
    difficulty: 'hard',
    quote_original: 'The concept of hope is nothing more than giving up. A word that holds no true meaning.',
    quote_puzzle: 'The concept of ____ is nothing more than giving up. A word that holds no ____ ____.',
    blanks: ['hope', 'true', 'meaning'],
    tiles: ['hope', 'true', 'meaning', 'love', 'false', 'purpose', 'peace', 'real', 'value'],
    distractors: ['love', 'false', 'purpose', 'peace', 'real', 'value'],
    hints: {
      character: 'Leader of Akatsuki with Rinnegan eyes',
      context: 'His nihilistic philosophy',
      emoji: '👁️💜'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-hard-003',
    anime: 'Naruto',
    character: 'Madara Uchiha',
    difficulty: 'hard',
    quote_original: 'In this world, wherever there is light, there are also shadows.',
    quote_puzzle: 'In this world, wherever there is ____, there are also ____.',
    blanks: ['light', 'shadows'],
    tiles: ['light', 'shadows', 'darkness', 'hope', 'good', 'evil', 'peace', 'war'],
    distractors: ['darkness', 'hope', 'good', 'evil', 'peace', 'war'],
    hints: {
      character: 'Legendary Uchiha founder',
      context: 'His philosophy about duality',
      emoji: '⚫⚪'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-hard-004',
    anime: 'Naruto',
    character: 'Hashirama Senju',
    difficulty: 'hard',
    quote_original: 'The village does exist to protect the people living in it. A Hokage\'s duty is to protect the village.',
    quote_puzzle: 'The village does exist to protect the people living in it. A ____\'s duty is to protect the ____.',
    blanks: ['Hokage', 'village'],
    tiles: ['Hokage', 'village', 'ninja', 'people', 'leader', 'nation', 'shinobi', 'community'],
    distractors: ['ninja', 'people', 'leader', 'nation', 'shinobi', 'community'],
    hints: {
      character: 'First Hokage and Wood Style user',
      context: 'His philosophy of leadership',
      emoji: '🌳👑'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },
  {
    id: 'naruto-hard-005',
    anime: 'Naruto',
    character: 'Obito Uchiha',
    difficulty: 'hard',
    quote_original: 'Those who break the rules are scum, but those who abandon their friends are worse than scum.',
    quote_puzzle: 'Those who break the rules are ____, but those who abandon their friends are worse than ____.',
    blanks: ['scum', 'scum'],
    tiles: ['scum', 'trash', 'weak', 'cowards', 'fools', 'losers', 'nothing', 'worthless'],
    distractors: ['trash', 'weak', 'cowards', 'fools', 'losers', 'nothing', 'worthless'],
    hints: {
      character: 'Kakashi\'s former teammate turned villain',
      context: 'Kakashi\'s lesson about friendship',
      emoji: '👥💔'
    },
    source: 'https://anilist.co/anime/20/Naruto'
  },

  // ONE PIECE - EASY (5 puzzles)
  {
    id: 'onepiece-easy-001',
    anime: 'One Piece',
    character: 'Monkey D. Luffy',
    difficulty: 'easy',
    quote_original: 'I will become the Pirate King!',
    quote_puzzle: 'I will become the ____ ____!',
    blanks: ['Pirate', 'King'],
    tiles: ['Pirate', 'King', 'Marine', 'Admiral', 'Captain', 'Hero', 'Legend', 'Emperor'],
    distractors: ['Marine', 'Admiral', 'Captain', 'Hero', 'Legend', 'Emperor'],
    hints: {
      character: 'Straw hat wearing rubber boy',
      context: 'His lifelong dream declaration',
      emoji: '👑🏴‍☠️'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-easy-002',
    anime: 'One Piece',
    character: 'Roronoa Zoro',
    difficulty: 'easy',
    quote_original: 'I will become the greatest swordsman!',
    quote_puzzle: 'I will become the greatest ____!',
    blanks: ['swordsman'],
    tiles: ['swordsman', 'fighter', 'warrior', 'pirate', 'ninja', 'samurai', 'knight', 'hero'],
    distractors: ['fighter', 'warrior', 'pirate', 'ninja', 'samurai', 'knight', 'hero'],
    hints: {
      character: 'Three-sword style fighter with green hair',
      context: 'His dream and promise to Kuina',
      emoji: '⚔️💚'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-easy-003',
    anime: 'One Piece',
    character: 'Nami',
    difficulty: 'easy',
    quote_original: 'I want to draw a map of the world!',
    quote_puzzle: 'I want to draw a ____ of the ____!',
    blanks: ['map', 'world'],
    tiles: ['map', 'world', 'picture', 'ocean', 'chart', 'island', 'book', 'sea'],
    distractors: ['picture', 'ocean', 'chart', 'island', 'book', 'sea'],
    hints: {
      character: 'Orange-haired navigator and thief',
      context: 'Her dream as a cartographer',
      emoji: '🗺️🍊'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-easy-004',
    anime: 'One Piece',
    character: 'Usopp',
    difficulty: 'easy',
    quote_original: 'I am a brave warrior of the sea!',
    quote_puzzle: 'I am a ____ warrior of the ____!',
    blanks: ['brave', 'sea'],
    tiles: ['brave', 'sea', 'coward', 'land', 'strong', 'ocean', 'weak', 'island'],
    distractors: ['coward', 'land', 'strong', 'ocean', 'weak', 'island'],
    hints: {
      character: 'Long-nosed sniper with curly hair',
      context: 'His aspiration despite his fears',
      emoji: '🎯🌊'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-easy-005',
    anime: 'One Piece',
    character: 'Sanji',
    difficulty: 'easy',
    quote_original: 'I will find the All Blue!',
    quote_puzzle: 'I will find the ____ ____!',
    blanks: ['All', 'Blue'],
    tiles: ['All', 'Blue', 'Grand', 'Line', 'New', 'World', 'Red', 'Sea'],
    distractors: ['Grand', 'Line', 'New', 'World', 'Red', 'Sea'],
    hints: {
      character: 'Blonde cook who never hits women',
      context: 'His dream of the legendary sea',
      emoji: '🍳💙'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },

  // ONE PIECE - MEDIUM (5 puzzles)
  {
    id: 'onepiece-medium-001',
    anime: 'One Piece',
    character: 'Portgas D. Ace',
    difficulty: 'medium',
    quote_original: 'I have no regrets! I lived my life the way I wanted to!',
    quote_puzzle: 'I have no ____! I lived my life the way I wanted to!',
    blanks: ['regrets'],
    tiles: ['regrets', 'fears', 'doubts', 'worries', 'shame', 'guilt', 'sorrow', 'pain'],
    distractors: ['fears', 'doubts', 'worries', 'shame', 'guilt', 'sorrow', 'pain'],
    hints: {
      character: 'Fire Fist and Luffy\'s sworn brother',
      context: 'His final words at Marineford',
      emoji: '🔥👊'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-medium-002',
    anime: 'One Piece',
    character: 'Nico Robin',
    difficulty: 'medium',
    quote_original: 'I want to live! Take me out to sea with you!',
    quote_puzzle: 'I want to ____! Take me out to ____ with you!',
    blanks: ['live', 'sea'],
    tiles: ['live', 'sea', 'die', 'land', 'survive', 'ocean', 'escape', 'island'],
    distractors: ['die', 'land', 'survive', 'ocean', 'escape', 'island'],
    hints: {
      character: 'Archaeologist who can read Poneglyphs',
      context: 'Her emotional plea at Enies Lobby',
      emoji: '📚🌸'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-medium-003',
    anime: 'One Piece',
    character: 'Tony Tony Chopper',
    difficulty: 'medium',
    quote_original: 'Even if I become a monster, I will save my friends!',
    quote_puzzle: 'Even if I become a ____, I will save my ____!',
    blanks: ['monster', 'friends'],
    tiles: ['monster', 'friends', 'human', 'enemies', 'demon', 'family', 'beast', 'crew'],
    distractors: ['human', 'enemies', 'demon', 'family', 'beast', 'crew'],
    hints: {
      character: 'Reindeer doctor with blue nose',
      context: 'His determination to protect others',
      emoji: '🦌💊'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-medium-004',
    anime: 'One Piece',
    character: 'Franky',
    difficulty: 'medium',
    quote_original: 'A man should be strong enough to protect what he loves!',
    quote_puzzle: 'A man should be ____ enough to protect what he ____!',
    blanks: ['strong', 'loves'],
    tiles: ['strong', 'loves', 'weak', 'hates', 'brave', 'fears', 'tough', 'values'],
    distractors: ['weak', 'hates', 'brave', 'fears', 'tough', 'values'],
    hints: {
      character: 'Cyborg shipwright with blue hair',
      context: 'His philosophy about strength',
      emoji: '🤖🔧'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-medium-005',
    anime: 'One Piece',
    character: 'Brook',
    difficulty: 'medium',
    quote_original: 'I may be just bones, but my heart still beats for my friends!',
    quote_puzzle: 'I may be just ____, but my ____ still beats for my friends!',
    blanks: ['bones', 'heart'],
    tiles: ['bones', 'heart', 'flesh', 'soul', 'skeleton', 'mind', 'skull', 'spirit'],
    distractors: ['flesh', 'soul', 'skeleton', 'mind', 'skull', 'spirit'],
    hints: {
      character: 'Skeleton musician with afro',
      context: 'His loyalty despite being undead',
      emoji: '💀🎵'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },

  // ONE PIECE - HARD (5 puzzles)
  {
    id: 'onepiece-hard-001',
    anime: 'One Piece',
    character: 'Gol D. Roger',
    difficulty: 'hard',
    quote_original: 'Inherited will, the destiny of age, the dreams of people. These are things that cannot be stopped.',
    quote_puzzle: '____ will, the destiny of ____, the dreams of people. These are things that cannot be ____.',
    blanks: ['Inherited', 'age', 'stopped'],
    tiles: ['Inherited', 'age', 'stopped', 'Forgotten', 'youth', 'started', 'Lost', 'time', 'changed'],
    distractors: ['Forgotten', 'youth', 'started', 'Lost', 'time', 'changed'],
    hints: {
      character: 'The Pirate King himself',
      context: 'His philosophy about the will of D',
      emoji: '👑⚡'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-hard-002',
    anime: 'One Piece',
    character: 'Whitebeard',
    difficulty: 'hard',
    quote_original: 'The One Piece is real! And it will be found by the one who inherits Roger\'s will!',
    quote_puzzle: 'The One Piece is ____! And it will be found by the one who ____ Roger\'s will!',
    blanks: ['real', 'inherits'],
    tiles: ['real', 'inherits', 'fake', 'abandons', 'true', 'carries', 'false', 'forgets'],
    distractors: ['fake', 'abandons', 'true', 'carries', 'false', 'forgets'],
    hints: {
      character: 'World\'s strongest man with mustache',
      context: 'His final declaration at Marineford',
      emoji: '👨‍🦳⚡'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-hard-003',
    anime: 'One Piece',
    character: 'Silvers Rayleigh',
    difficulty: 'hard',
    quote_original: 'Perhaps nothing happened. Perhaps this is what we call fate.',
    quote_puzzle: 'Perhaps nothing ____. Perhaps this is what we call ____.',
    blanks: ['happened', 'fate'],
    tiles: ['happened', 'fate', 'changed', 'destiny', 'occurred', 'luck', 'existed', 'chance'],
    distractors: ['changed', 'destiny', 'occurred', 'luck', 'existed', 'chance'],
    hints: {
      character: 'Roger\'s right hand man, the Dark King',
      context: 'His philosophical reflection',
      emoji: '👴⚔️'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-hard-004',
    anime: 'One Piece',
    character: 'Dracule Mihawk',
    difficulty: 'hard',
    quote_original: 'A sword without conviction is no sword at all.',
    quote_puzzle: 'A sword without ____ is no sword at ____.',
    blanks: ['conviction', 'all'],
    tiles: ['conviction', 'all', 'purpose', 'nothing', 'meaning', 'everything', 'soul', 'anything'],
    distractors: ['purpose', 'nothing', 'meaning', 'everything', 'soul', 'anything'],
    hints: {
      character: 'World\'s greatest swordsman with hawk eyes',
      context: 'His philosophy about swordsmanship',
      emoji: '🦅⚔️'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  },
  {
    id: 'onepiece-hard-005',
    anime: 'One Piece',
    character: 'Shanks',
    difficulty: 'hard',
    quote_original: 'Being alone is more painful than getting hurt.',
    quote_puzzle: 'Being ____ is more painful than getting ____.',
    blanks: ['alone', 'hurt'],
    tiles: ['alone', 'hurt', 'together', 'healed', 'lonely', 'injured', 'isolated', 'wounded'],
    distractors: ['together', 'healed', 'lonely', 'injured', 'isolated', 'wounded'],
    hints: {
      character: 'Red-haired Yonko who inspired Luffy',
      context: 'His wisdom about loneliness',
      emoji: '🔴👑'
    },
    source: 'https://anilist.co/anime/21/One-Piece'
  }
];
// ATTACK ON TITAN - EASY (5 puzzles)
const AOT_EASY_PUZZLES: AnimePuzzle[] = [
  {
    id: 'aot-easy-001',
    anime: 'Attack on Titan',
    character: 'Eren Yeager',
    difficulty: 'easy',
    quote_original: 'I will destroy all titans!',
    quote_puzzle: 'I will ____ all ____!',
    blanks: ['destroy', 'titans'],
    tiles: ['destroy', 'titans', 'kill', 'humans', 'save', 'people', 'fight', 'enemies'],
    distractors: ['kill', 'humans', 'save', 'people', 'fight', 'enemies'],
    hints: {
      character: 'Determined Survey Corps member',
      context: 'His vow against titans',
      emoji: '⚔️😤'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-easy-002',
    anime: 'Attack on Titan',
    character: 'Mikasa Ackerman',
    difficulty: 'easy',
    quote_original: 'I will protect Eren!',
    quote_puzzle: 'I will ____ ____!',
    blanks: ['protect', 'Eren'],
    tiles: ['protect', 'Eren', 'save', 'Armin', 'help', 'Levi', 'guard', 'humanity'],
    distractors: ['save', 'Armin', 'help', 'Levi', 'guard', 'humanity'],
    hints: {
      character: 'Skilled fighter with red scarf',
      context: 'Her devotion to her childhood friend',
      emoji: '🧣⚔️'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-easy-003',
    anime: 'Attack on Titan',
    character: 'Armin Arlert',
    difficulty: 'easy',
    quote_original: 'I want to see the ocean!',
    quote_puzzle: 'I want to see the ____!',
    blanks: ['ocean'],
    tiles: ['ocean', 'world', 'sky', 'mountains', 'forest', 'desert', 'city', 'village'],
    distractors: ['world', 'sky', 'mountains', 'forest', 'desert', 'city', 'village'],
    hints: {
      character: 'Blonde strategist and Eren\'s friend',
      context: 'His dream of the world beyond walls',
      emoji: '🌊📚'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-easy-004',
    anime: 'Attack on Titan',
    character: 'Sasha Blouse',
    difficulty: 'easy',
    quote_original: 'Meat! I want meat!',
    quote_puzzle: '____! I want ____!',
    blanks: ['Meat', 'meat'],
    tiles: ['Meat', 'meat', 'Bread', 'bread', 'Food', 'food', 'Water', 'water'],
    distractors: ['Bread', 'bread', 'Food', 'food', 'Water', 'water'],
    hints: {
      character: 'Potato girl with brown hair',
      context: 'Her constant hunger and love for food',
      emoji: '🥔🍖'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-easy-005',
    anime: 'Attack on Titan',
    character: 'Jean Kirstein',
    difficulty: 'easy',
    quote_original: 'I want to live in the interior!',
    quote_puzzle: 'I want to live in the ____!',
    blanks: ['interior'],
    tiles: ['interior', 'walls', 'outside', 'city', 'safety', 'danger', 'peace', 'war'],
    distractors: ['walls', 'outside', 'city', 'safety', 'danger', 'peace', 'war'],
    hints: {
      character: 'Horse-faced recruit with leadership skills',
      context: 'His initial desire for safety',
      emoji: '🐴🏰'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  }
];

// ATTACK ON TITAN - MEDIUM (5 puzzles)
const AOT_MEDIUM_PUZZLES: AnimePuzzle[] = [
  {
    id: 'aot-medium-001',
    anime: 'Attack on Titan',
    character: 'Eren Yeager',
    difficulty: 'medium',
    quote_original: 'If you win, you live. If you lose, you die.',
    quote_puzzle: 'If you ____, you live. If you ____, you die.',
    blanks: ['win', 'lose'],
    tiles: ['win', 'lose', 'fight', 'run', 'hide', 'attack', 'defend', 'survive'],
    distractors: ['fight', 'run', 'hide', 'attack', 'defend', 'survive'],
    hints: {
      character: 'Hot-headed Survey Corps member',
      context: 'Brutal reality of their world',
      emoji: '⚔️🏃'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-medium-002',
    anime: 'Attack on Titan',
    character: 'Levi Ackerman',
    difficulty: 'medium',
    quote_original: 'No regrets. That is how I live my life.',
    quote_puzzle: 'No ____. That is how I live my ____.',
    blanks: ['regrets', 'life'],
    tiles: ['regrets', 'life', 'fears', 'death', 'doubts', 'dreams', 'worries', 'hopes'],
    distractors: ['fears', 'death', 'doubts', 'dreams', 'worries', 'hopes'],
    hints: {
      character: 'Humanity\'s strongest soldier',
      context: 'His philosophy about living without regret',
      emoji: '⚔️💪'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-medium-003',
    anime: 'Attack on Titan',
    character: 'Erwin Smith',
    difficulty: 'medium',
    quote_original: 'Advance! The future of humanity depends on it!',
    quote_puzzle: '____! The future of ____ depends on it!',
    blanks: ['Advance', 'humanity'],
    tiles: ['Advance', 'humanity', 'Retreat', 'titans', 'Attack', 'soldiers', 'Fight', 'people'],
    distractors: ['Retreat', 'titans', 'Attack', 'soldiers', 'Fight', 'people'],
    hints: {
      character: 'Survey Corps commander with blonde hair',
      context: 'His rallying cry for the mission',
      emoji: '👨‍💼⚔️'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-medium-004',
    anime: 'Attack on Titan',
    character: 'Hange Zoe',
    difficulty: 'medium',
    quote_original: 'The real enemy of humanity is ignorance.',
    quote_puzzle: 'The real enemy of humanity is ____.',
    blanks: ['ignorance'],
    tiles: ['ignorance', 'titans', 'fear', 'hatred', 'weakness', 'despair', 'doubt', 'cowardice'],
    distractors: ['titans', 'fear', 'hatred', 'weakness', 'despair', 'doubt', 'cowardice'],
    hints: {
      character: 'Eccentric scientist obsessed with titans',
      context: 'Their belief about the true threat',
      emoji: '🔬👓'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-medium-005',
    anime: 'Attack on Titan',
    character: 'Reiner Braun',
    difficulty: 'medium',
    quote_original: 'I just want to go home.',
    quote_puzzle: 'I just want to go ____.',
    blanks: ['home'],
    tiles: ['home', 'away', 'back', 'forward', 'inside', 'outside', 'up', 'down'],
    distractors: ['away', 'back', 'forward', 'inside', 'outside', 'up', 'down'],
    hints: {
      character: 'Armored Titan shifter with split personality',
      context: 'His longing for his homeland',
      emoji: '🛡️😢'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  }
];

// ATTACK ON TITAN - HARD (5 puzzles)
const AOT_HARD_PUZZLES: AnimePuzzle[] = [
  {
    id: 'aot-hard-001',
    anime: 'Attack on Titan',
    character: 'Levi Ackerman',
    difficulty: 'hard',
    quote_original: 'The only thing we are allowed to do is believe.',
    quote_puzzle: 'The only thing we are allowed to do is ____.',
    blanks: ['believe'],
    tiles: ['believe', 'fight', 'hope', 'survive', 'trust', 'die', 'live', 'kill'],
    distractors: ['fight', 'hope', 'survive', 'trust', 'die', 'live', 'kill'],
    hints: {
      character: 'Humanity\'s strongest soldier',
      context: 'His philosophy about their situation',
      emoji: '⚔️💪'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-hard-002',
    anime: 'Attack on Titan',
    character: 'Eren Yeager',
    difficulty: 'hard',
    quote_original: 'I keep moving forward until my enemies are destroyed.',
    quote_puzzle: 'I keep moving ____ until my enemies are ____.',
    blanks: ['forward', 'destroyed'],
    tiles: ['forward', 'destroyed', 'backward', 'saved', 'ahead', 'defeated', 'onward', 'eliminated'],
    distractors: ['backward', 'saved', 'ahead', 'defeated', 'onward', 'eliminated'],
    hints: {
      character: 'Attack Titan inheritor',
      context: 'His relentless determination',
      emoji: '⚡👊'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-hard-003',
    anime: 'Attack on Titan',
    character: 'Erwin Smith',
    difficulty: 'hard',
    quote_original: 'My soldiers, rage! My soldiers, scream! My soldiers, fight!',
    quote_puzzle: 'My soldiers, ____! My soldiers, ____! My soldiers, ____!',
    blanks: ['rage', 'scream', 'fight'],
    tiles: ['rage', 'scream', 'fight', 'fear', 'cry', 'run', 'anger', 'shout', 'battle'],
    distractors: ['fear', 'cry', 'run', 'anger', 'shout', 'battle'],
    hints: {
      character: 'Survey Corps commander',
      context: 'His final charge speech',
      emoji: '👨‍💼⚔️'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-hard-004',
    anime: 'Attack on Titan',
    character: 'Kenny Ackerman',
    difficulty: 'hard',
    quote_original: 'Everyone was a slave to something.',
    quote_puzzle: 'Everyone was a ____ to something.',
    blanks: ['slave'],
    tiles: ['slave', 'master', 'servant', 'king', 'prisoner', 'ruler', 'victim', 'hero'],
    distractors: ['master', 'servant', 'king', 'prisoner', 'ruler', 'victim', 'hero'],
    hints: {
      character: 'Levi\'s uncle and former serial killer',
      context: 'His philosophy about human nature',
      emoji: '🔫👴'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  },
  {
    id: 'aot-hard-005',
    anime: 'Attack on Titan',
    character: 'Grisha Yeager',
    difficulty: 'hard',
    quote_original: 'If you want to save Mikasa, Armin, and everyone else, you must learn to control this power.',
    quote_puzzle: 'If you want to save Mikasa, Armin, and everyone else, you must learn to ____ this ____.',
    blanks: ['control', 'power'],
    tiles: ['control', 'power', 'master', 'strength', 'use', 'ability', 'wield', 'force'],
    distractors: ['master', 'strength', 'use', 'ability', 'wield', 'force'],
    hints: {
      character: 'Eren\'s father and former Attack Titan',
      context: 'His final message to his son',
      emoji: '👨‍⚕️⚡'
    },
    source: 'https://anilist.co/anime/16498/Attack-on-Titan'
  }
];

// MY HERO ACADEMIA - EASY (5 puzzles)
const MHA_EASY_PUZZLES: AnimePuzzle[] = [
  {
    id: 'mha-easy-001',
    anime: 'My Hero Academia',
    character: 'Izuku Midoriya',
    difficulty: 'easy',
    quote_original: 'Sometimes I do feel like I am a failure.',
    quote_puzzle: 'Sometimes I do feel like I am a ____.',
    blanks: ['failure'],
    tiles: ['failure', 'hero', 'student', 'winner', 'loser', 'success', 'nobody', 'somebody'],
    distractors: ['hero', 'student', 'winner', 'loser', 'success', 'nobody', 'somebody'],
    hints: {
      character: 'Green-haired aspiring hero',
      context: 'His self-doubt moments',
      emoji: '💚😰'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-easy-002',
    anime: 'My Hero Academia',
    character: 'All Might',
    difficulty: 'easy',
    quote_original: 'I am here!',
    quote_puzzle: 'I am ____!',
    blanks: ['here'],
    tiles: ['here', 'there', 'strong', 'ready', 'back', 'gone', 'alive', 'present'],
    distractors: ['there', 'strong', 'ready', 'back', 'gone', 'alive', 'present'],
    hints: {
      character: 'Symbol of Peace with blonde hair',
      context: 'His iconic arrival phrase',
      emoji: '💪✨'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-easy-003',
    anime: 'My Hero Academia',
    character: 'Katsuki Bakugo',
    difficulty: 'easy',
    quote_original: 'I will be number one!',
    quote_puzzle: 'I will be number ____!',
    blanks: ['one'],
    tiles: ['one', 'two', 'ten', 'last', 'first', 'best', 'worst', 'zero'],
    distractors: ['two', 'ten', 'last', 'first', 'best', 'worst', 'zero'],
    hints: {
      character: 'Explosive blonde with anger issues',
      context: 'His ambition to be the top hero',
      emoji: '💥😤'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-easy-004',
    anime: 'My Hero Academia',
    character: 'Ochaco Uraraka',
    difficulty: 'easy',
    quote_original: 'I want to help people!',
    quote_puzzle: 'I want to ____ ____!',
    blanks: ['help', 'people'],
    tiles: ['help', 'people', 'hurt', 'villains', 'save', 'heroes', 'protect', 'citizens'],
    distractors: ['hurt', 'villains', 'save', 'heroes', 'protect', 'citizens'],
    hints: {
      character: 'Gravity girl with brown hair',
      context: 'Her motivation to become a hero',
      emoji: '🌸💫'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-easy-005',
    anime: 'My Hero Academia',
    character: 'Tenya Iida',
    difficulty: 'easy',
    quote_original: 'I must follow the rules!',
    quote_puzzle: 'I must follow the ____!',
    blanks: ['rules'],
    tiles: ['rules', 'leader', 'crowd', 'villain', 'hero', 'teacher', 'law', 'orders'],
    distractors: ['leader', 'crowd', 'villain', 'hero', 'teacher', 'law', 'orders'],
    hints: {
      character: 'Class representative with engine quirk',
      context: 'His strict adherence to regulations',
      emoji: '👓⚡'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  }
];

// MY HERO ACADEMIA - MEDIUM (5 puzzles)
const MHA_MEDIUM_PUZZLES: AnimePuzzle[] = [
  {
    id: 'mha-medium-001',
    anime: 'My Hero Academia',
    character: 'Katsuki Bakugo',
    difficulty: 'medium',
    quote_original: 'I will win. That is what heroes do.',
    quote_puzzle: 'I will ____. That is what ____ do.',
    blanks: ['win', 'heroes'],
    tiles: ['win', 'heroes', 'lose', 'villains', 'fight', 'students', 'try', 'people'],
    distractors: ['lose', 'villains', 'fight', 'students', 'try', 'people'],
    hints: {
      character: 'Explosive blonde rival',
      context: 'His determination to be number one',
      emoji: '💥😤'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-medium-002',
    anime: 'My Hero Academia',
    character: 'Shoto Todoroki',
    difficulty: 'medium',
    quote_original: 'I will become a hero with my own power.',
    quote_puzzle: 'I will become a hero with my own ____.',
    blanks: ['power'],
    tiles: ['power', 'strength', 'quirk', 'father', 'fire', 'ice', 'family', 'legacy'],
    distractors: ['strength', 'quirk', 'father', 'fire', 'ice', 'family', 'legacy'],
    hints: {
      character: 'Half-hot half-cold quirk user',
      context: 'His rejection of his father\'s influence',
      emoji: '🔥❄️'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-medium-003',
    anime: 'My Hero Academia',
    character: 'Eijiro Kirishima',
    difficulty: 'medium',
    quote_original: 'It is not manly to hurt a girl!',
    quote_puzzle: 'It is not ____ to hurt a ____!',
    blanks: ['manly', 'girl'],
    tiles: ['manly', 'girl', 'heroic', 'boy', 'right', 'woman', 'cool', 'person'],
    distractors: ['heroic', 'boy', 'right', 'woman', 'cool', 'person'],
    hints: {
      character: 'Red-haired hardening quirk user',
      context: 'His chivalrous code of conduct',
      emoji: '🗿❤️'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-medium-004',
    anime: 'My Hero Academia',
    character: 'Fumikage Tokoyami',
    difficulty: 'medium',
    quote_original: 'The darkness and I are one.',
    quote_puzzle: 'The ____ and I are ____.',
    blanks: ['darkness', 'one'],
    tiles: ['darkness', 'one', 'light', 'two', 'shadow', 'many', 'night', 'together'],
    distractors: ['light', 'two', 'shadow', 'many', 'night', 'together'],
    hints: {
      character: 'Bird-headed student with Dark Shadow',
      context: 'His connection with his quirk',
      emoji: '🐦‍⬛🌑'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-medium-005',
    anime: 'My Hero Academia',
    character: 'Momo Yaoyorozu',
    difficulty: 'medium',
    quote_original: 'I must have confidence in my abilities.',
    quote_puzzle: 'I must have ____ in my ____.',
    blanks: ['confidence', 'abilities'],
    tiles: ['confidence', 'abilities', 'doubt', 'weaknesses', 'faith', 'skills', 'trust', 'powers'],
    distractors: ['doubt', 'weaknesses', 'faith', 'skills', 'trust', 'powers'],
    hints: {
      character: 'Vice president with creation quirk',
      context: 'Her struggle with self-doubt',
      emoji: '👑⚡'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  }
];

// MY HERO ACADEMIA - HARD (5 puzzles)
const MHA_HARD_PUZZLES: AnimePuzzle[] = [
  {
    id: 'mha-hard-001',
    anime: 'My Hero Academia',
    character: 'All Might',
    difficulty: 'hard',
    quote_original: 'A true hero always finds a way for justice to be served.',
    quote_puzzle: 'A true hero always finds a way for ____ to be ____.',
    blanks: ['justice', 'served'],
    tiles: ['justice', 'served', 'peace', 'denied', 'truth', 'hidden', 'hope', 'lost'],
    distractors: ['peace', 'denied', 'truth', 'hidden', 'hope', 'lost'],
    hints: {
      character: 'Former Symbol of Peace',
      context: 'His philosophy about heroism',
      emoji: '💪⚖️'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-hard-002',
    anime: 'My Hero Academia',
    character: 'Stain',
    difficulty: 'hard',
    quote_original: 'Only All Might is worthy of the title of hero.',
    quote_puzzle: 'Only All Might is ____ of the title of ____.',
    blanks: ['worthy', 'hero'],
    tiles: ['worthy', 'hero', 'unworthy', 'villain', 'deserving', 'symbol', 'capable', 'leader'],
    distractors: ['unworthy', 'villain', 'deserving', 'symbol', 'capable', 'leader'],
    hints: {
      character: 'Hero Killer with twisted ideology',
      context: 'His extreme view on true heroes',
      emoji: '🗡️🩸'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-hard-003',
    anime: 'My Hero Academia',
    character: 'Endeavor',
    difficulty: 'hard',
    quote_original: 'I will surpass All Might and become the number one hero.',
    quote_puzzle: 'I will ____ All Might and become the number ____ hero.',
    blanks: ['surpass', 'one'],
    tiles: ['surpass', 'one', 'follow', 'two', 'defeat', 'last', 'replace', 'best'],
    distractors: ['follow', 'two', 'defeat', 'last', 'replace', 'best'],
    hints: {
      character: 'Flame hero and Todoroki\'s father',
      context: 'His obsession with being number one',
      emoji: '🔥👨'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-hard-004',
    anime: 'My Hero Academia',
    character: 'Tomura Shigaraki',
    difficulty: 'hard',
    quote_original: 'Heroes and villains both thrive on violence, but we are still categorized.',
    quote_puzzle: 'Heroes and villains both thrive on ____, but we are still ____.',
    blanks: ['violence', 'categorized'],
    tiles: ['violence', 'categorized', 'peace', 'united', 'conflict', 'separated', 'war', 'divided'],
    distractors: ['peace', 'united', 'conflict', 'separated', 'war', 'divided'],
    hints: {
      character: 'League of Villains leader with decay quirk',
      context: 'His twisted view of society',
      emoji: '✋💀'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  },
  {
    id: 'mha-hard-005',
    anime: 'My Hero Academia',
    character: 'Gran Torino',
    difficulty: 'hard',
    quote_original: 'A hero\'s job is to risk his life to turn his promises into reality.',
    quote_puzzle: 'A hero\'s job is to risk his ____ to turn his ____ into reality.',
    blanks: ['life', 'promises'],
    tiles: ['life', 'promises', 'death', 'lies', 'safety', 'dreams', 'body', 'hopes'],
    distractors: ['death', 'lies', 'safety', 'dreams', 'body', 'hopes'],
    hints: {
      character: 'All Might\'s former teacher',
      context: 'His wisdom about heroic duty',
      emoji: '👴⚡'
    },
    source: 'https://anilist.co/anime/21459/My-Hero-Academia'
  }
];

// DEMON SLAYER - EASY (5 puzzles)
const DEMON_SLAYER_EASY_PUZZLES: AnimePuzzle[] = [
  {
    id: 'demonslayer-easy-001',
    anime: 'Demon Slayer',
    character: 'Tanjiro Kamado',
    difficulty: 'easy',
    quote_original: 'I will not let anyone else die!',
    quote_puzzle: 'I will not let ____ else ____!',
    blanks: ['anyone', 'die'],
    tiles: ['anyone', 'die', 'someone', 'live', 'nobody', 'suffer', 'everyone', 'fight'],
    distractors: ['someone', 'live', 'nobody', 'suffer', 'everyone', 'fight'],
    hints: {
      character: 'Kind-hearted demon slayer with checkered haori',
      context: 'His protective vow',
      emoji: '🗡️❤️'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-easy-002',
    anime: 'Demon Slayer',
    character: 'Nezuko Kamado',
    difficulty: 'easy',
    quote_original: 'Mmm! Mmm!',
    quote_puzzle: '____! ____!',
    blanks: ['Mmm', 'Mmm'],
    tiles: ['Mmm', 'Ahh', 'Hmm', 'Ohh', 'Grr', 'Ugh', 'Huh', 'Ehh'],
    distractors: ['Ahh', 'Hmm', 'Ohh', 'Grr', 'Ugh', 'Huh', 'Ehh'],
    hints: {
      character: 'Demon girl with bamboo muzzle',
      context: 'Her way of communicating',
      emoji: '👹🎋'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-easy-003',
    anime: 'Demon Slayer',
    character: 'Zenitsu Agatsuma',
    difficulty: 'easy',
    quote_original: 'I want to live!',
    quote_puzzle: 'I want to ____!',
    blanks: ['live'],
    tiles: ['live', 'die', 'fight', 'run', 'hide', 'sleep', 'cry', 'scream'],
    distractors: ['die', 'fight', 'run', 'hide', 'sleep', 'cry', 'scream'],
    hints: {
      character: 'Yellow-haired coward with lightning powers',
      context: 'His desperate plea for survival',
      emoji: '⚡😱'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-easy-004',
    anime: 'Demon Slayer',
    character: 'Inosuke Hashibira',
    difficulty: 'easy',
    quote_original: 'I am the king of the mountains!',
    quote_puzzle: 'I am the ____ of the ____!',
    blanks: ['king', 'mountains'],
    tiles: ['king', 'mountains', 'lord', 'forest', 'ruler', 'hills', 'master', 'valleys'],
    distractors: ['lord', 'forest', 'ruler', 'hills', 'master', 'valleys'],
    hints: {
      character: 'Boar-headed wild fighter',
      context: 'His proud declaration',
      emoji: '🐗⚔️'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-easy-005',
    anime: 'Demon Slayer',
    character: 'Giyu Tomioka',
    difficulty: 'easy',
    quote_original: 'I am not like other people.',
    quote_puzzle: 'I am not like other ____.',
    blanks: ['people'],
    tiles: ['people', 'demons', 'slayers', 'humans', 'fighters', 'warriors', 'soldiers', 'heroes'],
    distractors: ['demons', 'slayers', 'humans', 'fighters', 'warriors', 'soldiers', 'heroes'],
    hints: {
      character: 'Water Hashira with stoic personality',
      context: 'His acknowledgment of being different',
      emoji: '🌊😐'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  }
];

// Combine all puzzles
export const ALL_COMPREHENSIVE_PUZZLES = [
  ...COMPREHENSIVE_ANIME_PUZZLES,
  ...AOT_EASY_PUZZLES,
  ...AOT_MEDIUM_PUZZLES,
  ...AOT_HARD_PUZZLES,
  ...MHA_EASY_PUZZLES,
  ...MHA_MEDIUM_PUZZLES,
  ...MHA_HARD_PUZZLES,
  ...DEMON_SLAYER_EASY_PUZZLES
];
// DEMON SLAYER - MEDIUM (5 puzzles)
const DEMON_SLAYER_MEDIUM_PUZZLES: AnimePuzzle[] = [
  {
    id: 'demonslayer-medium-001',
    anime: 'Demon Slayer',
    character: 'Kyojuro Rengoku',
    difficulty: 'medium',
    quote_original: 'Set your heart ablaze and move forward!',
    quote_puzzle: 'Set your heart ____ and move ____!',
    blanks: ['ablaze', 'forward'],
    tiles: ['ablaze', 'forward', 'on fire', 'backward', 'burning', 'ahead', 'aflame', 'onward'],
    distractors: ['on fire', 'backward', 'burning', 'ahead', 'aflame', 'onward'],
    hints: {
      character: 'Flame Hashira with fiery personality',
      context: 'His inspiring final message',
      emoji: '🔥💪'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-medium-002',
    anime: 'Demon Slayer',
    character: 'Shinobu Kocho',
    difficulty: 'medium',
    quote_original: 'I may not be able to cut off a demon\'s head, but I can torture them.',
    quote_puzzle: 'I may not be able to cut off a demon\'s ____, but I can ____ them.',
    blanks: ['head', 'torture'],
    tiles: ['head', 'torture', 'arm', 'heal', 'leg', 'help', 'body', 'save'],
    distractors: ['arm', 'heal', 'leg', 'help', 'body', 'save'],
    hints: {
      character: 'Insect Hashira with poison techniques',
      context: 'Her unique fighting style',
      emoji: '🦋💜'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-medium-003',
    anime: 'Demon Slayer',
    character: 'Tengen Uzui',
    difficulty: 'medium',
    quote_original: 'I am the god of festivals! The most flamboyant man alive!',
    quote_puzzle: 'I am the god of ____! The most ____ man alive!',
    blanks: ['festivals', 'flamboyant'],
    tiles: ['festivals', 'flamboyant', 'parties', 'boring', 'celebrations', 'flashy', 'events', 'colorful'],
    distractors: ['parties', 'boring', 'celebrations', 'flashy', 'events', 'colorful'],
    hints: {
      character: 'Sound Hashira with three wives',
      context: 'His flashy self-introduction',
      emoji: '🎵✨'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-medium-004',
    anime: 'Demon Slayer',
    character: 'Muzan Kibutsuji',
    difficulty: 'medium',
    quote_original: 'I have lived for over a thousand years. I am perfection.',
    quote_puzzle: 'I have lived for over a ____ years. I am ____.',
    blanks: ['thousand', 'perfection'],
    tiles: ['thousand', 'perfection', 'hundred', 'flawed', 'million', 'imperfect', 'billion', 'weak'],
    distractors: ['hundred', 'flawed', 'million', 'imperfect', 'billion', 'weak'],
    hints: {
      character: 'Demon King and progenitor of all demons',
      context: 'His arrogant self-assessment',
      emoji: '👹👑'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-medium-005',
    anime: 'Demon Slayer',
    character: 'Akaza',
    difficulty: 'medium',
    quote_original: 'Become a demon and fight me for eternity!',
    quote_puzzle: 'Become a ____ and fight me for ____!',
    blanks: ['demon', 'eternity'],
    tiles: ['demon', 'eternity', 'human', 'moment', 'slayer', 'forever', 'monster', 'always'],
    distractors: ['human', 'moment', 'slayer', 'forever', 'monster', 'always'],
    hints: {
      character: 'Upper Moon Three with martial arts',
      context: 'His offer to Rengoku',
      emoji: '👹🥊'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  }
];

// DEMON SLAYER - HARD (5 puzzles)
const DEMON_SLAYER_HARD_PUZZLES: AnimePuzzle[] = [
  {
    id: 'demonslayer-hard-001',
    anime: 'Demon Slayer',
    character: 'Kagaya Ubuyashiki',
    difficulty: 'hard',
    quote_original: 'The bond between those who share the same feelings is stronger than family.',
    quote_puzzle: 'The bond between those who share the same ____ is stronger than ____.',
    blanks: ['feelings', 'family'],
    tiles: ['feelings', 'family', 'thoughts', 'enemies', 'emotions', 'strangers', 'beliefs', 'friends'],
    distractors: ['thoughts', 'enemies', 'emotions', 'strangers', 'beliefs', 'friends'],
    hints: {
      character: 'Leader of the Demon Slayer Corps',
      context: 'His wisdom about the corps unity',
      emoji: '👨‍💼🌸'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-hard-002',
    anime: 'Demon Slayer',
    character: 'Kokushibo',
    difficulty: 'hard',
    quote_original: 'Those who master their breathing can live for hundreds of years.',
    quote_puzzle: 'Those who master their ____ can live for hundreds of ____.',
    blanks: ['breathing', 'years'],
    tiles: ['breathing', 'years', 'fighting', 'days', 'swordsmanship', 'months', 'techniques', 'decades'],
    distractors: ['fighting', 'days', 'swordsmanship', 'months', 'techniques', 'decades'],
    hints: {
      character: 'Upper Moon One and former demon slayer',
      context: 'His knowledge of breathing techniques',
      emoji: '👹🌙'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-hard-003',
    anime: 'Demon Slayer',
    character: 'Yoriichi Tsugikuni',
    difficulty: 'hard',
    quote_original: 'I failed to cut off Muzan\'s head. I have no right to be called the strongest.',
    quote_puzzle: 'I failed to cut off Muzan\'s ____. I have no right to be called the ____.',
    blanks: ['head', 'strongest'],
    tiles: ['head', 'strongest', 'arm', 'weakest', 'leg', 'fastest', 'body', 'greatest'],
    distractors: ['arm', 'weakest', 'leg', 'fastest', 'body', 'greatest'],
    hints: {
      character: 'Legendary demon slayer and Sun Breathing creator',
      context: 'His regret about failing to kill Muzan',
      emoji: '☀️⚔️'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-hard-004',
    anime: 'Demon Slayer',
    character: 'Gyomei Himejima',
    difficulty: 'hard',
    quote_original: 'Those who regret their own actions, I would never hurt.',
    quote_puzzle: 'Those who regret their own ____, I would never ____.',
    blanks: ['actions', 'hurt'],
    tiles: ['actions', 'hurt', 'words', 'help', 'thoughts', 'heal', 'deeds', 'save'],
    distractors: ['words', 'help', 'thoughts', 'heal', 'deeds', 'save'],
    hints: {
      character: 'Stone Hashira and strongest demon slayer',
      context: 'His compassionate philosophy',
      emoji: '🗿😢'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  },
  {
    id: 'demonslayer-hard-005',
    anime: 'Demon Slayer',
    character: 'Tamayo',
    difficulty: 'hard',
    quote_original: 'Even if I am a demon, I will never forgive Muzan for what he has done.',
    quote_puzzle: 'Even if I am a ____, I will never forgive Muzan for what he has ____.',
    blanks: ['demon', 'done'],
    tiles: ['demon', 'done', 'human', 'said', 'doctor', 'taken', 'woman', 'given'],
    distractors: ['human', 'said', 'doctor', 'taken', 'woman', 'given'],
    hints: {
      character: 'Demon doctor who helps Tanjiro',
      context: 'Her hatred for Muzan despite being a demon',
      emoji: '👩‍⚕️👹'
    },
    source: 'https://anilist.co/anime/101922/Demon-Slayer'
  }
];

// DEATH NOTE - EASY (5 puzzles)
const DEATH_NOTE_EASY_PUZZLES: AnimePuzzle[] = [
  {
    id: 'deathnote-easy-001',
    anime: 'Death Note',
    character: 'Light Yagami',
    difficulty: 'easy',
    quote_original: 'I am justice!',
    quote_puzzle: 'I am ____!',
    blanks: ['justice'],
    tiles: ['justice', 'evil', 'Kira', 'wrong', 'right', 'god', 'human', 'guilty'],
    distractors: ['evil', 'Kira', 'wrong', 'right', 'god', 'human', 'guilty'],
    hints: {
      character: 'Genius student who found the Death Note',
      context: 'His declaration of righteousness',
      emoji: '⚖️📓'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-easy-002',
    anime: 'Death Note',
    character: 'L',
    difficulty: 'easy',
    quote_original: 'I am L.',
    quote_puzzle: 'I am ____.',
    blanks: ['L'],
    tiles: ['L', 'Kira', 'Light', 'Ryuk', 'Near', 'Mello', 'Watari', 'Misa'],
    distractors: ['Kira', 'Light', 'Ryuk', 'Near', 'Mello', 'Watari', 'Misa'],
    hints: {
      character: 'World\'s greatest detective with sweet tooth',
      context: 'His simple self-introduction',
      emoji: '🍰🔍'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-easy-003',
    anime: 'Death Note',
    character: 'Ryuk',
    difficulty: 'easy',
    quote_original: 'I love apples!',
    quote_puzzle: 'I love ____!',
    blanks: ['apples'],
    tiles: ['apples', 'oranges', 'humans', 'death', 'games', 'notes', 'books', 'candy'],
    distractors: ['oranges', 'humans', 'death', 'games', 'notes', 'books', 'candy'],
    hints: {
      character: 'Shinigami who dropped the Death Note',
      context: 'His favorite food obsession',
      emoji: '💀🍎'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-easy-004',
    anime: 'Death Note',
    character: 'Misa Amane',
    difficulty: 'easy',
    quote_original: 'Light is my god!',
    quote_puzzle: '____ is my god!',
    blanks: ['Light'],
    tiles: ['Light', 'Kira', 'L', 'Ryuk', 'Death', 'Love', 'Life', 'Hope'],
    distractors: ['Kira', 'L', 'Ryuk', 'Death', 'Love', 'Life', 'Hope'],
    hints: {
      character: 'Blonde model with Shinigami eyes',
      context: 'Her devotion to Light/Kira',
      emoji: '👁️💕'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-easy-005',
    anime: 'Death Note',
    character: 'Soichiro Yagami',
    difficulty: 'easy',
    quote_original: 'I believe in justice!',
    quote_puzzle: 'I believe in ____!',
    blanks: ['justice'],
    tiles: ['justice', 'Kira', 'evil', 'law', 'peace', 'truth', 'order', 'chaos'],
    distractors: ['Kira', 'evil', 'law', 'peace', 'truth', 'order', 'chaos'],
    hints: {
      character: 'Light\'s father and police chief',
      context: 'His unwavering moral compass',
      emoji: '👮‍♂️⚖️'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  }
];

// DEATH NOTE - MEDIUM (5 puzzles)
const DEATH_NOTE_MEDIUM_PUZZLES: AnimePuzzle[] = [
  {
    id: 'deathnote-medium-001',
    anime: 'Death Note',
    character: 'L',
    difficulty: 'medium',
    quote_original: 'Justice will prevail no matter what.',
    quote_puzzle: '____ will prevail no matter what.',
    blanks: ['Justice'],
    tiles: ['Justice', 'Evil', 'Kira', 'Truth', 'Light', 'Darkness', 'Law', 'Crime'],
    distractors: ['Evil', 'Kira', 'Truth', 'Light', 'Darkness', 'Law', 'Crime'],
    hints: {
      character: 'World\'s greatest detective',
      context: 'His determination to catch Kira',
      emoji: '🔍⚖️'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-medium-002',
    anime: 'Death Note',
    character: 'Near',
    difficulty: 'medium',
    quote_original: 'Kira is childish and he hates losing.',
    quote_puzzle: 'Kira is ____ and he hates ____.',
    blanks: ['childish', 'losing'],
    tiles: ['childish', 'losing', 'mature', 'winning', 'smart', 'failing', 'clever', 'succeeding'],
    distractors: ['mature', 'winning', 'smart', 'failing', 'clever', 'succeeding'],
    hints: {
      character: 'L\'s successor with white hair',
      context: 'His psychological analysis of Kira',
      emoji: '🧸🔍'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-medium-003',
    anime: 'Death Note',
    character: 'Mello',
    difficulty: 'medium',
    quote_original: 'I will surpass L and catch Kira.',
    quote_puzzle: 'I will ____ L and catch ____.',
    blanks: ['surpass', 'Kira'],
    tiles: ['surpass', 'Kira', 'follow', 'Light', 'replace', 'criminals', 'beat', 'justice'],
    distractors: ['follow', 'Light', 'replace', 'criminals', 'beat', 'justice'],
    hints: {
      character: 'Chocolate-loving rival of Near',
      context: 'His competitive drive',
      emoji: '🍫😤'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-medium-004',
    anime: 'Death Note',
    character: 'Rem',
    difficulty: 'medium',
    quote_original: 'I will protect Misa no matter what.',
    quote_puzzle: 'I will protect ____ no matter what.',
    blanks: ['Misa'],
    tiles: ['Misa', 'Light', 'Kira', 'humans', 'justice', 'truth', 'love', 'peace'],
    distractors: ['Light', 'Kira', 'humans', 'justice', 'truth', 'love', 'peace'],
    hints: {
      character: 'Female Shinigami devoted to Misa',
      context: 'Her protective instinct',
      emoji: '💀👩'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-medium-005',
    anime: 'Death Note',
    character: 'Teru Mikami',
    difficulty: 'medium',
    quote_original: 'God\'s will must be carried out.',
    quote_puzzle: '____\'s will must be carried out.',
    blanks: ['God'],
    tiles: ['God', 'Kira', 'Light', 'Justice', 'Law', 'Evil', 'Truth', 'Peace'],
    distractors: ['Kira', 'Light', 'Justice', 'Law', 'Evil', 'Truth', 'Peace'],
    hints: {
      character: 'Fanatical prosecutor and Kira supporter',
      context: 'His religious devotion to Kira',
      emoji: '⚖️🙏'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  }
];

// DEATH NOTE - HARD (5 puzzles)
const DEATH_NOTE_HARD_PUZZLES: AnimePuzzle[] = [
  {
    id: 'deathnote-hard-001',
    anime: 'Death Note',
    character: 'Light Yagami',
    difficulty: 'hard',
    quote_original: 'I am justice! I protect the innocent and those who fear evil.',
    quote_puzzle: 'I am ____! I protect the ____ and those who fear ____.',
    blanks: ['justice', 'innocent', 'evil'],
    tiles: ['justice', 'innocent', 'evil', 'Kira', 'guilty', 'good', 'god', 'criminals', 'righteousness'],
    distractors: ['Kira', 'guilty', 'good', 'god', 'criminals', 'righteousness'],
    hints: {
      character: 'Genius student with god complex',
      context: 'Kira\'s twisted philosophy',
      emoji: '⚖️📓'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-hard-002',
    anime: 'Death Note',
    character: 'L',
    difficulty: 'hard',
    quote_original: 'Sometimes the questions are complicated and the answers are simple.',
    quote_puzzle: 'Sometimes the questions are ____ and the answers are ____.',
    blanks: ['complicated', 'simple'],
    tiles: ['complicated', 'simple', 'easy', 'complex', 'difficult', 'obvious', 'hard', 'clear'],
    distractors: ['easy', 'complex', 'difficult', 'obvious', 'hard', 'clear'],
    hints: {
      character: 'World\'s greatest detective',
      context: 'His philosophical approach to cases',
      emoji: '🔍🧠'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-hard-003',
    anime: 'Death Note',
    character: 'Ryuk',
    difficulty: 'hard',
    quote_original: 'Humans are so interesting. They think they can change the world.',
    quote_puzzle: 'Humans are so ____. They think they can change the ____.',
    blanks: ['interesting', 'world'],
    tiles: ['interesting', 'world', 'boring', 'universe', 'amusing', 'reality', 'funny', 'future'],
    distractors: ['boring', 'universe', 'amusing', 'reality', 'funny', 'future'],
    hints: {
      character: 'Shinigami who enjoys human entertainment',
      context: 'His observation of human nature',
      emoji: '💀🌍'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-hard-004',
    anime: 'Death Note',
    character: 'Watari',
    difficulty: 'hard',
    quote_original: 'L, do you know gods of death love apples?',
    quote_puzzle: 'L, do you know gods of ____ love ____?',
    blanks: ['death', 'apples'],
    tiles: ['death', 'apples', 'life', 'oranges', 'destruction', 'fruit', 'chaos', 'food'],
    distractors: ['life', 'oranges', 'destruction', 'fruit', 'chaos', 'food'],
    hints: {
      character: 'L\'s loyal assistant and caretaker',
      context: 'His knowledge about Shinigami',
      emoji: '👴📱'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  },
  {
    id: 'deathnote-hard-005',
    anime: 'Death Note',
    character: 'Light Yagami',
    difficulty: 'hard',
    quote_original: 'In this world, there are very few people who actually trust each other.',
    quote_puzzle: 'In this world, there are very few people who actually ____ each ____.',
    blanks: ['trust', 'other'],
    tiles: ['trust', 'other', 'hate', 'person', 'love', 'individual', 'help', 'human'],
    distractors: ['hate', 'person', 'love', 'individual', 'help', 'human'],
    hints: {
      character: 'Kira\'s cynical worldview',
      context: 'His philosophy about human relationships',
      emoji: '🌍💔'
    },
    source: 'https://anilist.co/anime/1535/Death-Note'
  }
];

// Update the final export to include all puzzles
export const ALL_COMPREHENSIVE_PUZZLES_FINAL = [
  ...COMPREHENSIVE_ANIME_PUZZLES,
  ...AOT_EASY_PUZZLES,
  ...AOT_MEDIUM_PUZZLES,
  ...AOT_HARD_PUZZLES,
  ...MHA_EASY_PUZZLES,
  ...MHA_MEDIUM_PUZZLES,
  ...MHA_HARD_PUZZLES,
  ...DEMON_SLAYER_EASY_PUZZLES,
  ...DEMON_SLAYER_MEDIUM_PUZZLES,
  ...DEMON_SLAYER_HARD_PUZZLES,
  ...DEATH_NOTE_EASY_PUZZLES,
  ...DEATH_NOTE_MEDIUM_PUZZLES,
  ...DEATH_NOTE_HARD_PUZZLES
];
