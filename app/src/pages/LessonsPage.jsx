import { Link } from 'react-router-dom'
import { CheckCircle2, Lock, PlayCircle, Star } from 'lucide-react'
import { LESSONS, LEVELS } from '../data/lessons'
import useProgressStore from '../store/useProgressStore'
import clsx from 'clsx'

function LessonCard({ lesson, completed, unlocked, best }) {
  const level = LEVELS.find(lv => lv.id === lesson.level)

  const card = (
    <div className={clsx(
      'card p-4 flex items-center gap-4 transition-all duration-200',
      unlocked ? 'card-hover cursor-pointer' : 'opacity-50 cursor-not-allowed',
    )}>
      {/* Status icon */}
      <div className={clsx(
        'size-10 rounded-xl flex items-center justify-center shrink-0',
        completed  ? 'bg-teal-500/15 text-teal-400'
        : unlocked ? 'bg-vel-violet/15 text-vel-violet'
                   : 'bg-white/5 text-slate-600',
      )}>
        {completed  ? <CheckCircle2 className="size-5" /> :
         unlocked   ? <PlayCircle className="size-5" />   :
                      <Lock className="size-5" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={clsx('text-xs font-semibold uppercase tracking-wider', level?.color)}>
            {level?.name}
          </span>
          <span className="text-xs text-slate-600">· Lesson {lesson.id}</span>
        </div>
        <h3 className="font-semibold text-slate-100 truncate mt-0.5">{lesson.title}</h3>
        <p className="text-xs text-slate-500 truncate">{lesson.subtitle}</p>
      </div>

      {/* Best stats */}
      {best ? (
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-vel-cyan font-bold text-sm">
            <Star className="size-3.5 fill-vel-cyan text-vel-cyan" />
            {best.wpm} WPM
          </div>
          <div className="text-xs text-slate-500">{best.accuracy}% acc</div>
        </div>
      ) : (
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-600">+{lesson.xp} XP</div>
          <div className="text-xs text-slate-600 mt-0.5">{lesson.minWPM}+ WPM</div>
        </div>
      )}
    </div>
  )

  return unlocked ? (
    <Link to={`/lessons/${lesson.id}`}>{card}</Link>
  ) : (
    card
  )
}

export default function LessonsPage() {
  const { isLessonCompleted, isLessonUnlocked, getBest } = useProgressStore()

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Lessons</h1>
        <p className="text-slate-500 mt-1">Progress through levels in order — each lesson unlocks the next.</p>
      </div>

      {LEVELS.map(level => {
        const levelLessons = LESSONS.filter(l => l.level === level.id)
        return (
          <section key={level.id}>
            {/* Level header */}
            <div className={clsx('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4', level.bg, level.border, 'border', level.color)}>
              <span>{level.icon}</span>
              <span>Level {level.id}: {level.name}</span>
            </div>
            <p className="text-sm text-slate-500 mb-4 -mt-2">{level.description}</p>

            <div className="space-y-2">
              {levelLessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  completed={isLessonCompleted(lesson.id)}
                  unlocked={isLessonUnlocked(lesson.id)}
                  best={getBest(lesson.id)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
