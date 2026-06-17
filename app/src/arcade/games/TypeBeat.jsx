import { useRef, useEffect, useState, useCallback } from 'react'
import { GameHUD, PauseOverlay } from '../ArcadeShell'
import { DIFFICULTY, makeParticles, updateParticles, drawParticles } from '../config'

// ── Config ────────────────────────────────────────────────────────────────────

const SONG_DURATION = { easy: 60, medium: 90, hard: 120 }
const BPM           = { easy: 80, medium: 110, hard: 140 }
const NOTE_SPEED    = 300   // px/s
const LANE_COUNT    = 3
const HIT_ZONE_X_RATIO = 0.25

// timing windows (ms each side) — use DIFFICULTY.timingMs from config as PERFECT window
const GOOD_WINDOW   = 150
// PERFECT window comes from DIFFICULTY[diff].timingMs (easy=140, medium=90, hard=55)

function buildCharPool(wordPool) {
  const chars = wordPool.map(w => w[0]).filter(Boolean)
  const unique = [...new Set(chars)].filter(c => /[a-z;,./0-9]/.test(c))
  return unique.length >= 3 ? unique : ['a', 's', 'd', 'f', 'j', 'k', 'l']
}

// Rainbow hue cycle helper
function rainbowColor(t) {
  const hue = (t / 20) % 360
  return `hsl(${hue}, 100%, 60%)`
}

