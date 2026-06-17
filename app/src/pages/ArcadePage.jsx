import { Link } from 'react-router-dom'
import { Star, Play } from 'lucide-react'
import { GAMES } from '../arcade/config'
import useProgressStore from '../store/useProgressStore'
import clsx from 'clsx'

function GameCard({ game }) {
  const getArcadeBest = useProgressStore(s => s.getArcadeBest)
  const best = getArcadeBest(game.id)

  return (
    <Link
      to={`/arcade/${game.id}`}
      className={clsx(
        'group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 flex flex-col gap-3',
        'transition-all duration-300 hover:scale-[1.03] hover:shadow-xl',
        game.color, game.border, `hover:${game.glow}`,
      )}
    >
      {/* Play icon top-right */}
      <div className={clsx(
        'absolute top-4 right-4 size-8 rounded-full flex items-center justify-center',
        'bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity',
      )}>
        <Play className="size-4 text-white fill-white" />
      </div>

      {/* Icon + tags */}
      <div className="flex items-start justify-between">
        <span className="text-4xl">{game.icon}</span>
        <div className="flex gap-1 flex-wrap justify-end">
          {game.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-black/30 text-slate-400 border border-white/10">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className={clsx('font-bold text-lg', game.accent)}>{game.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{game.subtitle}</p>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed line-clamp-2">{game.description}</p>
      </div>

      {/* Best score */}
      {best.score > 0 ? (
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/10">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-slate-400">Best: <span className="text-white font-bold">{best.score.toLocaleString()}</span></span>
          <span className="text-xs text-slate-600 ml-auto">{best.wpm} WPM</span>
        </div>
      ) : (
        <div className="mt-auto pt-2 border-t border-white/10">
          <span className="text-xs text-slate-600">No plays yet — be the first!</span>
        </div>
      )}
    </Link>
  )
}

export default function ArcadePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Arcade</h1>
        <p className="text-slate-500 mt-1">Six typing games — each one rewards your speed and accuracy with XP.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map(game => <GameCard key={game.id} game={game} />)}
      </div>
    </div>
  )
}
