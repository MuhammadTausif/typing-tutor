// ── Word pools ────────────────────────────────────────────────────────────────

export const WORD_POOLS = {
  home: [
    'as','sad','dad','ask','fad','add','ads','lad','all','fall',
    'flask','salad','lass','dull','skull','falls','alas','dads',
    'lads','asks','flask','shall','alld','alfs','slak',
  ],
  easy: [
    'the','and','for','are','you','not','can','but','was','its',
    'run','cat','dog','big','red','sun','map','hop','tip','nap',
    'fire','blue','rest','test','star','dear','rate','seat','tear',
    'set','red','era','are','red','art','eat','oil','joy','look',
    'you','pull','poor','pool','pill','kill','purr','oil',
  ],
  medium: [
    'about','their','would','other','which','there','these','could',
    'write','power','quite','quote','quest','where','tower','water',
    'voice','civic','cover','curve','civil','carve','vow','various',
    'noble','manner','cabin','number','beam','bone','name','mine',
    'study','skill','effort','record','result','steady','rhythm',
  ],
  hard: [
    'beautiful','important','experience','development','understand',
    'knowledge','computer','keyboard','practice','accuracy',
    'velocity','achieve','challenge','progress','excellent',
    'adventure','fantastic','incredible','wonderful','brilliance',
    'extraordinary','communicate','professional','performance',
  ],
  numbers: [
    '123','456','789','100','200','2024','3145','5432','1125',
    '7890','6789','0987','1990','2000','2007','42','99','256',
    '1024','3600','12345','67890',
  ],
}

export const CHAR_POOLS = {
  home:    'asdfjkl;',
  top:     'qwertyuiop',
  bottom:  'zxcvbnm,./',
  numbers: '1234567890',
  full:    'abcdefghijklmnopqrstuvwxyz',
}

// ── Game metadata ─────────────────────────────────────────────────────────────

export const GAMES = [
  {
    id: 'typeblaster',
    title: 'TypeBlaster',
    subtitle: 'Space Invaders · typing',
    description: 'Enemies fall from above. Type their word to blast them before they reach your shield.',
    howToPlay: ['Words fall from the top', 'Type the word exactly to fire your laser', 'Incorrect key → screen shakes, combo resets', '3 shields — protect them!'],
    icon: '🚀',
    color: 'from-red-600/25 to-orange-700/15',
    border: 'border-red-500/40',
    accent: 'text-red-400',
    glow: 'shadow-red-500/20',
    tags: ['action','fast'],
  },
  {
    id: 'typesnake',
    title: 'TypeSnake',
    subtitle: 'Classic Snake · typing',
    description: 'Press the correct key to direct your snake toward glowing food. Eat fast, grow long.',
    howToPlay: ['Single keys appear as food', 'Press the shown key to move the snake toward it', 'Eat food to grow longer', 'Race the clock — no walls!'],
    icon: '🐍',
    color: 'from-green-600/25 to-emerald-700/15',
    border: 'border-green-500/40',
    accent: 'text-green-400',
    glow: 'shadow-green-500/20',
    tags: ['classic','keys'],
  },
  {
    id: 'typejump',
    title: 'TypeJump',
    subtitle: 'Auto-Runner · typing',
    description: 'Your fox runs automatically. Type the word on each obstacle to jump over it.',
    howToPlay: ['Fox runs right automatically', 'Type the obstacle word to jump', 'Finish the word before the obstacle arrives', '3 lives — good luck!'],
    icon: '🦊',
    color: 'from-sky-600/25 to-cyan-700/15',
    border: 'border-sky-500/40',
    accent: 'text-sky-400',
    glow: 'shadow-sky-500/20',
    tags: ['runner','words'],
  },
  {
    id: 'spellcaster',
    title: 'SpellCaster',
    subtitle: 'RPG Battle · typing',
    description: 'Type spells to battle monsters. Build combos for critical hits. Defeat bosses to level up.',
    howToPlay: ['Type the spell word shown below your wand', 'Complete word → spell fires', 'Combo ≥ 5 → critical hit (2× damage)', 'Monster charge full → they attack you!'],
    icon: '🧙',
    color: 'from-purple-600/25 to-violet-700/15',
    border: 'border-purple-500/40',
    accent: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    tags: ['rpg','words'],
  },
  {
    id: 'typebeat',
    title: 'TypeBeat',
    subtitle: 'Rhythm Game · typing',
    description: 'Notes scroll toward the beat zone. Hit the key at the right moment for PERFECT timing.',
    howToPlay: ['Notes scroll from right to left', 'Press the key when it enters the beat zone', 'PERFECT: ±60ms · GOOD: ±120ms · MISS: too slow', 'Groove drops on misses — don\'t let it empty!'],
    icon: '🎵',
    color: 'from-pink-600/25 to-rose-700/15',
    border: 'border-pink-500/40',
    accent: 'text-pink-400',
    glow: 'shadow-pink-500/20',
    tags: ['rhythm','keys'],
  },
  {
    id: 'typegarden',
    title: 'TypeGarden',
    subtitle: 'Zen Garden · typing',
    description: 'Grow a beautiful garden by typing words. No pressure, no lives — just flow.',
    howToPlay: ['Words appear as seeds floating in', 'Type the word to plant and grow it', 'Build a streak for rare golden blooms', 'No fail state — just grow your garden!'],
    icon: '🌸',
    color: 'from-teal-600/25 to-green-700/15',
    border: 'border-teal-500/40',
    accent: 'text-teal-400',
    glow: 'shadow-teal-500/20',
    tags: ['zen','words'],
  },
]

// ── Difficulty presets ────────────────────────────────────────────────────────

export const DIFFICULTY = {
  easy:   { label: 'Easy',   lives: 5, speedMult: 0.7, spawnRate: 0.7, timingMs: 140, wordSet: 'easy'   },
  medium: { label: 'Medium', lives: 3, speedMult: 1.0, spawnRate: 1.0, timingMs: 90,  wordSet: 'medium' },
  hard:   { label: 'Hard',   lives: 2, speedMult: 1.4, spawnRate: 1.5, timingMs: 55,  wordSet: 'hard'   },
}

// ── XP formula ────────────────────────────────────────────────────────────────

export function calcArcadeXP({ score, wpm, accuracy, peakCombo, isNewBest }) {
  let xp = Math.floor(score / 10)          // base: 1 XP per 10 score
  if (wpm >= 40)       xp += 25
  if (wpm >= 60)       xp += 25
  if (accuracy >= 90)  xp += 20
  if (accuracy >= 98)  xp += 20
  if (peakCombo >= 10) xp += 30
  if (peakCombo >= 20) xp += 30
  if (isNewBest)       xp += 50
  return Math.max(5, xp)                   // minimum 5 XP for playing
}

// ── Particle helpers (shared canvas utilities) ────────────────────────────────

export function makeParticles(x, y, color, count = 12) {
  return Array.from({ length: count }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6 - 2,
    life: 1,
    decay: 0.03 + Math.random() * 0.04,
    r: 3 + Math.random() * 4,
    color,
  }))
}

export function updateParticles(particles) {
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.15        // gravity
    p.vx *= 0.96
    p.life -= p.decay
  }
  return particles.filter(p => p.life > 0)
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = p.life
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function randomWord(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)]
}
