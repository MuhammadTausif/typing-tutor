import { useRef, useEffect } from 'react'
import clsx from 'clsx'

// Per-character display
function Char({ ch, state }) {
  if (ch === ' ') {
    return (
      <span
        className={clsx(
          'inline-block w-[0.5ch]',
          state === 'current' && 'char-current border-vel-cyan',
          state === 'incorrect' && 'bg-red-500/20 rounded-sm',
        )}
      >
        &nbsp;
      </span>
    )
  }
  return (
    <span
      className={clsx(
        'font-mono text-xl leading-relaxed tracking-wide transition-colors duration-75',
        state === 'pending'   && 'text-slate-500',
        state === 'correct'   && 'text-slate-200',
        state === 'incorrect' && 'text-red-400 bg-red-500/10 rounded-sm',
        state === 'current'   && 'text-white char-current border-vel-cyan',
      )}
    >
      {ch}
    </span>
  )
}

export default function TypingArea({ chars, onKey, finished, disabled }) {
  const inputRef = useRef(null)

  // Auto-focus hidden input
  useEffect(() => {
    if (!finished && !disabled) inputRef.current?.focus()
  }, [finished, disabled])

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key === 'Backspace') return  // no backspace — forward-only
    if (e.key.length === 1) {
      e.preventDefault()
      onKey(e.key)
    }
  }

  return (
    <div
      className="relative cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden capture input */}
      <input
        ref={inputRef}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        onKeyDown={handleKeyDown}
        readOnly
        aria-label="Typing input"
        tabIndex={0}
      />

      {/* Text display */}
      <div className="card p-6 min-h-[7rem] select-none">
        <p className="font-mono text-xl leading-relaxed tracking-wide break-all">
          {chars.map((c, i) => (
            <Char key={i} ch={c.ch} state={c.state} />
          ))}
        </p>
        {!finished && (
          <p className="mt-3 text-xs text-slate-600">
            Click here then start typing — no backspace
          </p>
        )}
      </div>
    </div>
  )
}
