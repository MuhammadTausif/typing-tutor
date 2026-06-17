import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Home, Star, Zap, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { DIFFICULTY, WORD_POOLS, calcArcadeXP } from './config'
import Button from '../components/shared/Button'

// ── Pre-game screen ───────────────────────────────────────────────────────────

export function PreGame({ game, onStart }) {
  const [diff, setDiff]       = useState('medium')
  const [wordSet, setWordSet] = useState('easy')

  function start() {
    onStart({ difficulty: diff, wordPool: WORD_POOLS[wordSet], wordSetKey: wordSet })
  }

  return (
    <div className="h-full flex items-center justify-center bg-navy-950 p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Back */}
        <Link to="/arcade" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
          <ArrowLeft className="size-4" /> All Games
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{game.icon}</div>
          <h1 className="text-3xl font-bold text-slate-100">{game.title}</h1>
          <p className="text-slate-400 mt-1">{game.subtitle}</p>
          <p className="text-slate-500 text-sm mt-3 max-w-sm mx-auto">{game.description}</p>
        </div>

        {/* How to play */}
        <div className="card p-4 mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">How to play</p>
          <ul className="space-y-1.5">
            {game.howToPlay.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-vel-violet mt-0.5 shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Word set */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Word set</p>
          <div className="grid grid-cols-4 gap-2">
            {[['home','Home Row'],['easy','Easy'],['medium','Medium'],['hard','Hard']].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setWordSet(k)}
                className={clsx(
                  'py-2 rounded-lg text-sm font-medium border transition-all',
                  wordSet === k
                    ? 'bg-vel-violet/20 border-vel-violet text-vel-violet'
                    : 'bg-white/5 border-vel-border text-slate-400 hover:border-slate-500'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(DIFFICULTY).map(([k, d]) => (
              <button
                key={k}
                onClick={() => setDiff(k)}
                className={clsx(
                  'py-2.5 rounded-lg text-sm font-semibold border transition-all',
                  diff === k
                    ? k === 'easy'   ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                    : k === 'medium' ? 'bg-vel-violet/20 border-vel-violet text-vel-violet'
                                     : 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-white/5 border-vel-border text-slate-400 hover:border-slate-500'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <Button className="w-full" size="lg" icon={<Play className="size-5" />} onClick={start}>
          Start Game
        </Button>
      </div>
    </div>
  )
}

// ── In-game HUD overlay ───────────────────────────────────────────────────────

export function GameHUD({ score, lives, combo, wpm, elapsed, maxLives = 3 }) {
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  return (
    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 pointer-events-none z-10">
      {/* Left: score + combo */}
      <div className="flex flex-col gap-1">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
          <span className="text-xs text-slate-500 font-medium">SCORE</span>
          <div className="text-xl font-black text-white tabular-nums">{score.toLocaleString()}</div>
        </div>
        {combo >= 3 && (
          <div className={clsx(
            'bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border animate-pop transition-all',
            combo >= 20 ? 'border-yellow-400/60 text-yellow-300'
            : combo >= 10 ? 'border-orange-400/60 text-orange-300'
                          : 'border-vel-violet/60 text-vel-violet',
          )}>
            <span className="text-xs font-medium opacity-70">COMBO</span>
            <div className="text-lg font-black tabular-nums">×{combo}</div>
          </div>
        )}
      </div>

      {/* Center: lives */}
      <div className="flex gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
        {Array.from({ length: maxLives }).map((_, i) => (
          <span key={i} className={clsx('text-lg transition-all duration-300', i < lives ? 'opacity-100' : 'opacity-20 grayscale')}>
            ❤️
          </span>
        ))}
      </div>

      {/* Right: wpm + time */}
      <div className="flex flex-col gap-1 items-end">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10 text-right">
          <span className="text-xs text-slate-500 font-medium">WPM</span>
          <div className="text-xl font-black text-vel-cyan tabular-nums">{wpm}</div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10 text-right">
          <span className="text-xs text-slate-500 font-medium">TIME</span>
          <div className="text-sm font-black text-slate-300 tabular-nums">
            {mins}:{String(secs).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Pause overlay ─────────────────────────────────────────────────────────────

export function PauseOverlay({ onResume, onQuit }) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-20">
      <div className="text-center space-y-6 animate-pop">
        <h2 className="text-4xl font-black text-white">PAUSED</h2>
        <p className="text-slate-400 text-sm">Press ESC to resume</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" icon={<Home className="size-4" />} onClick={onQuit}>Quit</Button>
          <Button icon={<Play className="size-4" />} onClick={onResume}>Resume</Button>
        </div>
      </div>
    </div>
  )
}

// ── Post-game results screen ──────────────────────────────────────────────────

export function PostGame({ game, stats, isNewBest, onReplay, onQuit }) {
  const xp = calcArcadeXP({ ...stats, isNewBest })

  return (
    <div className="h-full flex items-center justify-center bg-navy-950 p-4">
      <div className="w-full max-w-md text-center animate-slide-up space-y-6">
        {/* Result header */}
        <div>
          <div className="text-5xl mb-2">{stats.score > 0 ? game.icon : '💀'}</div>
          <h1 className="text-3xl font-black text-slate-100">
            {stats.score > 0 ? 'Game Over' : 'Try Again'}
          </h1>
          {isNewBest && (
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 text-sm font-bold px-3 py-1 rounded-full mt-2 animate-pop">
              <Star className="size-3.5 fill-yellow-400" /> New Personal Best!
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Score',    value: stats.score.toLocaleString(), color: 'text-slate-100'  },
            { label: 'WPM',      value: stats.wpm,                    color: 'text-vel-cyan'   },
            { label: 'Accuracy', value: `${stats.accuracy}%`,         color: stats.accuracy >= 90 ? 'text-teal-400' : 'text-amber-400' },
            { label: 'Peak ×',   value: stats.peakCombo,              color: 'text-vel-violet' },
          ].map(s => (
            <div key={s.label} className="card p-3">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* XP earned */}
        <div className="card p-4 flex items-center justify-center gap-3 border-vel-violet/30 bg-vel-violet/5">
          <Zap className="size-5 text-vel-violet" />
          <span className="text-2xl font-black text-vel-violet">+{xp} XP</span>
          <span className="text-slate-500 text-sm">earned</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" icon={<Home className="size-4" />} onClick={onQuit}>
            Arcade
          </Button>
          <Button className="flex-1" icon={<RotateCcw className="size-4" />} onClick={onReplay}>
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}
