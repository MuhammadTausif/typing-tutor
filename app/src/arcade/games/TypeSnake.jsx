import { useRef, useEffect, useState, useCallback } from 'react'
import { GameHUD, PauseOverlay } from '../ArcadeShell'
import { DIFFICULTY, makeParticles, updateParticles, drawParticles } from '../config'

const TIME_LIMITS = { easy: 60, medium: 45, hard: 30 }
const CELL_SIZE = 28

function buildCharPool(wordPool) {
  const chars = wordPool.map(w => w[0]).filter(Boolean)
  const unique = [...new Set(chars)].filter(c => /[a-z;,./]/.test(c))
  return unique.length >= 4 ? unique.join('') : 'asdfjkl;'
}

function randomEmptyCell(snake, W, H) {
  const occupied = new Set(snake.map(c => `${c.x},${c.y}`))
  let x, y
  let attempts = 0
  do {
    x = Math.floor(Math.random() * W)
    y = Math.floor(Math.random() * H)
    attempts++
  } while (occupied.has(`${x},${y}`) && attempts < 500)
  return { x, y }
}

export default function TypeSnake({ wordPool, difficulty, onGameOver }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const gameState = useRef(null)

  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [status, setStatus] = useState('playing') // 'playing' | 'paused' | 'over'
  const [timeLeft, setTimeLeft] = useState(TIME_LIMITS[difficulty] || 45)

  const charPool = buildCharPool(wordPool)
  const diff = DIFFICULTY[difficulty] || DIFFICULTY.medium
  const timeLimit = TIME_LIMITS[difficulty] || 45

  const initGameState = useCallback(() => {
    const cols = Math.floor((window.innerWidth > 0 ? Math.min(window.innerWidth, 800) : 800) / CELL_SIZE)
    const rows = Math.floor((window.innerHeight > 0 ? Math.min(window.innerHeight, 600) : 600) / CELL_SIZE)
    const cx = Math.floor(cols / 2)
    const cy = Math.floor(rows / 2)
    const snake = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ]
    const food = randomEmptyCell(snake, cols, rows)
    const foodChar = charPool[Math.floor(Math.random() * charPool.length)]

    return {
      snake,
      cols,
      rows,
      food,
      foodChar,
      score: 0,
      combo: 0,
      peakCombo: 0,
      correctKeys: 0,
      wrongKeys: 0,
      charsTyped: 0,
      startTime: Date.now(),
      lastWpmUpdate: Date.now(),
      timeLeft: timeLimit,
      lastSecond: Date.now(),
      particles: [],
      shakeFrames: 0,
      shakeIntensity: 0,
      foodPulse: 0,
      status: 'playing',
    }
  }, [charPool, timeLimit])

  useEffect(() => {
    gameState.current = initGameState()
    setScore(0)
    setCombo(0)
    setWpm(0)
    setStatus('playing')
    setTimeLeft(timeLimit)

    const el = containerRef.current
    if (el) el.focus()
  }, [initGameState, timeLimit])

  // Key handler
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.focus()

    const handler = (e) => {
      if (e.key === 'Escape') {
        const gs = gameState.current
        if (!gs || gs.status === 'over') return
        if (gs.status === 'playing') {
          gs.status = 'paused'
          setStatus('paused')
        } else if (gs.status === 'paused') {
          gs.status = 'playing'
          gs.startTime += (Date.now() - (gs.pauseTime || Date.now()))
          gs.lastSecond += (Date.now() - (gs.pauseTime || Date.now()))
          setStatus('playing')
        }
        return
      }

      const gs = gameState.current
      if (!gs || gs.status !== 'playing') return

      const key = e.key.toLowerCase()
      if (key.length !== 1) return

      if (key === gs.foodChar) {
        // Correct key — grow snake
        gs.correctKeys++
        gs.charsTyped++
        gs.combo++
        if (gs.combo > gs.peakCombo) gs.peakCombo = gs.combo

        const head = gs.snake[0]
        const food = gs.food

        // Move head toward food direction (teleport to food cell)
        const newHead = { x: food.x, y: food.y }
        gs.snake.unshift(newHead)
        // Don't pop tail — snake grows

        // Check self collision (new head in old body)
        const bodySet = new Set(gs.snake.slice(1).map(c => `${c.x},${c.y}`))
        // newHead is now at food which was empty, so no collision here

        const bonus = Math.floor(gs.combo / 5) * 5
        gs.score += 10 + bonus
        setScore(gs.score)
        setCombo(gs.combo)

        // Particles at food position (will be converted to canvas coords in RAF)
        const canvasEl = canvasRef.current
        if (canvasEl) {
          const px = (food.x + 0.5) * CELL_SIZE
          const py = (food.y + 0.5) * CELL_SIZE
          gs.particles = gs.particles.concat(makeParticles(px, py, '#4ade80', 14))
        }

        // Spawn new food
        const newFood = randomEmptyCell(gs.snake, gs.cols, gs.rows)
        gs.food = newFood
        gs.foodChar = charPool[Math.floor(Math.random() * charPool.length)]
        gs.foodPulse = 0

      } else {
        // Wrong key
        gs.wrongKeys++
        gs.charsTyped++
        gs.combo = 0
        gs.shakeFrames = 12
        gs.shakeIntensity = 5
        setCombo(0)
      }
    }

    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [charPool])

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animId

    const loop = () => {
      const gs = gameState.current
      if (!gs) { animId = requestAnimationFrame(loop); return }

      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1

      // Resize if needed
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        const newW = canvas.offsetWidth * dpr
        const newH = canvas.offsetHeight * dpr
        if (canvas.width !== newW || canvas.height !== newH) {
          canvas.width = newW
          canvas.height = newH
          // Recalculate grid
          const cols = Math.floor(canvas.offsetWidth / CELL_SIZE)
          const rows = Math.floor(canvas.offsetHeight / CELL_SIZE)
          if (cols !== gs.cols || rows !== gs.rows) {
            gs.cols = cols
            gs.rows = rows
            // Clamp food
            if (gs.food.x >= cols) gs.food.x = cols - 1
            if (gs.food.y >= rows) gs.food.y = rows - 1
          }
        }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight

      if (gs.status === 'paused') {
        animId = requestAnimationFrame(loop)
        return
      }

      if (gs.status === 'over') {
        animId = requestAnimationFrame(loop)
        return
      }

      // Timer
      const now = Date.now()
      if (now - gs.lastSecond >= 1000) {
        gs.timeLeft = Math.max(0, gs.timeLeft - 1)
        gs.lastSecond = now
        setTimeLeft(gs.timeLeft)
        if (gs.timeLeft <= 0) {
          gs.status = 'over'
          setStatus('over')
          const elapsed = (Date.now() - gs.startTime) / 1000
          const finalWpm = Math.round((gs.charsTyped / 5) / (elapsed / 60))
          const accuracy = Math.round((gs.correctKeys / Math.max(1, gs.correctKeys + gs.wrongKeys)) * 100)
          onGameOver({
            score: gs.score,
            wpm: isFinite(finalWpm) ? finalWpm : 0,
            accuracy,
            peakCombo: gs.peakCombo,
            duration: Math.round(elapsed),
            wordsCompleted: gs.correctKeys,
          })
          return
        }
      }

      // WPM update every 500ms
      if (now - gs.lastWpmUpdate >= 500) {
        gs.lastWpmUpdate = now
        const secs = (now - gs.startTime) / 1000
        const w = Math.round((gs.charsTyped / 5) / (secs / 60))
        setWpm(isFinite(w) ? w : 0)
      }

      // Particles update
      gs.particles = updateParticles(gs.particles)

      // Food pulse
      gs.foodPulse = (gs.foodPulse + 0.05) % (Math.PI * 2)

      // Shake decay
      if (gs.shakeFrames > 0) gs.shakeFrames--

      // ── Draw ──────────────────────────────────────────────────────────────────

      // Shake transform
      let sx = 0, sy = 0
      if (gs.shakeFrames > 0) {
        const intensity = gs.shakeIntensity * (gs.shakeFrames / 12)
        sx = (Math.random() - 0.5) * intensity * 2
        sy = (Math.random() - 0.5) * intensity * 2
      }
      ctx.save()
      ctx.translate(sx, sy)

      // Background
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(-Math.abs(sx) - 2, -Math.abs(sy) - 2, W + Math.abs(sx) * 2 + 4, H + Math.abs(sy) * 2 + 4)

      // Grid lines
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.07)'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= W; x += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y <= H; y += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Snake
      const snake = gs.snake
      const snakeLen = snake.length
      for (let i = snakeLen - 1; i >= 0; i--) {
        const cell = snake[i]
        const t = i === 0 ? 1 : 1 - (i / snakeLen) * 0.75
        const x = cell.x * CELL_SIZE
        const y = cell.y * CELL_SIZE
        const pad = 2

        if (i === 0) {
          // Head — bright green with glow
          ctx.shadowBlur = 18
          ctx.shadowColor = '#4ade80'
          ctx.fillStyle = '#4ade80'
        } else {
          ctx.shadowBlur = 8
          ctx.shadowColor = '#22c55e'
          // Gradient from bright to dark green along body
          const g = Math.floor(80 + t * 134)
          ctx.fillStyle = `rgb(0, ${g}, 40)`
        }

        // Rounded rect
        const rx = x + pad
        const ry = y + pad
        const rw = CELL_SIZE - pad * 2
        const rh = CELL_SIZE - pad * 2
        const radius = 4
        ctx.beginPath()
        ctx.moveTo(rx + radius, ry)
        ctx.lineTo(rx + rw - radius, ry)
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
        ctx.lineTo(rx + rw, ry + rh - radius)
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
        ctx.lineTo(rx + radius, ry + rh)
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
        ctx.lineTo(rx, ry + radius)
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
        ctx.closePath()
        ctx.fill()

        // Eyes on head
        if (i === 0) {
          ctx.shadowBlur = 0
          ctx.fillStyle = '#0a0a1a'
          ctx.beginPath()
          ctx.arc(rx + rw * 0.3, ry + rh * 0.35, 2.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(rx + rw * 0.7, ry + rh * 0.35, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.shadowBlur = 0

      // Food cell
      const food = gs.food
      const fx = food.x * CELL_SIZE + CELL_SIZE / 2
      const fy = food.y * CELL_SIZE + CELL_SIZE / 2
      const pulseR = 11 + Math.sin(gs.foodPulse) * 3

      // Pulsing circle background
      ctx.shadowBlur = 20
      ctx.shadowColor = '#4ade80'
      ctx.strokeStyle = `rgba(74, 222, 128, ${0.5 + Math.sin(gs.foodPulse) * 0.3})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(fx, fy, pulseR, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = `rgba(74, 222, 128, ${0.12 + Math.sin(gs.foodPulse) * 0.06})`
      ctx.beginPath()
      ctx.arc(fx, fy, pulseR, 0, Math.PI * 2)
      ctx.fill()

      // Food character
      ctx.shadowBlur = 14
      ctx.shadowColor = '#4ade80'
      ctx.fillStyle = '#4ade80'
      ctx.font = `bold ${CELL_SIZE - 6}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(gs.foodChar, fx, fy)
      ctx.shadowBlur = 0

      // Timer ring in corner (low time warning)
      if (gs.timeLeft <= 10) {
        const pulse = Math.sin(Date.now() / 120) * 0.5 + 0.5
        ctx.strokeStyle = `rgba(248, 113, 113, ${0.4 + pulse * 0.5})`
        ctx.lineWidth = 3
        ctx.shadowBlur = 12
        ctx.shadowColor = '#f87171'
        ctx.beginPath()
        ctx.arc(W - 28, H - 28, 18, 0, Math.PI * 2 * (gs.timeLeft / 10))
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.fillStyle = `rgba(248, 113, 113, ${0.7 + pulse * 0.3})`
        ctx.font = 'bold 12px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(gs.timeLeft, W - 28, H - 28)
      }

      // Combo glow overlay
      if (gs.combo >= 5) {
        let glowColor
        if (gs.combo >= 20) {
          const hue = (Date.now() / 20) % 360
          glowColor = `hsla(${hue}, 100%, 60%, 0.04)`
        } else if (gs.combo >= 10) {
          glowColor = 'rgba(250, 204, 21, 0.04)'
        } else {
          glowColor = 'rgba(251, 146, 60, 0.04)'
        }
        ctx.fillStyle = glowColor
        ctx.fillRect(0, 0, W, H)
      }

      // Particles
      drawParticles(ctx, gs.particles)

      // Snake length indicator (bottom left)
      ctx.fillStyle = 'rgba(74, 222, 128, 0.4)'
      ctx.font = '11px monospace'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(`LENGTH: ${snake.length}`, 10, H - 10)

      ctx.restore()

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    rafRef.current = animId

    return () => cancelAnimationFrame(animId)
  }, [onGameOver])

  const handleResume = useCallback(() => {
    const gs = gameState.current
    if (!gs) return
    gs.pauseTime = gs.pauseTime || Date.now()
    const now = Date.now()
    const paused = now - (gs.pauseTime || now)
    gs.startTime += paused
    gs.lastSecond += paused
    gs.status = 'playing'
    gs.pauseTime = null
    setStatus('playing')
  }, [])

  const handleQuit = useCallback(() => {
    const gs = gameState.current
    if (!gs) return
    gs.status = 'over'
    setStatus('over')
    const elapsed = (Date.now() - gs.startTime) / 1000
    const finalWpm = Math.round((gs.charsTyped / 5) / (elapsed / 60))
    const accuracy = Math.round((gs.correctKeys / Math.max(1, gs.correctKeys + gs.wrongKeys)) * 100)
    onGameOver({
      score: gs.score,
      wpm: isFinite(finalWpm) ? finalWpm : 0,
      accuracy,
      peakCombo: gs.peakCombo,
      duration: Math.round(elapsed),
      wordsCompleted: gs.correctKeys,
    })
  }, [onGameOver])

  // Track pause time correctly
  useEffect(() => {
    const gs = gameState.current
    if (!gs) return
    if (status === 'paused') {
      gs.pauseTime = Date.now()
    }
  }, [status])

  const elapsed = timeLimit - timeLeft

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-full outline-none"
      style={{ background: '#0a0a1a' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: 'block' }}
      />

      <GameHUD
        score={score}
        lives={0}
        combo={combo}
        wpm={wpm}
        elapsed={elapsed}
        maxLives={0}
      />

      {/* Custom snake info overlay */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-center pb-4 pointer-events-none z-10">
        <div className="flex flex-col items-center gap-1">
          {gameState.current && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-1.5 border border-green-500/30 text-center">
              <span className="text-xs text-slate-500 font-medium">PRESS KEY TO EAT</span>
              <div
                className="text-3xl font-black tabular-nums tracking-widest"
                style={{ color: '#4ade80', textShadow: '0 0 12px #4ade80' }}
              >
                {gameState.current?.foodChar?.toUpperCase() ?? '?'}
              </div>
            </div>
          )}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
            <span className="text-xs text-slate-400">
              {timeLeft <= 10
                ? <span style={{ color: '#f87171' }}>TIME: {timeLeft}s</span>
                : <span className="text-slate-400">TIME: {timeLeft}s</span>
              }
            </span>
          </div>
        </div>
      </div>

      {status === 'paused' && (
        <PauseOverlay onResume={handleResume} onQuit={handleQuit} />
      )}
    </div>
  )
}
