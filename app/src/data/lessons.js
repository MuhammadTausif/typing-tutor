// Structured typing curriculum: Home Row → Top Row → Bottom Row → Numbers → Full Speed

export const LEVELS = [
  { id: 1, name: 'Home Row',    color: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30',  icon: '🏠', description: 'Master the foundation — where your fingers rest' },
  { id: 2, name: 'Top Row',     color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30',icon: '⬆️', description: 'Add the top row keys one hand at a time' },
  { id: 3, name: 'Bottom Row',  color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30',icon: '⬇️', description: 'Complete the alphabet with bottom-row keys' },
  { id: 4, name: 'Numbers',     color: 'text-gold-400',   bg: 'bg-yellow-500/10', border: 'border-yellow-500/30',icon: '🔢', description: 'Type numbers and punctuation with confidence' },
  { id: 5, name: 'Full Speed',  color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/30',  icon: '⚡', description: 'Real-world sentences at full speed' },
]

export const LESSONS = [
  // ── Level 1: Home Row ─────────────────────────────────────────────────────
  {
    id: 1, level: 1,
    title: 'Left Hand Home',
    subtitle: 'A · S · D · F',
    keys: ['a','s','d','f'],
    description: 'Place your left fingers on A S D F. These four keys are your left-hand home position. Keep fingers curved and relaxed.',
    minWPM: 10, minAccuracy: 80, xp: 50,
    exercises: [
      { type: 'repetition', instruction: 'Repeat each key to build muscle memory', text: 'aaaa ssss dddd ffff aaaa ssss dddd ffff asdf fdsa asdf fdsa' },
      { type: 'words',      instruction: 'Type these short words using only your home keys', text: 'as sad dad fad add ads dads fads afar alaf safe salad' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'a sad dad adds; all fads fall; ask a lass' },
    ],
  },
  {
    id: 2, level: 1,
    title: 'Right Hand Home',
    subtitle: 'J · K · L · ;',
    keys: ['j','k','l',';'],
    description: 'Place your right fingers on J K L ;. Your right index finger rests on J, the key with the bump.',
    minWPM: 10, minAccuracy: 80, xp: 50,
    exercises: [
      { type: 'repetition', instruction: 'Repeat each key to build muscle memory', text: 'jjjj kkkk llll ;;;; jjjj kkkk llll ;;;; jkl; ;lkj jkl; ;lkj' },
      { type: 'words',      instruction: 'Combine keys in short patterns', text: 'jk kl lj jl j; k; l; jkl kl; ;lk klj ;j kl' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'jk; lk; jl kl; ;lkj jkl; klj;' },
    ],
  },
  {
    id: 3, level: 1,
    title: 'Full Home Row',
    subtitle: 'A S D F · J K L ;',
    keys: ['a','s','d','f','j','k','l',';'],
    description: 'Use both hands together on the home row. Your thumbs rest on the spacebar — press it with your right thumb.',
    minWPM: 15, minAccuracy: 82, xp: 75,
    exercises: [
      { type: 'repetition', instruction: 'Alternate both hands across the home row', text: 'asdf jkl; asdf jkl; asdfjkl; ;lkjfdsa fjdk sla; daks flj;' },
      { type: 'words',      instruction: 'Type these home-row words', text: 'ask fall all lad sad add flask salad lass dull skull falls' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'ask a sad lad; all fall; dad adds a flask; alas all lads fall' },
    ],
  },
  {
    id: 4, level: 1,
    title: 'Home Row Sentences',
    subtitle: 'Speed & Flow',
    keys: ['a','s','d','f','j','k','l',';'],
    description: 'Flow through full sentences using only the home row. Focus on rhythm, not speed.',
    minWPM: 20, minAccuracy: 85, xp: 100,
    exercises: [
      { type: 'words',    instruction: 'Type this word sequence smoothly', text: 'flask salad falls alas lads dads adds asks all shall fall lass jal' },
      { type: 'sentence', instruction: 'First sentence', text: 'a sad lad falls; all dads ask; adds a flask; alas a sad fall' },
      { type: 'sentence', instruction: 'Second sentence — aim for flow', text: 'ask all lads; falls add; sad dads ask; a flask falls; all shall ask' },
    ],
  },

  // ── Level 2: Top Row ──────────────────────────────────────────────────────
  {
    id: 5, level: 2,
    title: 'Left Top Keys',
    subtitle: 'E · R · T',
    keys: ['e','r','t','a','s','d','f'],
    description: 'Reach up from D to E (middle finger), F to R (index), F to T (index stretch). Keep your other fingers on the home row.',
    minWPM: 15, minAccuracy: 82, xp: 75,
    exercises: [
      { type: 'repetition', instruction: 'Practise the new keys with home keys', text: 'eee rrr ttt ert tre ret ede frf ftf ded frf' },
      { type: 'words',      instruction: 'Words using left home + top keys', text: 'are era red rest test set seat tear rate dear stare trade' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'rest the test; red stars set; trade fares add; a dear lad set fire' },
    ],
  },
  {
    id: 6, level: 2,
    title: 'Right Top Keys',
    subtitle: 'Y · U · I · O · P',
    keys: ['y','u','i','o','p','j','k','l'],
    description: 'J reaches up to U (Y needs a stretch), K to I, L to O, and ; to P. Keep your wrist still — let your fingers do the reach.',
    minWPM: 15, minAccuracy: 82, xp: 75,
    exercises: [
      { type: 'repetition', instruction: 'Practise the new keys with home keys', text: 'yyy uuu iii ooo ppp juj kik lol ;p; yuiop poiuy uuu iii' },
      { type: 'words',      instruction: 'Words using right home + top keys', text: 'you oil joy lull pull poor pool pill kill look oil purr juicy' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'you pull oil; poor pools; look up; kill joy; purr like a kitten' },
    ],
  },
  {
    id: 7, level: 2,
    title: 'Q · W · Full Top Row',
    subtitle: 'Complete the Top Row',
    keys: ['q','w','e','r','t','y','u','i','o','p'],
    description: 'Q and W are the last top-row keys. A reaches to Q (pinky), S reaches to W (ring finger). Now you have the full top row!',
    minWPM: 18, minAccuracy: 83, xp: 100,
    exercises: [
      { type: 'repetition', instruction: 'Full top row warm-up', text: 'qqq www qwerty ytrewq qwq wew aqa sws qwerty power quite write' },
      { type: 'words',      instruction: 'Top-row vocabulary', text: 'write power quite quote quest where tower water otter putter' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'write quite powerfully; quote the tower; water the quiet forest' },
    ],
  },
  {
    id: 8, level: 2,
    title: 'Top + Home Words',
    subtitle: 'Twenty-Key Practice',
    keys: ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','j','k','l'],
    description: 'You now have 20 of the 26 letters. Practice real words and sentences using everything you know.',
    minWPM: 22, minAccuracy: 85, xp: 125,
    exercises: [
      { type: 'words',    instruction: 'Common short words', text: 'the is are were you your just like for will set ask tell off' },
      { type: 'sentence', instruction: 'First sentence', text: 'ask the lads; rest your feet; take a sip of water; study well' },
      { type: 'sentence', instruction: 'Second sentence — keep a steady rhythm', text: 'your test result set a new record; keep at it; skill takes effort' },
    ],
  },

  // ── Level 3: Bottom Row ───────────────────────────────────────────────────
  {
    id: 9, level: 3,
    title: 'C · V Keys',
    subtitle: 'Left Bottom',
    keys: ['c','v','a','s','d','f'],
    description: 'D reaches down to C (middle finger), F reaches down to V (index). Bottom-row keys need a slightly larger reach — stay relaxed.',
    minWPM: 20, minAccuracy: 83, xp: 75,
    exercises: [
      { type: 'repetition', instruction: 'Practise C and V with the home row', text: 'ccc vvv cv vc dcd fvf cdc vcf civic cave voice cave vice' },
      { type: 'words',      instruction: 'C and V vocabulary', text: 'cave voice civic cover curve civil carve cave vow various' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'civil voices cover over vast caves; carve a vivid cave cover' },
    ],
  },
  {
    id: 10, level: 3,
    title: 'N · M · B Keys',
    subtitle: 'Right Bottom',
    keys: ['n','m','b','j','k','l'],
    description: 'J reaches to N, K reaches to M. B is reached by the left index. These keys complete the core of the alphabet.',
    minWPM: 20, minAccuracy: 83, xp: 75,
    exercises: [
      { type: 'repetition', instruction: 'Practise N, M, B with home row', text: 'nnn mmm bbb nm mn nb bn jnj kmk bfb name mine bank bone' },
      { type: 'words',      instruction: 'N, M, B vocabulary', text: 'name mine bank come bone mean beam noble manner cabin number' },
      { type: 'sentence',   instruction: 'Type the full sentence', text: 'come mine bank; name the numbers; beam over noble manner bone cabin' },
    ],
  },
  {
    id: 11, level: 3,
    title: 'Z · X · Full Alphabet',
    subtitle: 'Complete the Alphabet',
    keys: ['z','x','a','s','d','f','j','k','l'],
    description: 'Z (pinky reaches down-left from A) and X (ring finger reaches down from S) are the last two letters. You now know all 26!',
    minWPM: 22, minAccuracy: 85, xp: 150,
    exercises: [
      { type: 'repetition', instruction: 'Z and X with home row', text: 'zzz xxx zx xz aza sxs zero exit zeal exile exact exotic' },
      { type: 'words',      instruction: 'Famous pangram — all 26 letters', text: 'the quick brown fox jumps over the lazy dog' },
      { type: 'sentence',   instruction: 'Second pangram for variety', text: 'five boxing wizards jump quickly over the lazy dwarves' },
    ],
  },

  // ── Level 4: Numbers ──────────────────────────────────────────────────────
  {
    id: 12, level: 4,
    title: 'Numbers 1 – 5',
    subtitle: 'Left Number Row',
    keys: ['1','2','3','4','5'],
    description: 'Use your left hand to reach the number row. Keep fingers close to the top row and return to home position immediately.',
    minWPM: 18, minAccuracy: 80, xp: 100,
    exercises: [
      { type: 'repetition', instruction: 'Warm up each number key', text: '11111 22222 33333 44444 55555 12345 54321 12321 45654' },
      { type: 'words',      instruction: 'Number sequences and dates', text: '123 234 345 12345 2024 1234 2025 3145 5432 1125 25 35 45' },
      { type: 'sentence',   instruction: 'Type the sentence with numbers', text: 'add 12 and 34; total 5; item 123 costs 45; order 2345' },
    ],
  },
  {
    id: 13, level: 4,
    title: 'Numbers 6 – 0',
    subtitle: 'Right Number Row',
    keys: ['6','7','8','9','0'],
    description: 'Right hand reaches for 6 through 0. The J finger reaches 6, and the ; finger reaches 0.',
    minWPM: 18, minAccuracy: 80, xp: 100,
    exercises: [
      { type: 'repetition', instruction: 'Warm up each number key', text: '66666 77777 88888 99999 00000 67890 09876 67867 89098' },
      { type: 'words',      instruction: 'Number sequences', text: '678 789 890 67890 09876 7890 6789 0987 1990 2000 2007 80' },
      { type: 'sentence',   instruction: 'Type the sentence with numbers', text: 'call 678-9000; code 7890; score 100; order 6700 items' },
    ],
  },

  // ── Level 5: Full Speed ───────────────────────────────────────────────────
  {
    id: 14, level: 5,
    title: 'Full Speed Challenge',
    subtitle: 'Real-World Sentences',
    keys: [],
    description: 'All keys, real sentences, measured speed. Aim for accuracy first — speed will follow naturally with practice.',
    minWPM: 30, minAccuracy: 90, xp: 200,
    exercises: [
      { type: 'paragraph', instruction: 'Classic pangram — all 26 letters', text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!' },
      { type: 'paragraph', instruction: 'Technology vocabulary', text: 'Software developers write clean code that is easy to read and maintain. Good variable names, small functions, and tests make a codebase trustworthy.' },
      { type: 'paragraph', instruction: 'Final challenge — keep your eyes on the screen', text: 'Consistent daily practice is the most effective way to build typing speed. Start slow, stay accurate, and your fingers will find their flow.' },
    ],
  },
]

export function getLessonById(id) {
  return LESSONS.find(l => l.id === Number(id))
}

export function getLessonsByLevel(levelId) {
  return LESSONS.filter(l => l.level === levelId)
}

export function getNextLesson(currentId) {
  const idx = LESSONS.findIndex(l => l.id === Number(currentId))
  return LESSONS[idx + 1] || null
}
