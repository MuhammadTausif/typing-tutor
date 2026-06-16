// Initial mock state — replaced with real API/localStorage data in production

export const MOCK_USER = {
  id: 'user-1',
  name: 'Alex',
  avatar: null,
  joinedAt: '2024-01-15',
}

export const MOCK_ACHIEVEMENTS = [
  { id: 'first-lesson',   title: 'First Steps',       description: 'Complete your first lesson',         icon: '👣', unlockedAt: '2024-01-15', xp: 25  },
  { id: 'home-row-hero',  title: 'Home Row Hero',      description: 'Pass all 4 Home Row lessons',         icon: '🏠', unlockedAt: '2024-01-18', xp: 100 },
  { id: 'speed-demon',    title: 'Speed Demon',        description: 'Hit 30 WPM in any lesson',            icon: '⚡', unlockedAt: null,          xp: 75  },
  { id: 'perfect-run',    title: 'Perfectionist',      description: 'Finish a lesson with 100% accuracy',  icon: '💎', unlockedAt: null,          xp: 150 },
  { id: 'seven-day',      title: 'Week Streak',        description: 'Practice 7 days in a row',            icon: '🔥', unlockedAt: null,          xp: 200 },
  { id: 'alphabet-done',  title: 'Full Alphabet',      description: 'Complete all alphabet lessons',       icon: '📚', unlockedAt: null,          xp: 300 },
]

export const MOCK_PROGRESS = {
  xp:      375,
  level:   3,
  streak:  4,
  totalSessions: 12,
  totalMinutes:  87,
  completedLessons: [1, 2, 3, 4],
  lessonBests: {
    1: { wpm: 22, accuracy: 91, completedAt: '2024-01-15' },
    2: { wpm: 19, accuracy: 88, completedAt: '2024-01-16' },
    3: { wpm: 24, accuracy: 90, completedAt: '2024-01-17' },
    4: { wpm: 21, accuracy: 87, completedAt: '2024-01-18' },
  },
  unlockedAchievements: ['first-lesson', 'home-row-hero'],
  currentLessonId: 5,
  settings: {
    soundEnabled: true,
    showKeyboard: true,
    showFingerGuide: true,
    theme: 'dark',
    fontSize: 'md',
  },
}

export const MOCK_RECENT_SESSIONS = [
  { date: '2024-01-18', lessonId: 4, wpm: 21, accuracy: 87, duration: 420 },
  { date: '2024-01-17', lessonId: 3, wpm: 24, accuracy: 90, duration: 380 },
  { date: '2024-01-16', lessonId: 2, wpm: 19, accuracy: 88, duration: 510 },
  { date: '2024-01-15', lessonId: 1, wpm: 22, accuracy: 91, duration: 350 },
]
