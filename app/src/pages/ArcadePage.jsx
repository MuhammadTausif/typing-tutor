import { ExternalLink } from 'lucide-react'

const GAMES = [
  {
    slug: 'typesnake',
    title: 'TypeSnake',
    description: 'Guide the snake by typing the correct keys — don\'t let it crash!',
    icon: '🐍',
    color: 'from-green-600/20 to-emerald-700/10',
    border: 'border-green-600/30',
    accent: 'text-green-400',
  },
  {
    slug: 'typejump',
    title: 'TypeJump',
    description: 'Type words to make your character leap over obstacles.',
    icon: '🏃',
    color: 'from-sky-600/20 to-cyan-700/10',
    border: 'border-sky-600/30',
    accent: 'text-sky-400',
  },
  {
    slug: 'typeblaster',
    title: 'TypeBlaster',
    description: 'Blast incoming enemies before they reach you — speed matters!',
    icon: '🚀',
    color: 'from-red-600/20 to-orange-700/10',
    border: 'border-red-600/30',
    accent: 'text-red-400',
  },
  {
    slug: 'spellcaster',
    title: 'SpellCaster',
    description: 'Cast spells by typing words correctly under time pressure.',
    icon: '🧙',
    color: 'from-purple-600/20 to-violet-700/10',
    border: 'border-purple-600/30',
    accent: 'text-purple-400',
  },
  {
    slug: 'typebeat',
    title: 'TypeBeat',
    description: 'Keep the rhythm — type words in sync with the beat.',
    icon: '🎵',
    color: 'from-pink-600/20 to-rose-700/10',
    border: 'border-pink-600/30',
    accent: 'text-pink-400',
  },
  {
    slug: 'typegarden',
    title: 'TypeGarden',
    description: 'Grow your garden by typing the right words for each plant.',
    icon: '🌱',
    color: 'from-teal-600/20 to-green-700/10',
    border: 'border-teal-600/30',
    accent: 'text-teal-400',
  },
]

export default function ArcadePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Arcade</h1>
        <p className="text-slate-500 mt-1">Put your skills to the test — six unique typing games await.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map(game => (
          <a
            key={game.slug}
            href={`/web-app/velocity-${game.slug}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group card border ${game.border} bg-gradient-to-br ${game.color} p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{game.icon}</span>
              <ExternalLink className="size-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${game.accent}`}>{game.title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{game.description}</p>
            </div>
            <div className={`text-xs font-medium ${game.accent} mt-auto`}>
              Play now →
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
