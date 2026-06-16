import { Volume2, VolumeX, Keyboard, Eye, Sun } from 'lucide-react'
import useProgressStore from '../store/useProgressStore'

function Toggle({ label, description, icon: Icon, value, onChange }) {
  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-vel-violet/10 flex items-center justify-center">
          <Icon className="size-4 text-vel-violet" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">{label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-vel-violet/60 ${value ? 'bg-vel-violet' : 'bg-white/10'}`}
      >
        <span className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-y-0.5 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { progress, updateSettings } = useProgressStore()
  const s = progress.settings

  function set(key) {
    return val => updateSettings({ [key]: val })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-500 mt-1">Preferences are saved automatically to your browser.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Practice</h2>
        <Toggle
          label="Sound effects"
          description="Audible feedback for correct / incorrect keypresses"
          icon={s.soundEnabled ? Volume2 : VolumeX}
          value={s.soundEnabled}
          onChange={set('soundEnabled')}
        />
        <Toggle
          label="Show virtual keyboard"
          description="Display an on-screen keyboard during lessons"
          icon={Keyboard}
          value={s.showKeyboard}
          onChange={set('showKeyboard')}
        />
        <Toggle
          label="Finger guide"
          description="Colour-code keys by which finger should type them"
          icon={Eye}
          value={s.showFingerGuide}
          onChange={set('showFingerGuide')}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Appearance</h2>
        <div className="card p-4">
          <div className="text-xs text-slate-500">More themes coming soon — only Dark Mode is available now.</div>
        </div>
      </section>
    </div>
  )
}
