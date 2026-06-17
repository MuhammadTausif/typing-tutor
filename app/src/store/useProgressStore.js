import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_PROGRESS, MOCK_USER } from '../data/mockData'
import { calcArcadeXP } from '../arcade/config'

const ARCADE_DEFAULTS = {
  typeblaster: { score: 0, wpm: 0, accuracy: 100, peakCombo: 0, playCount: 0 },
  typesnake:   { score: 0, wpm: 0, accuracy: 100, peakCombo: 0, playCount: 0 },
  typejump:    { score: 0, wpm: 0, accuracy: 100, peakCombo: 0, playCount: 0 },
  spellcaster: { score: 0, wpm: 0, accuracy: 100, peakCombo: 0, playCount: 0 },
  typebeat:    { score: 0, wpm: 0, accuracy: 100, peakCombo: 0, playCount: 0 },
  typegarden:  { score: 0, wpm: 0, accuracy: 100, peakCombo: 0, playCount: 0 },
}

const useProgressStore = create(
  persist(
    (set, get) => ({
      user:     MOCK_USER,
      progress: MOCK_PROGRESS,
      arcade:   ARCADE_DEFAULTS,

      completeLesson(lessonId, { wpm, accuracy, duration }) {
        set(state => {
          const prev     = state.progress
          const prevBest = prev.lessonBests[lessonId]
          const isNew    = !prevBest
          const newBest  = !prevBest || wpm > prevBest.wpm
            ? { wpm, accuracy, completedAt: new Date().toISOString().split('T')[0] }
            : prevBest
          const xpGain   = isNew ? 50 : 10
          return {
            progress: {
              ...prev,
              xp: prev.xp + xpGain,
              totalSessions: prev.totalSessions + 1,
              totalMinutes: prev.totalMinutes + Math.floor(duration / 60),
              completedLessons: isNew
                ? [...prev.completedLessons, lessonId]
                : prev.completedLessons,
              lessonBests: { ...prev.lessonBests, [lessonId]: newBest },
              currentLessonId: Math.max(prev.currentLessonId, lessonId + 1),
            },
          }
        })
      },

      // Returns { xpGained, isNewBest }
      recordArcadeGame(gameId, { score, wpm, accuracy, peakCombo, duration }) {
        const prev = get().arcade[gameId] ?? ARCADE_DEFAULTS[gameId]
        const isNewBest = score > prev.score
        const xpGained  = calcArcadeXP({ score, wpm, accuracy, peakCombo, isNewBest })
        const newBest   = isNewBest
          ? { score, wpm, accuracy, peakCombo }
          : { score: prev.score, wpm: Math.max(prev.wpm, wpm), accuracy: prev.accuracy, peakCombo: Math.max(prev.peakCombo, peakCombo) }

        set(state => ({
          arcade: {
            ...state.arcade,
            [gameId]: { ...newBest, playCount: (prev.playCount ?? 0) + 1 },
          },
          progress: {
            ...state.progress,
            xp: state.progress.xp + xpGained,
            totalSessions: state.progress.totalSessions + 1,
            totalMinutes: state.progress.totalMinutes + Math.floor((duration ?? 0) / 60),
          },
        }))

        return { xpGained, isNewBest }
      },

      updateSettings(patch) {
        set(state => ({
          progress: { ...state.progress, settings: { ...state.progress.settings, ...patch } },
        }))
      },

      isLessonCompleted(id) {
        return get().progress.completedLessons.includes(id)
      },

      isLessonUnlocked(id) {
        const { completedLessons, currentLessonId } = get().progress
        return id <= currentLessonId || completedLessons.includes(id - 1) || id === 1
      },

      getBest(lessonId) {
        return get().progress.lessonBests[lessonId] || null
      },

      getArcadeBest(gameId) {
        return get().arcade[gameId] ?? ARCADE_DEFAULTS[gameId]
      },
    }),
    {
      name: 'velocityTutorData',
      partialize: state => ({ user: state.user, progress: state.progress, arcade: state.arcade }),
    }
  )
)

export default useProgressStore