// Rounded rect helper
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TypeBeat({ wordPool, difficulty, onGameOver }) {
  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const gameState    = useRef(null)

  const diff      = DIFFICULTY[difficulty] || DIFFICULTY.medium
  const songSecs  = SONG_DURATION[difficulty] || 90
  const bpm       = BPM[difficulty] || 110
  const perfectMs = diff.timingMs   // from config

  const charPool = buildCharPool(wordPool)

  // React HUD state
  const [score,  setScore]  = useState(0)
  const [combo,  setCombo]  = useState(0)
  const [wpm,    setWpm]    = useState(0)
  const [groove, setGroove] = useState(50)
  const [status, setStatus] = useState('playing') // 'playing' | 'paused' | 'over'
  const [elapsed, setElapsed] = useState(0)

  // ── Init ────────────────────────────────────────────────────────────────────

  const initGame = useCallback(() => {
    return {
      notes: [],
      particles: [],
      flashTexts: [],   // { text, x, y, color, life, decay }
      spotlights: [
        { x: 0.2, y: -0.1, hue: 320, angle: 0, speed: 0.003, size: 0.4 },
        { x: 0.5, y: -0.1, hue: 270, angle: Math.PI / 3, speed: -0.002, size: 0.5 },
        { x: 0.8, y: -0.1, hue: 190, angle: Math.PI * 0.7, speed: 0.004, size: 0.35 },
      ],
      score: 0,
      combo: 0,
      peakCombo: 0,
      groove: 50,
      multiplier: 1,
      charsTyped: 0,
      correctChars: 0,
      totalChars: 0,
      startTime: Date.now(),
      lastWpmUpdate: Date.now(),
      lastNoteSpawn: Date.now(),
      songElapsed: 0,
      lastFrameTime: Date.now(),
      shakeFrames: 0,
      shakeIntensity: 0,
      hitZonePulse: 0,
      screenDark: 0,   // 0..1 for MISS darkness flash
      status: 'playing',
      pauseTime: null,
      // bpm-based spawn interval: one note per beat, adjusted per lane
      beatInterval: (60000 / bpm) * (LANE_COUNT),  // stagger across 3 lanes
      laneNextSpawn: [0, (60000 / bpm), (60000 / bpm) * 2],
    }
  }, [bpm])

  useEffect(() => {
    gameState.current = initGame()
    setScore(0)
    setCombo(0)
    setWpm(0)
    setGroove(50)
    setStatus('playing')
    setElapsed(0)

    const el = containerRef.current
    if (el) el.focus()
  }, [initGame])

  // ── Key handler ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.focus()

    const handler = (e) => {
      if (e.key === 'Escape') {
        const gs = gameState.current
        if (!gs || gs.status === 'over') return
        if (gs.status === 'playing') {
          gs.pauseTime = Date.now()
          gs.status = 'paused'
          setStatus('paused')
        } else if (gs.status === 'paused') {
          const paused = Date.now() - gs.pauseTime
          gs.startTime      += paused
          gs.lastNoteSpawn  += paused
          gs.lastWpmUpdate  += paused
          gs.lastFrameTime  += paused
          gs.laneNextSpawn   = gs.laneNextSpawn.map(t => t + paused)
          gs.notes.forEach(n => { n.spawnTime += paused })
          gs.pauseTime = null
          gs.status = 'playing'
          setStatus('playing')
        }
        return
      }

      const gs = gameState.current
      if (!gs || gs.status !== 'playing') return

      const key = e.key.toLowerCase()
      if (key.length !== 1) return

      gs.totalChars++
      gs.charsTyped++

      const canvas = canvasRef.current
      if (!canvas) return
      const W = canvas.offsetWidth
      const hitX = W * HIT_ZONE_X_RATIO

      const now = Date.now()

      // Find closest unhit note matching this key, sorted by proximity to hit zone
      const matching = gs.notes
        .filter(n => !n.hit && n.char === key)
        .sort((a, b) => Math.abs(a.x - hitX) - Math.abs(b.x - hitX))

      if (matching.length === 0) {
        // No matching note — count as miss only if there's any note in zone range
        gs.correctChars  // don't count miss on stray keypress without notes
        return
      }

      const note = matching[0]
      // Calculate how far in time the note is from the hit zone
      // note.x currently = hitX + (elapsed since spawnTime) * NOTE_SPEED ...
      // Actually we track note.x in canvas draw. Compute timing offset:
      const timeSinceAtZone = (note.x - hitX) / NOTE_SPEED * 1000  // positive = haven't reached yet, negative = passed
      const timingOffset = Math.abs(timeSinceAtZone)

      note.hit = true

      if (timingOffset <= perfectMs) {
        // PERFECT
        gs.correctChars++
        gs.combo++
        if (gs.combo > gs.peakCombo) gs.peakCombo = gs.combo
        gs.multiplier = Math.min(4, 1 + Math.floor(gs.combo / 10))
        gs.groove = Math.min(100, gs.groove + 5)
        gs.score += 100 * gs.multiplier
        setScore(gs.score)
        setCombo(gs.combo)
        setGroove(gs.groove)
        // Particle burst at hit zone
        const H = canvas.offsetHeight
        const laneH = H / LANE_COUNT
        const laneY = note.lane * laneH + laneH / 2
        gs.particles = gs.particles.concat(makeParticles(hitX, laneY, '#f472b6', 18))
        gs.particles = gs.particles.concat(makeParticles(hitX, laneY, '#ec4899', 10))
        // Flash text
        gs.flashTexts.push({ text: 'PERFECT!', x: hitX, y: laneY - 30, color: '#f472b6', life: 1, decay: 0.025 })
      } else if (timingOffset <= GOOD_WINDOW) {
        // GOOD
        gs.correctChars++
        gs.combo++
        if (gs.combo > gs.peakCombo) gs.peakCombo = gs.combo
        gs.multiplier = Math.min(4, 1 + Math.floor(gs.combo / 10))
        gs.groove = Math.min(100, gs.groove + 2)
        gs.score += 50 * gs.multiplier
        setScore(gs.score)
        setCombo(gs.combo)
        setGroove(gs.groove)
        const H = canvas.offsetHeight
        const laneH = H / LANE_COUNT
        const laneY = note.lane * laneH + laneH / 2
        gs.particles = gs.particles.concat(makeParticles(hitX, laneY, '#4ade80', 8))
        gs.flashTexts.push({ text: 'GOOD', x: hitX, y: laneY - 30, color: '#4ade80', life: 1, decay: 0.035 })
      } else {
        // Too far — treat as miss (note was marked hit anyway to remove it)
        gs.combo = 0
        gs.groove = difficulty === 'easy' ? Math.max(10, gs.groove - 15) : Math.max(0, gs.groove - 15)
        gs.multiplier = 1
        gs.shakeFrames = 10
        gs.shakeIntensity = 4
        gs.screenDark = 0.35
        setCombo(0)
        setGroove(gs.groove)
        const H = canvas.offsetHeight
        const laneH = H / LANE_COUNT
        const laneY = note.lane * laneH + laneH / 2
        gs.flashTexts.push({ text: 'MISS', x: hitX, y: laneY - 30, color: '#f87171', life: 1, decay: 0.04 })
        if (gs.groove <= 0 && difficulty !== 'easy') {
          endGame(gs)
        }
      }
    }

    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [charPool, difficulty, perfectMs])

  // ── End game helper ──────────────────────────────────────────────────────────

  const endGame = useCallback((gs) => {
    if (!gs || gs.status === 'over') return
    gs.status = 'over'
    setStatus('over')
    const elapsed = (Date.now() - gs.startTime) / 1000
    const finalWpm = Math.round((gs.charsTyped / 5) / (elapsed / 60))
    const accuracy = Math.round((gs.correctChars / Math.max(1, gs.totalChars)) * 100)
    onGameOver({
      score: gs.score,
      wpm: isFinite(finalWpm) ? finalWpm : 0,
      accuracy,
      peakCombo: gs.peakCombo,
      duration: Math.round(elapsed),
      wordsCompleted: gs.correctChars,
    })
  }, [onGameOver])

  // ── RAF game loop ────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId

    const loop = () => {
      const gs = gameState.current
      if (!gs) { animId = requestAnimationFrame(loop); return }

      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1

      // Resize canvas
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        const nW = canvas.offsetWidth * dpr
        const nH = canvas.offsetHeight * dpr
        if (canvas.width !== nW || canvas.height !== nH) {
          canvas.width  = nW
          canvas.height = nH
        }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight

      if (gs.status === 'paused' || gs.status === 'over') {
        animId = requestAnimationFrame(loop)
        return
      }

      const now    = Date.now()
      const dtMs   = Math.min(now - gs.lastFrameTime, 100)
      const dt     = dtMs / 1000
      gs.lastFrameTime = now

      gs.songElapsed += dt
      setElapsed(Math.floor(gs.songElapsed))

      // Song end check
      if (gs.songElapsed >= songSecs) {
        endGame(gs)
        return
      }

      // WPM update every 500ms
      if (now - gs.lastWpmUpdate >= 500) {
        gs.lastWpmUpdate = now
        const secs = (now - gs.startTime) / 1000
        const w = Math.round((gs.charsTyped / 5) / (secs / 60))
        setWpm(isFinite(w) ? w : 0)
      }

      // ── Spawn notes ───────────────────────────────────────────────────────────
      const beatMs = 60000 / bpm
      for (let lane = 0; lane < LANE_COUNT; lane++) {
        if (now >= gs.laneNextSpawn[lane]) {
          const char = charPool[Math.floor(Math.random() * charPool.length)]
          gs.notes.push({
            id: now + lane + Math.random(),
            char,
            lane,
            x: W + 40,
            hit: false,
            missed: false,
            spawnTime: now,
          })
          // Next spawn for this lane: 1 beat per lane * LANE_COUNT lanes, with slight random offset
          gs.laneNextSpawn[lane] = now + beatMs * LANE_COUNT * (0.9 + Math.random() * 0.3)
        }
      }

      // ── Update notes ─────────────────────────────────────────────────────────
      const hitX = W * HIT_ZONE_X_RATIO
      for (const note of gs.notes) {
        if (!note.hit) note.x -= NOTE_SPEED * dt
        // Mark missed if scrolled past hit zone by GOOD_WINDOW worth of distance
        if (!note.hit && note.x < hitX - (GOOD_WINDOW / 1000) * NOTE_SPEED - 30) {
          if (!note.missed) {
            note.missed = true
            gs.combo = 0
            gs.groove = difficulty === 'easy' ? Math.max(10, gs.groove - 15) : Math.max(0, gs.groove - 15)
            gs.multiplier = 1
            gs.shakeFrames = 8
            gs.shakeIntensity = 3
            gs.screenDark = 0.3
            setCombo(0)
            setGroove(gs.groove)
            const laneH = H / LANE_COUNT
            const laneY = note.lane * laneH + laneH / 2
            gs.flashTexts.push({ text: 'MISS', x: hitX, y: laneY - 30, color: '#f87171', life: 1, decay: 0.04 })
            if (gs.groove <= 0 && difficulty !== 'easy') {
              endGame(gs)
              return
            }
          }
        }
      }
      // Remove off-screen / hit+faded notes
      gs.notes = gs.notes.filter(n => n.x > -80 && !(n.hit && n.x < hitX - 60))

      // ── Update particles / flash texts ────────────────────────────────────────
      gs.particles = updateParticles(gs.particles)
      for (const ft of gs.flashTexts) { ft.life -= ft.decay; ft.y -= 0.8 }
      gs.flashTexts = gs.flashTexts.filter(ft => ft.life > 0)

      // ── Animations ────────────────────────────────────────────────────────────
      gs.hitZonePulse += 0.05
      if (gs.shakeFrames > 0) gs.shakeFrames--
      if (gs.screenDark > 0) gs.screenDark = Math.max(0, gs.screenDark - 0.02)

      // Spotlights
      for (const sp of gs.spotlights) {
        sp.angle += sp.speed
      }

      // ── DRAW ──────────────────────────────────────────────────────────────────

      // Shake offset
      let sx = 0, sy = 0
      if (gs.shakeFrames > 0) {
        const intensity = gs.shakeIntensity * (gs.shakeFrames / 10)
        sx = (Math.random() - 0.5) * intensity * 2
        sy = (Math.random() - 0.5) * intensity * 2
      }
      ctx.save()
      ctx.translate(sx, sy)

      // Background
      ctx.fillStyle = '#0d0015'
      ctx.fillRect(-10, -10, W + 20, H + 20)

      // ── Spotlights ────────────────────────────────────────────────────────────
      for (const sp of gs.spotlights) {
        const cx = W * sp.x + Math.sin(sp.angle) * W * 0.2
        const cy = H * 0.5 + Math.cos(sp.angle * 0.7) * H * 0.3
        const grad = ctx.createRadialGradient(W * sp.x, 0, 0, cx, cy, W * sp.size)
        grad.addColorStop(0, `hsla(${sp.hue}, 100%, 60%, 0.12)`)
        grad.addColorStop(0.5, `hsla(${sp.hue}, 80%, 50%, 0.05)`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      }

      // ── Floor grid lines (subtle) ─────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.06)'
      ctx.lineWidth = 1
      const step = 40
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }

      // ── Lane dividers ─────────────────────────────────────────────────────────
      const laneH = H / LANE_COUNT
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.12)'
      ctx.lineWidth = 1
      for (let i = 1; i < LANE_COUNT; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * laneH)
        ctx.lineTo(W, i * laneH)
        ctx.stroke()
      }

      // ── Lane labels (left side) ───────────────────────────────────────────────
      ctx.fillStyle = 'rgba(244, 114, 182, 0.2)'
      ctx.font = '11px monospace'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      for (let i = 0; i < LANE_COUNT; i++) {
        ctx.fillText(`LANE ${i + 1}`, 8, i * laneH + laneH / 2)
      }

      // ── Hit zone line ─────────────────────────────────────────────────────────
      const pulse = Math.sin(gs.hitZonePulse) * 0.5 + 0.5
      const hitAlpha = 0.5 + pulse * 0.4
      ctx.save()
      ctx.shadowBlur = 20 + pulse * 15
      ctx.shadowColor = `rgba(244, 114, 182, ${hitAlpha})`
      ctx.strokeStyle = `rgba(244, 114, 182, ${hitAlpha})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(hitX, 0)
      ctx.lineTo(hitX, H)
      ctx.stroke()
      // Glow ring at intersections
      for (let i = 0; i < LANE_COUNT; i++) {
        const ly = i * laneH + laneH / 2
        ctx.fillStyle = `rgba(244, 114, 182, ${0.15 + pulse * 0.1})`
        ctx.beginPath()
        ctx.arc(hitX, ly, 18 + pulse * 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // ── Notes ─────────────────────────────────────────────────────────────────
      const noteW = 52
      const noteH = laneH * 0.55
      for (const note of gs.notes) {
        if (note.missed) continue
        const nx = note.x - noteW / 2
        const ny = note.lane * laneH + (laneH - noteH) / 2
        const distToZone = Math.abs(note.x - hitX)
        const inZone = distToZone < 70

        // Proximity glow
        const glowStrength = inZone ? 28 : 10
        const glowAlpha    = inZone ? 0.9 : 0.6

        ctx.save()
        ctx.shadowBlur  = glowStrength
        ctx.shadowColor = '#f472b6'
        ctx.globalAlpha = note.hit ? Math.max(0, 0.8 - (hitX - note.x) / 80) : 1

        // Body
        ctx.fillStyle = inZone ? '#f472b6' : 'rgba(236, 72, 153, 0.75)'
        roundRect(ctx, nx, ny, noteW, noteH, 8)
        ctx.fill()

        // Inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
        roundRect(ctx, nx + 3, ny + 3, noteW - 6, noteH * 0.4, 5)
        ctx.fill()

        // Key label
        ctx.shadowBlur = 0
        ctx.fillStyle = inZone ? '#fff' : '#fce7f3'
        ctx.font = `bold ${noteH * 0.55}px monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(note.char.toUpperCase(), note.x, note.lane * laneH + laneH / 2)

        ctx.restore()
      }

      // ── Particles ─────────────────────────────────────────────────────────────
      drawParticles(ctx, gs.particles)

      // ── Flash texts ───────────────────────────────────────────────────────────
      for (const ft of gs.flashTexts) {
        ctx.save()
        ctx.globalAlpha = ft.life
        ctx.shadowBlur  = 14
        ctx.shadowColor = ft.color
        ctx.fillStyle   = ft.color
        ctx.font        = `bold ${ft.text === 'PERFECT!' ? 22 : 18}px monospace`
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(ft.text, ft.x, ft.y)
        ctx.restore()
      }

      // ── Combo escalation overlay ──────────────────────────────────────────────
      const curCombo = gs.combo
      if (curCombo >= 5) {
        let glowColor
        if (curCombo >= 20) {
          glowColor = `${rainbowColor(now)}`.replace('hsl', 'hsla').replace(')', ', 0.05)')
        } else if (curCombo >= 10) {
          glowColor = 'rgba(250, 204, 21, 0.05)'
        } else {
          glowColor = 'rgba(251, 146, 60, 0.04)'
        }
        ctx.fillStyle = glowColor
        ctx.fillRect(0, 0, W, H)
      }

      // ── Combo big text (top right canvas) when combo >= 5 ─────────────────────
      if (curCombo >= 5) {
        let comboColor
        if (curCombo >= 20) comboColor = rainbowColor(now)
        else if (curCombo >= 10) comboColor = '#facc15'
        else comboColor = '#fb923c'

        ctx.save()
        ctx.globalAlpha = 0.9
        ctx.shadowBlur  = 22
        ctx.shadowColor = comboColor
        ctx.fillStyle   = comboColor
        ctx.font        = `bold ${Math.min(64, 36 + curCombo)}px monospace`
        ctx.textAlign   = 'right'
        ctx.textBaseline = 'top'
        ctx.fillText(`×${curCombo}`, W - 16, 64)
        ctx.font = 'bold 13px monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText('COMBO', W - 16, 64 + Math.min(64, 36 + curCombo) + 4)
        ctx.restore()
      }

      // ── Multiplier indicator ──────────────────────────────────────────────────
      if (gs.multiplier > 1) {
        ctx.save()
        ctx.fillStyle = '#f472b6'
        ctx.font = 'bold 14px monospace'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'top'
        ctx.globalAlpha = 0.7
        ctx.fillText(`${gs.multiplier}× MULTIPLIER`, W - 16, 16)
        ctx.restore()
      }

      // ── Screen darkness flash on miss ────────────────────────────────────────
      if (gs.screenDark > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${gs.screenDark})`
        ctx.fillRect(0, 0, W, H)
      }

      // ── Groove meter on canvas (bottom bar) ──────────────────────────────────
      const gmH = 8
      const gmY = H - gmH - 2
      const gmW = W * 0.6
      const gmX = W * 0.2

      // Track BG
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      roundRect(ctx, gmX, gmY, gmW, gmH, 4)
      ctx.fill()

      // Fill
      const grooveFrac = gs.groove / 100
      const grooveColor = gs.groove > 60 ? '#f472b6'
        : gs.groove > 30 ? '#fb923c'
        : '#f87171'
      ctx.save()
      ctx.shadowBlur  = 8
      ctx.shadowColor = grooveColor
      ctx.fillStyle   = grooveColor
      roundRect(ctx, gmX, gmY, gmW * grooveFrac, gmH, 4)
      ctx.fill()
      ctx.restore()

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('GROOVE', W / 2, gmY - 2)

      // ── Song progress bar (very bottom) ───────────────────────────────────────
      const progFrac = Math.min(1, gs.songElapsed / songSecs)
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      ctx.fillRect(0, H - 3, W, 3)
      ctx.fillStyle = 'rgba(244, 114, 182, 0.5)'
      ctx.fillRect(0, H - 3, W * progFrac, 3)

      ctx.restore()  // end shake

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [songSecs, bpm, charPool, difficulty, endGame])

  // ── Pause / quit handlers ────────────────────────────────────────────────────

  const handleResume = useCallback(() => {
    const gs = gameState.current
    if (!gs) return
    const paused = Date.now() - (gs.pauseTime || Date.now())
    gs.startTime      += paused
    gs.lastNoteSpawn  += paused
    gs.lastWpmUpdate  += paused
    gs.lastFrameTime   = Date.now()
    gs.laneNextSpawn   = gs.laneNextSpawn.map(t => t + paused)
    gs.notes.forEach(n => { n.spawnTime += paused })
    gs.pauseTime = null
    gs.status = 'playing'
    setStatus('playing')
    const el = containerRef.current
    if (el) el.focus()
  }, [])

  const handleQuit = useCallback(() => {
    const gs = gameState.current
    if (!gs) return
    endGame(gs)
  }, [endGame])

  // ── Render ───────────────────────────────────────────────────────────────────

  const timeLeft = Math.max(0, songSecs - elapsed)

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-full outline-none"
      style={{ background: '#0d0015' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: 'block' }}
      />

      {/* GameHUD — score, combo, wpm at top */}
      <GameHUD
        score={score}
        lives={0}
        combo={combo}
        wpm={wpm}
        elapsed={elapsed}
        maxLives={0}
      />

      {/* Groove meter label overlay (React DOM, above canvas groove bar) */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-center pointer-events-none z-10 pb-6">
        <div className="flex flex-col items-center gap-1">
          {/* Groove label and value */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-1.5 border border-pink-500/20">
            <span className="text-xs font-semibold text-pink-400/70 uppercase tracking-wider">Groove</span>
            <div
              className="text-sm font-black tabular-nums"
              style={{
                color: groove > 60 ? '#f472b6' : groove > 30 ? '#fb923c' : '#f87171',
              }}
            >
              {groove}
            </div>
            <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${groove}%`,
                  background: groove > 60 ? '#f472b6' : groove > 30 ? '#fb923c' : '#f87171',
                  boxShadow: `0 0 6px ${groove > 60 ? '#f472b6' : groove > 30 ? '#fb923c' : '#f87171'}`,
                }}
              />
            </div>
          </div>
          {/* Time remaining */}
          <div className="bg-black/40 rounded px-3 py-0.5 border border-white/10">
            <span className="text-xs text-slate-400 tabular-nums">
              {timeLeft <= 10
                ? <span style={{ color: '#f87171' }}>{timeLeft}s left</span>
                : <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} left</span>
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
