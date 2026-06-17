import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import LessonsPage from './pages/LessonsPage'
import PracticePage from './pages/PracticePage'
import ArcadePage from './pages/ArcadePage'
import ArcadeGamePage from './pages/ArcadeGamePage'
import AchievementsPage from './pages/AchievementsPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<PracticePage />} />
        <Route path="/arcade" element={<ArcadePage />} />
        <Route path="/arcade/:id" element={<ArcadeGamePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
