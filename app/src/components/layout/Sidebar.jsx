import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Gamepad2, Trophy, Settings, Zap } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lessons',      icon: BookOpen,         label: 'Lessons'   },
  { to: '/arcade',       icon: Gamepad2,         label: 'Arcade'    },
  { to: '/achievements', icon: Trophy,           label: 'Achievements' },
  { to: '/settings',     icon: Settings,         label: 'Settings'  },
]

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-60 shrink-0 h-full bg-navy-900 border-r border-vel-border/40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-vel-border/30">
        <div className="flex items-center justify-center size-8 rounded-lg bg-vel-violet/20 ring-1 ring-vel-violet/40">
          <Zap className="size-4 text-vel-violet" />
        </div>
        <span className="text-base font-bold tracking-tight">
          <span className="text-gradient">Velocity</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-vel-violet/15 text-vel-violet ring-1 ring-vel-violet/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="px-4 py-4 border-t border-vel-border/30">
        <div className="text-xs text-slate-500">Velocity v0.1.0</div>
      </div>
    </aside>
  )
}
