import { Link } from 'react-router-dom'
import { Flame, Zap, Clock, ChevronRight, TrendingUp } from 'lucide-react'
import useProgressStore from '../store/useProgressStore'
import { LESSONS, LEVELS } from '../data/lessons'
import { MOCK_RECENT_SESSIONS } from '../data/mockData'
import Button from '../components/shared/Button'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`size-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-100">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
        {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, progress } = useProgressStore()
  const currentLesson = LESSONS.find(l => l.id === progress.currentLessonId)
  const currentLevel  = LEVELS.find(lv => lv.id === currentLesson?.level)

  const xpToNext = 500
  const xpPct    = Math.min(100, Math.round((progress.xp % xpToNext) / xpToNext * 100))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back, <span className="text-gradient">{user.name}</span>
        </h1>
        <p className="text-slate-500 mt-1">Keep the momentum going — every minute counts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame}     label="Day streak"      value={progress.streak}          color="bg-orange-500/15 text-orange-400" />
        <StatCard icon={Zap}       label="Total XP"        value={progress.xp}              color="bg-vel-violet/15 text-vel-violet" />
        <StatCard icon={Clock}     label="Minutes typed"   value={progress.totalMinutes}    color="bg-vel-cyan/15 text-vel-cyan" />
        <StatCard icon={TrendingUp} label="Sessions"       value={progress.totalSessions}   color="bg-teal-500/15 text-teal-400" />
      </div>

      {/* XP bar */}
      <div className="card p-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Level {progress.level}</span>
          <span>{progress.xp % xpToNext} / {xpToNext} XP</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vel-violet to-vel-cyan rounded-full transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      {/* Continue banner */}
      {currentLesson && (
        <div className="card p-5 flex items-center justify-between gap-4 border-vel-violet/40 bg-vel-violet/5">
          <div className="flex-1">
            <div className="text-xs font-medium text-vel-violet uppercase tracking-wider mb-1">
              {currentLevel?.name} · Lesson {currentLesson.id}
            </div>
            <h2 className="text-lg font-semibold text-slate-100">{currentLesson.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{currentLesson.subtitle}</p>
          </div>
          <Link to={`/lessons/${currentLesson.id}`}>
            <Button size="lg" iconRight={<ChevronRight className="size-4" />}>
              Continue
            </Button>
          </Link>
        </div>
      )}

      {/* Recent sessions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent sessions</h2>
        <div className="space-y-2">
          {MOCK_RECENT_SESSIONS.map((s, i) => {
            const lesson = LESSONS.find(l => l.id === s.lessonId)
            return (
              <div key={i} className="card-hover p-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-slate-200 font-medium">{lesson?.title ?? `Lesson ${s.lessonId}`}</span>
                  <span className="text-xs text-slate-600 ml-2">{s.date}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-vel-cyan font-bold">{s.wpm} WPM</span>
                  <span className="text-slate-400">{s.accuracy}%</span>
                  <Link to={`/lessons/${s.lessonId}`} className="text-xs text-vel-violet hover:underline">
                    Retry
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
