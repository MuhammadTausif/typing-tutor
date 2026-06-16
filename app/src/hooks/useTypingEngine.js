import { useState, useEffect, useRef, useCallback } from 'react'

// char state: 'pending' | 'correct' | 'incorrect' | 'current'
function buildCharStates(text) {
  return text.split('').map((ch, i) => ({ ch, state: i === 0 ? 'current' : 'pending' }))
}

export default function useTypingEngine(text) {
  const [chars, setChars]       = useState(() => buildCharStates(text))
  const [cursor, setCursor]     = useState(0)
  const [started, setStarted]   = useState(false)
  const [finished, setFinished] = useState(false)
  const [wpm, setWpm]           = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [elapsed, setElapsed]   = useState(0)
  const [errors, setErrors]     = useState(0)

  const startTime  = useRef(null)
  const timerRef   = useRef(null)
  const errorsRef  = useRef(0)
  const cursorRef  = useRef(0)   // mirrors cursor state; safe to read in callbacks
  const startedRef = useRef(false)
  const finishedRef = useRef(false)

  useEffect(() => { reset() }, [text])

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        const secs    = (Date.now() - startTime.current) / 1000
        const pos     = cursorRef.current
        setElapsed(Math.floor(secs))
        const grossWpm = Math.round((pos / 5) / (secs / 60))
        setWpm(isFinite(grossWpm) ? grossWpm : 0)
      }, 500)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [started, finished])

  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    errorsRef.current  = 0
    cursorRef.current  = 0
    startedRef.current = false
    finishedRef.current = false
    setChars(buildCharStates(text))
    setCursor(0)
    setStarted(false)
    setFinished(false)
    setWpm(0)
    setAccuracy(100)
    setElapsed(0)
    setErrors(0)
    startTime.current = null
  }, [text])

  const handleKey = useCallback((key) => {
    if (finishedRef.current) return

    if (!startedRef.current) {
      startedRef.current = true
      startTime.current  = Date.now()
      setStarted(true)
    }

    const pos = cursorRef.current
    if (pos >= text.length) return

    const expected = text[pos]
    const correct  = key === expected

    if (!correct) {
      errorsRef.current += 1
      setErrors(errorsRef.current)
    }

    const newCursor  = pos + 1
    const totalTyped = newCursor
    const acc = Math.round(((totalTyped - errorsRef.current) / totalTyped) * 100)

    cursorRef.current = newCursor
    setCursor(newCursor)
    setAccuracy(Math.max(0, acc))

    setChars(prev => {
      const next = [...prev]
      next[pos] = { ...next[pos], state: correct ? 'correct' : 'incorrect' }
      if (newCursor < next.length) {
        next[newCursor] = { ...next[newCursor], state: 'current' }
      }
      return next
    })

    if (newCursor >= text.length) {
      const secs     = (Date.now() - startTime.current) / 1000
      const finalWpm = Math.round((totalTyped / 5) / (secs / 60))
      finishedRef.current = true
      setFinished(true)
      setWpm(isFinite(finalWpm) ? finalWpm : 0)
    }
  }, [text])

  return { chars, cursor, wpm, accuracy, elapsed, errors, started, finished, handleKey, reset }
}
