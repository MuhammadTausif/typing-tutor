import { Link } from 'react-router-dom'
import Button from '../components/shared/Button'

export default function NotFoundPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 text-center p-6">
      <div className="text-7xl font-black text-gradient">404</div>
      <div>
        <h1 className="text-xl font-bold text-slate-200">Page not found</h1>
        <p className="text-slate-500 mt-1">This route doesn't exist — check the URL and try again.</p>
      </div>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  )
}
