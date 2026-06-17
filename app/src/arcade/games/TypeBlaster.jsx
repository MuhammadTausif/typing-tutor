import { useRef, useEffect, useState, useCallback } from 'react'
import { GameHUD, PauseOverlay } from '../ArcadeShell'
import { DIFFICULTY, makeParticles, updateParticles, drawParticles, randomWord } from '../config'

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_ENEMIES   = { easy: 3, medium: 4, hard: 5 }
const SPAWN_MS      = { easy: 2800, medium: 2000, hard: 1400 }
const FALL_SPEED    = { easy: 28,   medium: 50,   hard: 80   }
const ENEMY_COLORS  = ['#f87171','#fb923c','#fbbf24','#a78bfa','#38bdf8','#4ade80']

function makeEnemy(word, W, id) {
  return {
    id, word, typed: '',
    x: 80 + Math.random() * (W - 160),
    y: -40,
    color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
    targeted: false,
    pulsePhase: Math.random() * Math.PI * 2,
  }
}

export default function TypeBlaster({ wordPool, difficulty, onGameOver }) {
  const canvasRef   = useRef()
  const containerRef = useRef()
  const stateRef    = useRef({
    enemies: [], particles: [], stars: [],
    laser: null,         // { x1,y1,x2,y2, life }
    shake: 0,
    lastSpawn: 0,
    startTime: 0,
    charsTyped: 0, correctChars: 0,
    score: 0, combo: 0, peakCombo: 0,
    wordsCompleted: 0,
    lives: 3,
    status: 'playing',
    nextId: 0,
  })
  const diffRef = useRef(DIFFICULTY[difficulty] || DIFFICULTY.medium)
  const poolRef = useRef(wordPool && wordPool.length > 0 ? wordPool : ['fire','storm','laser','blast','nova','comet','star','void','flux'])

  const [score,   setScore]   = useState(0)
  const [lives,   setLives]   = useState(diffRef.current.lives)
  const [combo,   setCombo]   = useState(0)
  const [wpm,     setWpm]     = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const pausedRef = useRef(false)
  const rafRef    = useRef()
  const lastWpmUpdate = useRef(0)
  const maxLives  = diffRef.current.lives

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const s      = stateRef.current
    s.lives      = diffRef.current.lives
    s.startTime  = Date.now()
    s.lastSpawn  = Date.now()

    // Generate stars
    s.stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 1.5,
      speed: 0.08 + Math.random() * 0.25,
      alpha: 0.3 + Math.random() * 0.7,
    }))

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)
    containerRef.current?.focus()

    // ── Game loop ────────────────────────────────────────────────────────────
    function loop(ts) {
      if (pausedRef.current) { rafRef.current = requestAnimationFrame(loop); return }
      const s   = stateRef.current
      const W   = canvas.offsetWidth
      const H   = canvas.offsetHeight
      const now = Date.now()
      const dt  = 1 / 60
      const spd = FALL_SPEED[difficulty] || 50
      const maxE = MAX_ENEMIES[difficulty] || 4

      // Spawn
      const spawnInterval = SPAWN_MS[difficulty] || 2000
      if (s.enemies.length < maxE && now - s.lastSpawn > spawnInterval) {
        s.enemies.push(makeEnemy(randomWord(poolRef.current), W, s.nextId++))
        s.lastSpawn = now
      }

      // Move enemies
      for (const e of s.enemies) {
        e.y += spd * dt
        e.pulsePhase += 0.05
      }

      // Check if enemy reached bottom
      const fallen = s.enemies.filter(e => e.y > H - 70)
      for (const e of fallen) {
        if (s.lives > 0) {
          s.lives--
          setLives(s.lives)
          s.shake = 12
          s.combo = 0
          setCombo(0)
        }
      }
      s.enemies = s.enemies.filter(e => e.y <= H - 70)

      // Particles + laser
      s.particles = updateParticles(s.particles)
      if (s.laser) { s.laser.life -= 0.08; if (s.laser.life <= 0) s.laser = null }
      if (s.shake > 0) s.shake *= 0.8

      // WPM update
      if (now - lastWpmUpdate.current > 500) {
        lastWpmUpdate.current = now
        const secs = (now - s.startTime) / 1000
        const wpmVal = Math.round((s.correctChars / 5) / (secs / 60))
        setWpm(isFinite(wpmVal) ? wpmVal : 0)
        setElapsed(Math.floor(secs))
      }

      // Timer / game over check
      const elapsed = (now - s.startTime) / 1000
      if (s.lives <= 0 || elapsed >= 90) {
        s.status = 'over'
        const finalWpm = Math.round((s.correctChars / 5) / (elapsed / 60))
        const accuracy = Math.round((s.correctChars / Math.max(1, s.charsTyped)) * 100)
        onGameOver({ score: s.score, wpm: isFinite(finalWpm) ? finalWpm : 0, accuracy, peakCombo: s.peakCombo, duration: elapsed, wordsCompleted: s.wordsCompleted })
        cancelAnimationFrame(rafRef.current)
        return
      }

      // ── Render ─────────────────────────────────────────────────────────────
      ctx.save()
      if (s.shake > 1) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake)
      }

      // Background
      ctx.fillStyle = '#03010a'
      ctx.fillRect(0, 0, W, H)

      // Stars
      for (const st of s.stars) {
        st.y += st.speed * dt
        if (st.y > 1) st.y = 0
        ctx.globalAlpha = st.alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Ground line
      const grd = ctx.createLinearGradient(0, H - 60, 0, H)
      grd.addColorStop(0, 'rgba(124,58,237,0.4)')
      grd.addColorStop(1, 'rgba(124,58,237,0.05)')
      ctx.fillStyle = grd
      ctx.fillRect(0, H - 60, W, 60)
      ctx.strokeStyle = 'rgba(124,58,237,0.8)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H - 60); ctx.lineTo(W, H - 60); ctx.stroke()

      // Cannon (triangle at bottom center)
      const cx = W / 2
      const cy = H - 30
      ctx.shadowBlur = 20; ctx.shadowColor = '#7c3aed'
      ctx.fillStyle = '#7c3aed'
      ctx.beginPath()
      ctx.moveTo(cx, cy - 28)
      ctx.lineTo(cx - 14, cy + 8)
      ctx.lineTo(cx + 14, cy + 8)
      ctx.closePath()
      ctx.fill()
      ctx.shadowBlur = 0

      // Laser beam
      if (s.laser) {
        ctx.globalAlpha = s.laser.life
        ctx.strokeStyle = '#7c3aed'
        ctx.lineWidth   = 3
        ctx.shadowBlur  = 15
        ctx.shadowColor = '#7c3aed'
        ctx.beginPath()
        ctx.moveTo(s.laser.x1, s.laser.y1)
        ctx.lineTo(s.laser.x2, s.laser.y2)
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      // Enemies
      for (const e of s.enemies) {
        const isTarget  = e.targeted
        const pulse     = 0.7 + 0.3 * Math.sin(e.pulsePhase)
        const boxW      = Math.max(120, e.word.length * 13 + 32)
        const boxH      = 46
        const ex        = e.x - boxW / 2
        const ey        = e.y - boxH / 2

        // Glow
        ctx.shadowBlur  = isTarget ? 24 * pulse : 10
        ctx.shadowColor = e.color

        // Box
        ctx.strokeStyle = e.color
        ctx.lineWidth   = isTarget ? 2.5 : 1.5
        ctx.globalAlpha = isTarget ? 1 : 0.85
        ctx.fillStyle   = 'rgba(0,0,0,0.6)'
        roundRect(ctx, ex, ey, boxW, boxH, 8)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur  = 0
        ctx.globalAlpha = 1

        // Word with per-char coloring
        const fontSize = 16
        ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`
        ctx.textBaseline = 'middle'
        const totalW = measureWord(ctx, e.word, fontSize)
        let cx2 = e.x - totalW / 2

        for (let i = 0; i < e.word.length; i++) {
          const ch = e.word[i]
          const chW = ctx.measureText(ch).width
          if (i < e.typed.length) {
            ctx.fillStyle = '#4ade80'          // correct
          } else if (i === e.typed.length) {
            ctx.fillStyle = '#ffffff'           // cursor
            ctx.shadowBlur = 8; ctx.shadowColor = '#ffffff'
          } else {
            ctx.fillStyle = '#94a3b8'           // pending
          }
          ctx.fillText(ch, cx2, e.y)
          ctx.shadowBlur = 0
          cx2 += chW
        }
      }

      // Particles
      drawParticles(ctx, s.particles)

      ctx.restore()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [difficulty, onGameOver])

  // ── Key handler ───────────────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (pausedRef.current) return
    if (e.key === 'Escape') { pausedRef.current = !pausedRef.current; setPaused(p => !p); return }
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey) return

    const key = e.key.toLowerCase()
    const s   = stateRef.current
    s.charsTyped++

    // Find targeted enemy or lock onto first match
    let target = s.enemies.find(en => en.targeted)
    if (!target) {
      target = s.enemies.find(en => en.word[0] === key)
      if (target) target.targeted = true
    }
    if (!target) { s.combo = 0; setCombo(0); return }

    const expected = target.word[target.typed.length]
    if (key === expected) {
      s.correctChars++
      target.typed += key
      if (target.typed === target.word) {
        // Word complete — fire laser
        const canvas = canvasRef.current
        s.laser = { x1: canvas.offsetWidth / 2, y1: canvas.offsetHeight - 30, x2: target.x, y2: target.y, life: 1 }
        s.particles.push(...makeParticles(target.x, target.y, target.color, 18))
        s.enemies = s.enemies.filter(en => en.id !== target.id)
        s.combo++
        s.peakCombo = Math.max(s.peakCombo, s.combo)
        const points = 10 + target.word.length * 2 + s.combo * 2
        s.score += points
        s.wordsCompleted++
        setScore(s.score)
        setCombo(s.combo)
      }
    } else {
      target.targeted = false
      target.typed    = ''
      s.combo = 0
      s.shake = 6
      setCombo(0)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    el?.addEventListener('keydown', handleKey)
    return () => el?.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const handleResume = () => { pausedRef.current = false; setPaused(false) }
  const handleQuit   = () => { onGameOver({ score: stateRef.current.score, wpm, accuracy: Math.round(stateRef.current.correctChars / Math.max(1, stateRef.current.charsTyped) * 100), peakCombo: stateRef.current.peakCombo, duration: elapsed, wordsCompleted: stateRef.current.wordsCompleted }) }

  return (
    <div ref={containerRef} tabIndex={0} className="relative w-full h-full outline-none bg-black" onClick={() => containerRef.current?.focus()}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <GameHUD score={score} lives={lives} combo={combo} wpm={wpm} elapsed={elapsed} maxLives={maxLives} />
      {paused && <PauseOverlay onResume={handleResume} onQuit={handleQuit} />}
      {!paused && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-slate-600 pointer-events-none">Type enemy words · ESC to pause</div>}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function measureWord(ctx, word, fontSize) {
  ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`
  return ctx.measureText(word).width
}
