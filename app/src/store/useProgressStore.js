import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_PROGRESS, MOCK_USER } from '../data/mockData'

const useProgressStore = create(
  persist(
    (set, get) => ({
      user:     MOCK_USER,
      progress: MOCK_PROGRESS,

      completeLesson(lessonId, { wpm, accuracy, duration }) {
        set(state => {
          const prev    = state.progress
          const prevBest = prev.lessonBests[lessonId]
          const isNew   = !prevBest

          const newBest = !prevBest || wpm > prevBest.wpm
            ? { wpm, accuracy, completedAt: new Date().toISOString().split('T')[0] }
            : prevBest

          const lesson  = { wpm, accuracy, duration }
          const xpGain  = isNew ? 50 : 10

          return {
            progress: {
              ...prev,
              xp: prev.xp + xpGain,
              streak: prev.streak,
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

      updateSettings(patch) {
        set(state => ({
          progress: {
            ...state.progress,
            settings: { ...state.progress.settings, ...patch },
          },
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
    }),
    {
      name: 'velocityTutorData',
      partialize: state => ({ user: state.user, progress: state.progress }),
    }
  )
)

export default useProgressStore
