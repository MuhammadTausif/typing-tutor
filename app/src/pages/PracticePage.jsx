import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, ChevronRight, Keyboard } from 'lucide-react'
import { getLessonById, getNextLesson } from '../data/lessons'
import useTypingEngine from '../hooks/useTypingEngine'
import useProgressStore from '../store/useProgressStore'
import TypingArea from '../components/typing/TypingArea'
import VirtualKeyboard from '../components/typing/VirtualKeyboard'
import Button from '../components/shared/Button'

function MetricChip({ label, value, accent }) {
  return (
    <div className="card px-4 py-3 text-center min-w-[5rem]">
      <div className={`text-xl font-bold ${accent ?? 'text-slate-100'}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

export default function PracticePage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const lesson       = getLessonById(id)
  const nextLesson   = getNextLesson(id)
  const completeLesson = useProgressStore(s => s.completeLesson)

  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [showKeyboard, setShowKeyboard] = useState(true)

  const exercise = lesson?.exercises[exerciseIdx]
  const { chars, wpm, accuracy, elapsed, started, finished, handleKey, reset } =
    useTypingEngine(exercise?.text ?? '')

  function handleFinish() {
    completeLesson(lesson.id, { wpm, accuracy, duration: elapsed })
  }

  function handleNextExercise() {
    if (exerciseIdx < lesson.exercises.length - 1) {
      setExerciseIdx(i => i + 1)
    }
  }

  if (!lesson) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Lesson not found.</p>
        <Link to="/lessons" className="text-vel-violet mt-2 inline-block hover:underline">← Back to lessons</Link>
      </div>
    )
  }

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`
  const isLastExercise = exerciseIdx === lesson.exercises.length - 1

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/lessons" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-100">{lesson.title}</h1>
          <p className="text-xs text-slate-500">{lesson.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Keyboard className="size-4" />}
          onClick={() => setShowKeyboard(v => !v)}
        >
          Keyboard
        </Button>
      </div>

      {/* Exercise tabs */}
      <div className="flex gap-1">
        {lesson.exercises.map((ex, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < exerciseIdx  ? 'bg-teal-500' :
              i === exerciseIdx ? 'bg-vel-violet' :
                                  'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Instruction */}
      <div className="text-sm text-slate-500 italic">{exercise?.instruction}</div>

      {/* Metrics */}
      <div className="flex gap-3 flex-wrap">
        <MetricChip label="WPM"      value={wpm}       accent="text-vel-cyan" />
        <MetricChip label="Accuracy" value={`${accuracy}%`} accent={accuracy >= 90 ? 'text-teal-400' : accuracy >= 75 ? 'text-amber-400' : 'text-red-400'} />
        <MetricChip label="Time"     value={timeStr} />
      </div>

      {/* Typing area */}
      <TypingArea chars={chars} onKey={handleKey} finished={finished} />

      {/* Virtual keyboard */}
      {showKeyboard && (
        <VirtualKeyboard highlightKeys={lesson.keys} />
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" size="sm" icon={<RotateCcw className="size-4" />} onClick={reset}>
          Restart
        </Button>

        {finished && !isLastExercise && (
          <Button size="sm" onClick={handleNextExercise} iconRight={<ChevronRight className="size-4" />}>
            Next exercise
          </Button>
        )}

        {finished && isLastExercise && (
          <div className="flex gap-3 items-center">
            <div className="text-sm text-teal-400 font-medium">
              Lesson complete! {wpm} WPM · {accuracy}% accuracy
            </div>
            <Button size="sm" variant="secondary" onClick={handleFinish}>
              Save result
            </Button>
            {nextLesson && (
              <Button size="sm" onClick={() => { handleFinish(); navigate(`/lessons/${nextLesson.id}`) }} iconRight={<ChevronRight className="size-4" />}>
                Next lesson
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Lesson description */}
      <div className="card p-4 text-sm text-slate-400 leading-relaxed">
        <span className="text-slate-300 font-medium">Tip: </span>
        {lesson.description}
      </div>
    </div>
  )
}
