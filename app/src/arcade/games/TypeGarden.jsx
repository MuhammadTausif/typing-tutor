import { useEffect, useRef, useState, useCallback } from 'react'
import { PauseOverlay } from '../ArcadeShell'
import { makeParticles, updateParticles, drawParticles, randomWord } from '../config'

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_PLANTS = 20
const MAX_SEEDS_ON_SCREEN = 4
const SEED_FADE_AFTER = 2   // remove seed after 2 new seeds appear without being typed
const BLOOM_DURATION = 1500 // ms
const SEED_SPEED_BASE = 28  // px/s — very slow float

// ── Procedural plant drawing helpers ─────────────────────────────────────────

function drawFlower(ctx, x, groundY, t, isGolden, wordLen) {
  // t: 0..1 bloom progress
  const scale = easeOutBack(t)
  const stemH = Math.min(30 + wordLen * 4, 80) * scale
  const petalR = Math.min(8 + wordLen * 2, 28) * scale

  // stem
  ctx.save()
  ctx.strokeStyle = isGolden ? '#fbbf24' : '#86efac'
  ctx.lineWidth = 2 * scale
  ctx.beginPath()
  ctx.moveTo(x, groundY)
  ctx.lineTo(x, groundY - stemH)
  ctx.stroke()

  // center
  const cx = x
  const cy = groundY - stemH
  const numPetals = Math.max(4, Math.min(wordLen + 2, 8))
  const petalColor = isGolden ? '#fde68a' : pastelPetal(wordLen)
  const centerColor = isGolden ? '#f59e0b' : '#fda4af'

  // petals
  ctx.fillStyle = petalColor
  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2
    const px = cx + Math.cos(angle) * petalR
    const py = cy + Math.sin(angle) * petalR
    ctx.beginPath()
    ctx.ellipse(px, py, petalR * 0.55 * scale, petalR * 0.35 * scale, angle, 0, Math.PI * 2)
    ctx.fill()
  }
  // center circle
  ctx.fillStyle = centerColor
  ctx.beginPath()
  ctx.arc(cx, cy, petalR * 0.38 * scale, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function drawTallPlant(ctx, x, groundY, t, isGolden, wordLen) {
  const scale = easeOutBack(t)
  const stemH = (50 + wordLen * 5) * scale
  const leafR = (10 + wordLen * 1.5) * scale

  ctx.save()
  ctx.strokeStyle = isGolden ? '#fbbf24' : '#4ade80'
  ctx.lineWidth = 2.5 * scale

  // stem
  ctx.beginPath()
  ctx.moveTo(x, groundY)
  ctx.bezierCurveTo(x + 6 * scale, groundY - stemH * 0.4, x - 6 * scale, groundY - stemH * 0.7, x, groundY - stemH)
  ctx.stroke()

  // leaves at intervals
  for (let i = 0; i < 3; i++) {
    const ly = groundY - stemH * (0.3 + i * 0.25)
    const side = i % 2 === 0 ? 1 : -1
    const leafColor = isGolden ? '#fde68a' : leafColors[i % leafColors.length]
    ctx.fillStyle = leafColor
    ctx.beginPath()
    ctx.ellipse(x + side * leafR * 0.7, ly, leafR, leafR * 0.45, side * 0.4, 0, Math.PI * 2)
    ctx.fill()
  }

  // top bud
  const bx = x, by = groundY - stemH
  ctx.fillStyle = isGolden ? '#f59e0b' : '#f9a8d4'
  ctx.beginPath()
  ctx.arc(bx, by, leafR * 0.55, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = isGolden ? '#fbbf24' : '#ec4899'
  ctx.beginPath()
  ctx.arc(bx, by - leafR * 0.2, leafR * 0.3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function drawTree(ctx, x, groundY, t, isGolden, wordLen) {
  const scale = easeOutBack(t)
  const trunkH = (40 + wordLen * 3) * scale
  const foliageR = (20 + wordLen * 2.5) * scale

  ctx.save()

  // trunk
  ctx.strokeStyle = isGolden ? '#92400e' : '#78716c'
  ctx.lineWidth = 5 * scale
  ctx.beginPath()
  ctx.moveTo(x, groundY)
  ctx.lineTo(x, groundY - trunkH)
  ctx.stroke()

  // foliage blobs
  const foliageColor = isGolden ? 'rgba(251,191,36,0.85)' : 'rgba(52,211,153,0.85)'
  const foliageColor2 = isGolden ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)'

  ctx.fillStyle = foliageColor
  ctx.beginPath()
  ctx.arc(x, groundY - trunkH - foliageR * 0.6, foliageR, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = foliageColor2
  ctx.beginPath()
  ctx.arc(x - foliageR * 0.55, groundY - trunkH - foliageR * 0.25, foliageR * 0.7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + foliageR * 0.55, groundY - trunkH - foliageR * 0.25, foliageR * 0.7, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function pastelPetal(wordLen) {
  const colors = ['#fbcfe8', '#c7d2fe', '#a5f3fc', '#bbf7d0', '#fde68a', '#fca5a5', '#d9f99d']
  return colors[wordLen % colors.length]
}

const leafColors = ['#86efac', '#6ee7b7', '#a7f3d0']

function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t)
}

// ── Day/night sky helpers ─────────────────────────────────────────────────────

function getSkyColors(phase) {
  // phase 0..1 over 120s: dawn→day→dusk→night→dawn
  // returns [topColor, bottomColor]
  if (phase < 0.15) {
    // dawn: pink-orange gradient
    const t = phase / 0.15
    return [lerpColor('#1e1b4b', '#f97316', t), lerpColor('#312e81', '#fde68a', t)]
  } else if (phase < 0.4) {
    // day: sky blue
    const t = (phase - 0.15) / 0.25
    return [lerpColor('#f97316', '#38bdf8', t), lerpColor('#fde68a', '#bae6fd', t)]
  } else if (phase < 0.5) {
    // dusk: orange to purple
    const t = (phase - 0.4) / 0.1
    return [lerpColor('#38bdf8', '#f97316', t), lerpColor('#bae6fd', '#fde68a', t)]
  } else if (phase < 0.65) {
    // dusk to night
    const t = (phase - 0.5) / 0.15
    return [lerpColor('#f97316', '#0f172a', t), lerpColor('#fde68a', '#1e1b4b', t)]
  } else if (phase < 0.85) {
    // night
    return ['#0f172a', '#1e1b4b']
  } else {
    // pre-dawn
    const t = (phase - 0.85) / 0.15
    return [lerpColor('#0f172a', '#1e1b4b', t), lerpColor('#1e1b4b', '#312e81', t)]
  }
}

function getStarAlpha(phase) {
  if (phase >= 0.5 && phase <= 0.85) return 1
  if (phase > 0.4 && phase < 0.5) return (phase - 0.4) / 0.1
  if (phase > 0.85 && phase < 1.0) return 1 - (phase - 0.85) / 0.15
  return 0
}

function lerpColor(a, b, t) {
  const ah = a.replace('#', '')
  const bh = b.replace('#', '')
  const ar = parseInt(ah.slice(0, 2), 16)
  const ag = parseInt(ah.slice(2, 4), 16)
  const ab = parseInt(ah.slice(4, 6), 16)
  const br = parseInt(bh.slice(0, 2), 16)
  const bg = parseInt(bh.slice(2, 4), 16)
  const bb = parseInt(bh.slice(4, 6), 16)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl2 = Math.round(ab + (bb - ab) * t)
  return `rgb(${r},${g},${bl2})`
}

// ── Generate stable star positions ───────────────────────────────────────────

function generateStars(count, W, H) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.65,
    r: 0.8 + Math.random() * 1.5,
    twinkle: Math.random() * Math.PI * 2,
  }))
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TypeGarden({ wordPool, difficulty, onGameOver }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const starsRef = useRef([])

  // All mutable game state lives in a single ref for RAF access
  const gs = useRef({
    seeds: [],           // floating seed packets
    plants: [],          // planted / blooming plants
    particles: [],
    currentInput: '',
    targetWord: null,    // currently targeted seed id
    streak: 0,
    peakStreak: 0,
    score: 0,
    wordsAttempted: 0,
    wordsCompleted: 0,
    charsTyped: 0,
    correctChars: 0,
    totalChars: 0,
    startTime: Date.now(),
    lastSpawnTime: 0,
    spawnInterval: 3200, // ms between new seeds
    seedIdCounter: 0,
    status: 'playing',   // 'playing' | 'paused' | 'over'
    lastWpmUpdate: 0,
    gardenSlots: [],     // { x, occupied: bool }
    seedGenCounter: 0,   // how many seeds have appeared total (for fade logic)
  })

  // React state for HUD
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [status, setStatus] = useState('playing') // 'playing' | 'paused' | 'over'

  // ── Init garden slots ──────────────────────────────────────────────────────
  const initSlots = useCallback((W) => {
    const slotCount = 10
    const margin = W * 0.06
    const spacing = (W - margin * 2) / (slotCount - 1)
    gs.current.gardenSlots = Array.from({ length: slotCount }, (_, i) => ({
      x: margin + i * spacing,
      occupied: false,
    }))
  }, [])

  // ── Spawn a seed ───────────────────────────────────────────────────────────
  const spawnSeed = useCallback((W, H) => {
    const g = gs.current
    if (g.seeds.length >= MAX_SEEDS_ON_SCREEN) return
    if (g.wordsCompleted >= MAX_PLANTS) return

    const word = randomWord(wordPool)
    const id = ++g.seedIdCounter
    const yPos = H * 0.12 + Math.random() * H * 0.45
    g.seedGenCounter++

    g.seeds.push({
      id,
      word,
      x: W + 80,
      y: yPos,
      targetY: yPos,
      bobOffset: Math.random() * Math.PI * 2,
      spawnedAtGenCount: g.seedGenCounter,
      typed: 0,
      fadeOut: false,
      fadeAlpha: 1,
    })
  }, [wordPool])

  // ── Finish game ────────────────────────────────────────────────────────────
  const finishGame = useCallback(() => {
    const g = gs.current
    if (g.status === 'over') return
    g.status = 'over'
    setStatus('over')

    const elapsed = (Date.now() - g.startTime) / 1000
    const wpmFinal = g.charsTyped > 0
      ? Math.round((g.charsTyped / 5) / Math.max(elapsed / 60, 0.01))
      : 0
    const accuracy = Math.round((g.wordsCompleted / Math.max(1, g.wordsAttempted)) * 100)

    onGameOver({
      score: g.score,
      wpm: wpmFinal,
      accuracy,
      peakCombo: g.peakStreak,
      duration: Math.round(elapsed),
      wordsCompleted: g.wordsCompleted,
    })
  }, [onGameOver])

  // ── Key handler ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    el.focus()

    const handler = (e) => {
      const g = gs.current
      if (g.status === 'over') return

      if (e.key === 'Escape') {
        if (g.status === 'playing') {
          g.status = 'paused'
          setStatus('paused')
        } else if (g.status === 'paused') {
          g.status = 'playing'
          setStatus('playing')
        }
        return
      }

      if (g.status !== 'playing') return

      if (e.key === 'Backspace') {
        if (g.currentInput.length > 0) {
          g.currentInput = g.currentInput.slice(0, -1)
          // re-find target
          if (g.currentInput.length === 0) g.targetWord = null
        }
        return
      }

      if (e.key.length !== 1) return

      const ch = e.key
      g.totalChars++
      g.charsTyped++

      // find target seed (or pick one)
      if (g.targetWord === null) {
        // pick the seed whose word starts with this char
        const match = g.seeds.find(s => !s.fadeOut && s.word[0] === ch)
        if (match) {
          g.targetWord = match.id
          g.currentInput = ch
          match.typed = 1
          g.correctChars++
        } else {
          // wrong key, bump wordsAttempted subtly (streak break only on completion)
        }
        return
      }

      // continuing a target
      const seed = g.seeds.find(s => s.id === g.targetWord)
      if (!seed) {
        g.currentInput = ''
        g.targetWord = null
        return
      }

      const expected = seed.word[g.currentInput.length]
      if (ch === expected) {
        g.correctChars++
        g.currentInput += ch
        seed.typed = g.currentInput.length

        if (g.currentInput === seed.word) {
          // WORD COMPLETED — plant it
          g.wordsCompleted++
          g.wordsAttempted++
          g.streak++
          if (g.streak > g.peakStreak) g.peakStreak = g.streak

          const isGolden = g.streak >= 10
          const wordScore = 10 * seed.word.length * Math.max(1, Math.floor(g.streak / 5))
          g.score += wordScore
          setScore(g.score)
          setStreak(g.streak)
          setWordsCompleted(g.wordsCompleted)

          // find a free garden slot
          const freeSlots = g.gardenSlots.filter(sl => !sl.occupied)
          let slotX = seed.x
          if (freeSlots.length > 0) {
            const sl = freeSlots[Math.floor(Math.random() * freeSlots.length)]
            sl.occupied = true
            slotX = sl.x
          }

          // remove seed and add plant
          g.seeds = g.seeds.filter(s => s.id !== seed.id)

          const canvas = canvasRef.current
          const H = canvas ? canvas.offsetHeight : 400
          const groundY = H * 0.76

          g.plants.push({
            id: seed.id,
            word: seed.word,
            x: slotX,
            groundY,
            bloomStart: Date.now(),
            bloomDone: false,
            isGolden,
            sparkleTimer: 0,
            particles: [],
          })

          // explosion particles
          const col = isGolden ? '#fde68a' : '#86efac'
          g.particles.push(...makeParticles(slotX, groundY - 20, col, 16))

          g.currentInput = ''
          g.targetWord = null

          if (g.wordsCompleted >= MAX_PLANTS) {
            setTimeout(() => finishGame(), 1200)
          }
        }
      } else {
        // wrong char — break streak
        if (g.streak > 0) {
          g.wordsAttempted++
          g.streak = 0
          setStreak(0)
        }
        // reset input for this seed
        g.currentInput = ''
        seed.typed = 0
        g.targetWord = null
      }
    }

    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [finishGame])

  // ── RAF game loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // setup canvas
    const setupCanvas = () => {
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      initSlots(W)
      starsRef.current = generateStars(120, W, H)
      return { ctx, W, H }
    }

    let { ctx, W, H } = setupCanvas()

    const handleResize = () => {
      ;({ ctx, W, H } = setupCanvas())
    }
    window.addEventListener('resize', handleResize)

    let lastTime = performance.now()

    const loop = (now) => {
      const g = gs.current
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      if (g.status === 'paused' || g.status === 'over') {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      // spawn seeds
      if (now - g.lastSpawnTime > g.spawnInterval && g.wordsCompleted < MAX_PLANTS) {
        spawnSeed(W, H)
        g.lastSpawnTime = now
      }

      // fade seeds that are too old (more than SEED_FADE_AFTER newer seeds have appeared)
      for (const s of g.seeds) {
        if (!s.fadeOut && (g.seedGenCounter - s.spawnedAtGenCount) >= SEED_FADE_AFTER) {
          s.fadeOut = true
        }
        if (s.fadeOut) {
          s.fadeAlpha -= dt * 1.2
        }
      }
      g.seeds = g.seeds.filter(s => s.fadeAlpha > 0)

      // move seeds leftward
      for (const s of g.seeds) {
        if (!s.fadeOut) {
          s.x -= SEED_SPEED_BASE * dt
          s.y = s.targetY + Math.sin(now * 0.001 + s.bobOffset) * 5
        }
        // if seed drifts off left edge, remove it
        if (s.x < -120) s.fadeAlpha = 0
      }

      // update particles
      g.particles = updateParticles(g.particles)

      // update WPM every 500ms
      if (now - g.lastWpmUpdate > 500) {
        g.lastWpmUpdate = now
        const secs = (Date.now() - g.startTime) / 1000
        const w = Math.round((g.charsTyped / 5) / (secs / 60))
        setWpm(isFinite(w) ? w : 0)
      }

      // ── Draw ──────────────────────────────────────────────────────────────

      // sky background (day/night cycle over 120s)
      const phase = ((Date.now() - g.startTime) / 1000 % 120) / 120
      const [skyTop, skyBot] = getSkyColors(phase)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H)
      skyGrad.addColorStop(0, skyTop)
      skyGrad.addColorStop(1, skyBot)
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, W, H)

      // stars
      const starAlpha = getStarAlpha(phase)
      if (starAlpha > 0) {
        ctx.save()
        for (const star of starsRef.current) {
          const twinkle = 0.5 + 0.5 * Math.sin(now * 0.001 * 1.3 + star.twinkle)
          ctx.globalAlpha = starAlpha * twinkle
          ctx.fillStyle = '#f0f9ff'
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      // ground
      const groundY = H * 0.76
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, H)
      groundGrad.addColorStop(0, '#4ade80')
      groundGrad.addColorStop(0.3, '#22c55e')
      groundGrad.addColorStop(1, '#15803d')
      ctx.fillStyle = groundGrad
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      // gentle wavy ground line
      for (let xi = 0; xi <= W; xi += 40) {
        const yOff = Math.sin(xi * 0.035 + now * 0.0004) * 3
        ctx.lineTo(xi, groundY + yOff)
      }
      ctx.lineTo(W, H)
      ctx.lineTo(0, H)
      ctx.closePath()
      ctx.fill()

      // garden slot markers (subtle circles)
      ctx.save()
      for (const sl of g.gardenSlots) {
        ctx.fillStyle = sl.occupied ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.12)'
        ctx.beginPath()
        ctx.arc(sl.x, groundY + 2, 7, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // draw planted/blooming plants
      const nowMs = Date.now()
      for (const plant of g.plants) {
        const elapsed2 = nowMs - plant.bloomStart
        const t = Math.min(elapsed2 / BLOOM_DURATION, 1)

        const wl = plant.word.length
        if (wl <= 4) {
          drawFlower(ctx, plant.x, plant.groundY, t, plant.isGolden, wl)
        } else if (wl <= 7) {
          drawTallPlant(ctx, plant.x, plant.groundY, t, plant.isGolden, wl)
        } else {
          drawTree(ctx, plant.x, plant.groundY, t, plant.isGolden, wl)
        }

        // sparkles for streak >= 5
        if (gs.current.streak >= 5 && t >= 1) {
          const sparkleCount = 2
          if (Math.random() < 0.15) {
            const sc = plant.isGolden ? '#fde68a' : '#a7f3d0'
            plant.particles.push(...makeParticles(
              plant.x + (Math.random() - 0.5) * 30,
              plant.groundY - 40 - Math.random() * 40,
              sc,
              sparkleCount
            ))
          }
        }
        plant.particles = updateParticles(plant.particles)
        drawParticles(ctx, plant.particles)

        // label under plant (small word text)
        if (t >= 0.5) {
          ctx.save()
          ctx.globalAlpha = Math.min((t - 0.5) * 2, 1) * 0.7
          ctx.fillStyle = plant.isGolden ? '#fde68a' : '#d1fae5'
          ctx.font = `bold ${Math.max(8, 9)}px system-ui`
          ctx.textAlign = 'center'
          ctx.fillText(plant.word, plant.x, plant.groundY + 16)
          ctx.restore()
        }
      }

      // draw floating seed packets
      for (const s of g.seeds) {
        const isTarget = gs.current.targetWord === s.id
        ctx.save()
        ctx.globalAlpha = s.fadeAlpha

        // glow
        if (isTarget) {
          ctx.shadowColor = '#2dd4bf'
          ctx.shadowBlur = 12
        } else {
          ctx.shadowColor = 'rgba(134,239,172,0.4)'
          ctx.shadowBlur = 6
        }

        const padding = 10
        ctx.font = `bold 14px system-ui`
        const textW = ctx.measureText(s.word).width
        const boxW = textW + padding * 2
        const boxH = 30

        // rounded rect
        const rx = s.x - boxW / 2
        const ry = s.y - boxH / 2
        const rad = 8

        const bgColor = isTarget ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.1)'
        const borderColor = isTarget ? '#2dd4bf' : 'rgba(167,243,208,0.5)'

        ctx.fillStyle = bgColor
        ctx.strokeStyle = borderColor
        ctx.lineWidth = isTarget ? 1.5 : 1

        ctx.beginPath()
        ctx.moveTo(rx + rad, ry)
        ctx.lineTo(rx + boxW - rad, ry)
        ctx.quadraticCurveTo(rx + boxW, ry, rx + boxW, ry + rad)
        ctx.lineTo(rx + boxW, ry + boxH - rad)
        ctx.quadraticCurveTo(rx + boxW, ry + boxH, rx + boxW - rad, ry + boxH)
        ctx.lineTo(rx + rad, ry + boxH)
        ctx.quadraticCurveTo(rx, ry + boxH, rx, ry + boxH - rad)
        ctx.lineTo(rx, ry + rad)
        ctx.quadraticCurveTo(rx, ry, rx + rad, ry)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // seed icon
        ctx.fillStyle = '#a7f3d0'
        ctx.font = '11px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('🌱', rx + 14, s.y + 4)

        // word text with per-char coloring
        const typed = s.typed || 0
        let charX = rx + 24

        ctx.shadowBlur = 0
        for (let ci = 0; ci < s.word.length; ci++) {
          const ch = s.word[ci]
          ctx.font = `bold 14px system-ui`
          const chW = ctx.measureText(ch).width

          if (ci < typed) {
            ctx.fillStyle = '#4ade80' // correct
          } else if (ci === typed && isTarget) {
            // cursor char — pulsing white
            const pulse = 0.7 + 0.3 * Math.sin(now * 0.008)
            ctx.fillStyle = `rgba(255,255,255,${pulse})`
            ctx.shadowColor = 'rgba(255,255,255,0.8)'
            ctx.shadowBlur = 6
          } else {
            ctx.fillStyle = '#94a3b8' // pending
            ctx.shadowBlur = 0
          }

          ctx.textAlign = 'left'
          ctx.fillText(ch, charX, s.y + 5)
          charX += chW
          ctx.shadowBlur = 0
        }

        ctx.restore()
      }

      // global particles
      drawParticles(ctx, g.particles)

      // streak label on canvas (bottom left)
      if (gs.current.streak >= 3) {
        ctx.save()
        const streakVal = gs.current.streak
        let glowColor = '#2dd4bf'
        if (streakVal >= 20) {
          // rainbow
          const hue = (now * 0.1) % 360
          glowColor = `hsl(${hue},100%,65%)`
        } else if (streakVal >= 10) {
          glowColor = '#fde68a'
        } else if (streakVal >= 5) {
          glowColor = '#fb923c'
        }

        ctx.font = `bold 15px system-ui`
        ctx.textAlign = 'left'
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 10
        ctx.fillStyle = glowColor
        ctx.fillText(`🔥 ${streakVal} streak`, 16, H - 20)
        ctx.restore()
      }

      // progress text bottom center
      ctx.save()
      ctx.font = '13px system-ui'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.fillText(`${g.wordsCompleted} / ${MAX_PLANTS} plants grown`, W / 2, H - 12)
      ctx.restore()

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [initSlots, spawnSeed, finishGame])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-full outline-none"
      style={{ background: '#0f172a' }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* Score HUD (top right) */}
      {status !== 'over' && (
        <div className="absolute top-3 right-3 pointer-events-none z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 text-right">
            <div className="text-xs text-teal-400/70 font-semibold tracking-widest uppercase">Score</div>
            <div className="text-2xl font-black text-white tabular-nums">{score.toLocaleString()}</div>
          </div>
          {streak >= 5 && (
            <div
              className="mt-1.5 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-amber-400/40 text-right"
              style={{ borderColor: streak >= 10 ? '#fde68a' : '#fb923c' }}
            >
              <div className="text-xs font-semibold" style={{ color: streak >= 10 ? '#fde68a' : '#fb923c' }}>
                🌟 STREAK
              </div>
              <div className="text-lg font-black tabular-nums" style={{ color: streak >= 10 ? '#fde68a' : '#fb923c' }}>
                ×{streak}
              </div>
            </div>
          )}
          <div className="mt-1.5 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/5 text-right">
            <div className="text-xs text-slate-500">WPM</div>
            <div className="text-base font-bold text-teal-300 tabular-nums">{wpm}</div>
          </div>
        </div>
      )}

      {/* Plants count (top left) */}
      {status !== 'over' && (
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div className="text-xs text-teal-400/70 font-semibold tracking-widest uppercase">Garden</div>
            <div className="text-xl font-black text-white tabular-nums">
              {wordsCompleted}
              <span className="text-slate-500 font-normal text-sm"> / {MAX_PLANTS}</span>
            </div>
          </div>
        </div>
      )}

      {/* Finish Garden button (bottom right) */}
      {status === 'playing' && (
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={finishGame}
            className="bg-teal-600/80 hover:bg-teal-500/90 backdrop-blur-sm text-white font-semibold text-sm px-4 py-2 rounded-xl border border-teal-400/40 transition-all shadow-lg"
          >
            🌸 Finish Garden
          </button>
        </div>
      )}

      {/* Pause overlay */}
      {status === 'paused' && (
        <PauseOverlay
          onResume={() => {
            gs.current.status = 'playing'
            setStatus('playing')
          }}
          onQuit={finishGame}
        />
      )}
    </div>
  )
}
