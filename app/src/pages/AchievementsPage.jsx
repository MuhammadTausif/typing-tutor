import { Lock } from 'lucide-react'
import { MOCK_ACHIEVEMENTS } from '../data/mockData'
import useProgressStore from '../store/useProgressStore'
import clsx from 'clsx'

export default function AchievementsPage() {
  const { progress } = useProgressStore()
  const unlocked = new Set(progress.unlockedAchievements)

  const earned  = MOCK_ACHIEVEMENTS.filter(a => unlocked.has(a.id))
  const pending = MOCK_ACHIEVEMENTS.filter(a => !unlocked.has(a.id))

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Achievements</h1>
        <p className="text-slate-500 mt-1">{earned.length} of {MOCK_ACHIEVEMENTS.length} earned</p>
      </div>

      {earned.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Earned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {earned.map(a => (
              <div key={a.id} className="card p-4 flex items-center gap-4">
                <div className="text-3xl">{a.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.description}</div>
                </div>
                <div className="text-xs text-vel-violet font-bold">+{a.xp} XP</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Locked</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pending.map(a => (
            <div key={a.id} className={clsx('card p-4 flex items-center gap-4 opacity-50')}>
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Lock className="size-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-400">{a.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{a.description}</div>
              </div>
              <div className="text-xs text-slate-600">+{a.xp} XP</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
