import { useEffect, useRef, useState, useCallback } from 'react'
import { GameHUD, PauseOverlay } from '../ArcadeShell'
import { DIFFICULTY, makeParticles, updateParticles, drawParticles, randomWord } from '../config'

const MAX_TIME = 120
const GROUND_RATIO = 0.75
const CHAR_X = 120
const OBSTACLE_START_X_RATIO = 1.05
const JUMP_DURATION = 600
const SPAWN_DELAY = 2000

// ── Fox drawing helpers ───────────────────────────────────────────────────────

function drawFox(ctx, x, y, frame, isJumping, jumpProgress) {
  ctx.save()
  ctx.translate(x, y)

  const bodyW = 36
  const bodyH = 22
  const legLen = 14

  // Body shadow
  ctx.globalAlpha = 0.25
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.ellipse(0, bodyH / 2 + legLen + 2, bodyW * 0.6, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // Tail
  const tailSwing = isJumping ? 0.3 : Math.sin(frame * 0.18) * 0.25
  ctx.save()
  ctx.translate(-bodyW * 0.55, 0)
  ctx.rotate(tailSwing - 0.3)
  const tailGrad = ctx.createLinearGradient(0, 0, -18, -18)
  tailGrad.addColorStop(0, '#fb923c')
  tailGrad.addColorStop(1, '#fef3c7')
  ctx.fillStyle = tailGrad
  ctx.beginPath()
  ctx.ellipse(-9, -9, 10, 5, -0.7, 0, Math.PI * 2)
  ctx.fill()
  // tail tip
  ctx.fillStyle = '#fef3c7'
  ctx.beginPath()
  ctx.arc(-17, -16, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Body
  const bodyGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, bodyW * 0.7)
  bodyGrad.addColorStop(0, '#fb923c')
  bodyGrad.addColorStop(1, '#c2410c')
  ctx.fillStyle = bodyGrad
  ctx.beginPath()
  ctx.ellipse(0, 0, bodyW * 0.5, bodyH * 0.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Belly
  ctx.fillStyle = '#fed7aa'
  ctx.beginPath()
  ctx.ellipse(4, 2, bodyW * 0.28, bodyH * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()

  // Head
  ctx.fillStyle = '#fb923c'
  ctx.beginPath()
  ctx.ellipse(bodyW * 0.45, -bodyH * 0.2, 13, 11, 0.15, 0, Math.PI * 2)
  ctx.fill()

  // Snout
  ctx.fillStyle = '#fed7aa'
  ctx.beginPath()
  ctx.ellipse(bodyW * 0.45 + 10, -bodyH * 0.1, 6, 4, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Nose
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.arc(bodyW * 0.45 + 15, -bodyH * 0.15, 2, 0, Math.PI * 2)
  ctx.fill()

  // Eye
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.arc(bodyW * 0.45 + 5, -bodyH * 0.35, 2.5, 0, Math.PI * 2)
  ctx.fill()
  // eye shine
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(bodyW * 0.45 + 6, -bodyH * 0.37, 1, 0, Math.PI * 2)
  ctx.fill()

  // Ears
  ctx.fillStyle = '#c2410c'
  ctx.beginPath()
  ctx.moveTo(bodyW * 0.3, -bodyH * 0.35)
  ctx.lineTo(bodyW * 0.22, -bodyH * 0.75)
  ctx.lineTo(bodyW * 0.48, -bodyH * 0.5)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(bodyW * 0.5, -bodyH * 0.4)
  ctx.lineTo(bodyW * 0.5, -bodyH * 0.8)
  ctx.lineTo(bodyW * 0.65, -bodyH * 0.5)
  ctx.closePath()
  ctx.fill()
  // inner ears
  ctx.fillStyle = '#fca5a5'
  ctx.beginPath()
  ctx.moveTo(bodyW * 0.32, -bodyH * 0.38)
  ctx.lineTo(bodyW * 0.28, -bodyH * 0.65)
  ctx.lineTo(bodyW * 0.44, -bodyH * 0.5)
  ctx.closePath()
  ctx.fill()

  // Legs
  if (!isJumping) {
    const legPhase1 = Math.sin(frame * 0.22)
    const legPhase2 = Math.sin(frame * 0.22 + Math.PI)
    // Front legs
    ctx.strokeStyle = '#c2410c'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(bodyW * 0.25, bodyH * 0.35)
    ctx.lineTo(bodyW * 0.25 + legPhase1 * 5, bodyH * 0.35 + legLen)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(bodyW * 0.1, bodyH * 0.35)
    ctx.lineTo(bodyW * 0.1 + legPhase2 * 5, bodyH * 0.35 + legLen)
    ctx.stroke()
    // Back legs
    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.25, bodyH * 0.35)
    ctx.lineTo(-bodyW * 0.25 + legPhase2 * 5, bodyH * 0.35 + legLen)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.1, bodyH * 0.35)
    ctx.lineTo(-bodyW * 0.1 + legPhase1 * 5, bodyH * 0.35 + legLen)
    ctx.stroke()
    // Paws
    ctx.fillStyle = '#92400e'
    const pawPositions = [
      [bodyW * 0.25 + legPhase1 * 5, bodyH * 0.35 + legLen],
      [bodyW * 0.1 + legPhase2 * 5, bodyH * 0.35 + legLen],
      [-bodyW * 0.25 + legPhase2 * 5, bodyH * 0.35 + legLen],
      [-bodyW * 0.1 + legPhase1 * 5, bodyH * 0.35 + legLen],
    ]
    for (const [px, py] of pawPositions) {
      ctx.beginPath()
      ctx.ellipse(px, py, 5, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    // jumping pose — legs tucked
    ctx.strokeStyle = '#c2410c'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    const tuck = Math.sin(jumpProgress * Math.PI) * 8
    ctx.beginPath()
    ctx.moveTo(bodyW * 0.25, bodyH * 0.35)
    ctx.lineTo(bodyW * 0.3, bodyH * 0.35 + legLen * 0.5 - tuck)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(bodyW * 0.1, bodyH * 0.35)
    ctx.lineTo(bodyW * 0.15, bodyH * 0.35 + legLen * 0.5 - tuck)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.25, bodyH * 0.35)
    ctx.lineTo(-bodyW * 0.3, bodyH * 0.35 + legLen * 0.5 - tuck)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.1, bodyH * 0.35)
    ctx.lineTo(-bodyW * 0.15, bodyH * 0.35 + legLen * 0.5 - tuck)
    ctx.stroke()
  }

  ctx.restore()
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TypeJump({ wordPool, difficulty, onGameOver }) {
  const preset = DIFFICULTY[difficulty]
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const gameState = useRef(null)

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(preset.lives)
  const [combo, setCombo] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [status, setStatus] = useState('playing') // 'playing' | 'paused' | 'over'

  const pausedRef = useRef(false)
  const statusRef = useRef('playing')

  // ── Init game state ─────────────────────────────────────────────────────────

  function createObstacle(W, word) {
    return {
      word,
      x: W * OBSTACLE_START_X_RATIO,
      w: Math.max(80, word.length * 14 + 24),
      h: 42,
      typed: '',
      failed: false,
    }
  }

  function initState(W, H) {
    const groundY = H * GROUND_RATIO
    const word = randomWord(wordPool)
    return {
      W, H,
      groundY,
      charY: groundY,
      isJumping: false,
      jumpStart: 0,
      jumpProgress: 0,
      frame: 0,
      obstacle: createObstacle(W, word),
      nextSpawnAt: null,
      particles: [],
      trailParticles: [],
      coinParticles: [],
      stars: Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.65,
        r: Math.random() * 1.8 + 0.3,
        alpha: 0.3 + Math.random() * 0.7,
        twinkle: Math.random() * Math.PI * 2,
      })),
      bgLayers: {
        far: 0,
        mid: 0,
        near: 0,
      },
      lives: preset.lives,
      score: 0,
      combo: 0,
      peakCombo: 0,
      charsTyped: 0,
      correctChars: 0,
      totalChars: 0,
      wordsCompleted: 0,
      startTime: Date.now(),
      lastWpmCalc: Date.now(),
      shakeFrames: 0,
      shakeIntensity: 0,
      rainbowHue: 0,
    }
  }

  // ── Canvas setup & RAF loop ─────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    function setupCanvas() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      return { ctx, W, H }
    }

    let { ctx, W, H } = setupCanvas()
    gameState.current = initState(W, H)

    function handleResize() {
      const result = setupCanvas()
      ctx = result.ctx
      W = result.W
      H = result.H
      if (gameState.current) {
        gameState.current.W = W
        gameState.current.H = H
        gameState.current.groundY = H * GROUND_RATIO
        if (!gameState.current.isJumping) {
          gameState.current.charY = gameState.current.groundY
        }
      }
    }

    window.addEventListener('resize', handleResize)

    // ── Background drawing ────────────────────────────────────────────────────

    function drawBackground(gs) {
      const { W, H, stars, bgLayers } = gs
      const groundY = H * GROUND_RATIO

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY)
      skyGrad.addColorStop(0, '#0a0e1a')
      skyGrad.addColorStop(0.5, '#0d1b2e')
      skyGrad.addColorStop(1, '#0f2540')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, W, groundY)

      // Stars
      const now = Date.now()
      for (const s of stars) {
        s.twinkle += 0.02
        const alpha = s.alpha * (0.7 + 0.3 * Math.sin(s.twinkle))
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#e2e8f0'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Moon
      ctx.fillStyle = '#fef9c3'
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.arc(W * 0.85, H * 0.1, 22, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#0d1b2e'
      ctx.beginPath()
      ctx.arc(W * 0.87, H * 0.09, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Far layer: mountains (0.2x scroll)
      const farOff = (bgLayers.far % (W * 0.5))
      ctx.fillStyle = '#1e3a5f'
      for (let i = -1; i < 4; i++) {
        const bx = i * W * 0.5 - farOff
        ctx.beginPath()
        ctx.moveTo(bx, groundY)
        ctx.lineTo(bx + W * 0.07, groundY - H * 0.22)
        ctx.lineTo(bx + W * 0.14, groundY - H * 0.1)
        ctx.lineTo(bx + W * 0.2, groundY - H * 0.3)
        ctx.lineTo(bx + W * 0.28, groundY - H * 0.15)
        ctx.lineTo(bx + W * 0.35, groundY - H * 0.25)
        ctx.lineTo(bx + W * 0.43, groundY - H * 0.08)
        ctx.lineTo(bx + W * 0.5, groundY)
        ctx.closePath()
        ctx.fill()
      }

      // Snow caps
      ctx.fillStyle = '#93c5fd'
      ctx.globalAlpha = 0.4
      for (let i = -1; i < 4; i++) {
        const bx = i * W * 0.5 - farOff
        ctx.beginPath()
        ctx.moveTo(bx + W * 0.2, groundY - H * 0.3)
        ctx.lineTo(bx + W * 0.18, groundY - H * 0.22)
        ctx.lineTo(bx + W * 0.22, groundY - H * 0.22)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(bx + W * 0.07, groundY - H * 0.22)
        ctx.lineTo(bx + W * 0.055, groundY - H * 0.17)
        ctx.lineTo(bx + W * 0.085, groundY - H * 0.17)
        ctx.closePath()
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Mid layer: city buildings (0.5x scroll)
      const midOff = (bgLayers.mid % (W * 0.7))
      const buildingColors = ['#0f2f4a', '#0a2540', '#122d48', '#0d2035']
      const windowColor = '#38bdf8'
      for (let i = -1; i < 4; i++) {
        const bx = i * W * 0.7 - midOff
        const buildings = [
          { x: 0, w: 35, h: 90 },
          { x: 40, w: 28, h: 70 },
          { x: 72, w: 42, h: 110 },
          { x: 118, w: 30, h: 85 },
          { x: 152, w: 38, h: 60 },
          { x: 194, w: 32, h: 95 },
          { x: 230, w: 46, h: 130 },
          { x: 280, w: 28, h: 75 },
          { x: 312, w: 36, h: 88 },
          { x: 352, w: 40, h: 100 },
          { x: 396, w: 30, h: 65 },
          { x: 430, w: 44, h: 115 },
          { x: 478, w: 34, h: 80 },
        ]
        for (let bi = 0; bi < buildings.length; bi++) {
          const b = buildings[bi]
          const bCol = buildingColors[bi % buildingColors.length]
          ctx.fillStyle = bCol
          ctx.fillRect(bx + b.x, groundY - b.h, b.w, b.h)
          // neon outline
          ctx.strokeStyle = '#0ea5e9'
          ctx.globalAlpha = 0.2
          ctx.lineWidth = 1
          ctx.strokeRect(bx + b.x, groundY - b.h, b.w, b.h)
          ctx.globalAlpha = 1
          // windows
          ctx.fillStyle = windowColor
          for (let wy = groundY - b.h + 8; wy < groundY - 8; wy += 14) {
            for (let wx = bx + b.x + 5; wx < bx + b.x + b.w - 5; wx += 10) {
              if (Math.sin(wx * 0.7 + wy * 0.3) > 0.1) {
                ctx.globalAlpha = 0.15 + Math.random() * 0.1
                ctx.fillRect(wx, wy, 5, 6)
              }
            }
          }
          ctx.globalAlpha = 1
        }
      }

      // Near layer: ground strip (1x scroll)
      const nearGrad = ctx.createLinearGradient(0, groundY, 0, H)
      nearGrad.addColorStop(0, '#0f3460')
      nearGrad.addColorStop(0.15, '#0a2040')
      nearGrad.addColorStop(1, '#050d1a')
      ctx.fillStyle = nearGrad
      ctx.fillRect(0, groundY, W, H - groundY)

      // Ground line with glow
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(W, groundY)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Ground detail: lane markings
      const nearOff = bgLayers.near % 120
      ctx.strokeStyle = '#1e4d7a'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.4
      for (let lx = -nearOff; lx < W; lx += 120) {
        ctx.beginPath()
        ctx.moveTo(lx, groundY + 15)
        ctx.lineTo(lx + 60, groundY + 15)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Neon ground reflections
      const glowGrad = ctx.createLinearGradient(0, groundY, 0, groundY + 30)
      glowGrad.addColorStop(0, 'rgba(56,189,248,0.12)')
      glowGrad.addColorStop(1, 'rgba(56,189,248,0)')
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, groundY, W, 30)
    }

    // ── Obstacle drawing ──────────────────────────────────────────────────────

    function drawObstacle(gs) {
      const { obstacle, groundY } = gs
      if (!obstacle) return
      const { x, w, h, word, typed } = obstacle
      const oy = groundY - h

      // Glow
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 18
      // Block body
      const obsGrad = ctx.createLinearGradient(x, oy, x, groundY)
      obsGrad.addColorStop(0, '#0e4966')
      obsGrad.addColorStop(1, '#071a26')
      ctx.fillStyle = obsGrad
      ctx.beginPath()
      ctx.roundRect(x - w / 2, oy, w, h, 6)
      ctx.fill()

      // Border
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(x - w / 2, oy, w, h, 6)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Top stripe accent
      ctx.fillStyle = '#38bdf8'
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.roundRect(x - w / 2, oy, w, 4, [6, 6, 0, 0])
      ctx.fill()
      ctx.globalAlpha = 1

      // Word label ABOVE the block
      ctx.font = 'bold 18px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'

      const wordY = oy - 10
      const charSpacing = ctx.measureText('M').width * 1.1

      const totalWidth = (word.length - 1) * charSpacing
      let startX = x - totalWidth / 2

      for (let i = 0; i < word.length; i++) {
        const ch = word[i]
        const cx = startX + i * charSpacing

        if (i < typed.length) {
          if (typed[i] === ch) {
            // correct
            ctx.fillStyle = '#4ade80'
            ctx.shadowColor = '#4ade80'
            ctx.shadowBlur = 6
          } else {
            // incorrect
            ctx.fillStyle = '#f87171'
            ctx.shadowColor = '#f87171'
            ctx.shadowBlur = 6
          }
        } else if (i === typed.length) {
          // current cursor char — pulsing white
          const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.008)
          ctx.fillStyle = `rgba(255,255,255,${pulse})`
          ctx.shadowColor = '#ffffff'
          ctx.shadowBlur = 12 * pulse
        } else {
          // pending
          ctx.fillStyle = '#94a3b8'
          ctx.shadowBlur = 0
        }

        ctx.fillText(ch, cx, wordY)
        ctx.shadowBlur = 0
      }
      ctx.textBaseline = 'alphabetic'
    }

    // ── Coins along jump arc ──────────────────────────────────────────────────

    function drawJumpCoins(gs) {
      if (!gs.isJumping) return
      const { jumpProgress, groundY, H } = gs
      const peakY = H * 0.35
      const numCoins = 5
      for (let i = 0; i < numCoins; i++) {
        const t = (i + 1) / (numCoins + 1)
        const coinY = groundY + (peakY - groundY) * 4 * t * (1 - t)
        const coinX = CHAR_X + (t - jumpProgress) * 180
        if (t > jumpProgress) {
          const alpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.01 + i)
          ctx.globalAlpha = alpha
          ctx.fillStyle = '#fbbf24'
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 1.5
          ctx.shadowColor = '#fbbf24'
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(coinX, coinY, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.shadowBlur = 0
          // coin shine
          ctx.fillStyle = '#fef3c7'
          ctx.globalAlpha = 0.7 * alpha
          ctx.beginPath()
          ctx.arc(coinX - 2, coinY - 2, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }
      ctx.globalAlpha = 1
    }

    // ── Main RAF loop ─────────────────────────────────────────────────────────

    let lastTs = null

    function loop(ts) {
      if (!lastTs) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts

      if (pausedRef.current || statusRef.current !== 'playing') {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const gs = gameState.current
      const { W, H } = gs
      const groundY = H * GROUND_RATIO
      gs.groundY = groundY

      // Time check
      const now = Date.now()
      const elapsedSecs = (now - gs.startTime) / 1000
      if (elapsedSecs >= MAX_TIME) {
        endGame()
        return
      }

      gs.frame++

      // Scroll bg layers
      const speedBase = 200 * preset.speedMult
      gs.bgLayers.far += speedBase * 0.2 * dt
      gs.bgLayers.mid += speedBase * 0.5 * dt
      gs.bgLayers.near += speedBase * dt

      // Update obstacle position
      if (gs.obstacle) {
        gs.obstacle.x -= speedBase * dt
        // obstacle passed character without word completion
        if (gs.obstacle.x < CHAR_X - 60 && !gs.obstacle.failed) {
          gs.obstacle.failed = true
          gs.lives -= 1
          gs.combo = 0
          gs.shakeFrames = 18
          gs.shakeIntensity = 10
          setLives(gs.lives)
          setCombo(0)
          // particles on hit
          const hitParticles = makeParticles(CHAR_X, groundY - 20, '#f87171', 16)
          gs.particles = gs.particles.concat(hitParticles)
          if (gs.lives <= 0) {
            endGame()
            return
          }
        }
        // obstacle fully off-screen: schedule next
        if (gs.obstacle.x < -100) {
          gs.obstacle = null
          gs.nextSpawnAt = now + SPAWN_DELAY
        }
      }

      // Spawn new obstacle
      if (!gs.obstacle && gs.nextSpawnAt && now >= gs.nextSpawnAt) {
        const word = randomWord(wordPool)
        gs.obstacle = createObstacle(W, word)
        gs.nextSpawnAt = null
      }

      // Jump physics
      if (gs.isJumping) {
        const jumpElapsed = now - gs.jumpStart
        const t = Math.min(jumpElapsed / JUMP_DURATION, 1)
        gs.jumpProgress = t
        const peakY = H * 0.35
        // parabolic: y = groundY + (peakY - groundY) * 4t(1-t)
        gs.charY = groundY + (peakY - groundY) * 4 * t * (1 - t)

        // trail particles
        if (gs.frame % 3 === 0) {
          const trail = makeParticles(CHAR_X - 20, gs.charY, '#38bdf8', 3)
          for (const p of trail) {
            p.vx = -2 - Math.random() * 2
            p.vy = (Math.random() - 0.5) * 2
          }
          gs.trailParticles = gs.trailParticles.concat(trail)
        }

        if (t >= 1) {
          gs.isJumping = false
          gs.charY = groundY
          gs.jumpProgress = 0
          // schedule next obstacle
          if (!gs.obstacle) {
            gs.nextSpawnAt = gs.nextSpawnAt || (now + SPAWN_DELAY)
          }
        }
      }

      // Update particles
      gs.particles = updateParticles(gs.particles)
      gs.trailParticles = updateParticles(gs.trailParticles)

      // Shake
      if (gs.shakeFrames > 0) gs.shakeFrames--
      gs.rainbowHue = (gs.rainbowHue + 3) % 360

      // WPM calculation every 500ms
      if (now - gs.lastWpmCalc > 500) {
        const secs = (now - gs.startTime) / 1000
        const wpmVal = Math.round((gs.charsTyped / 5) / (secs / 60))
        setWpm(isFinite(wpmVal) ? wpmVal : 0)
        gs.lastWpmCalc = now
      }

      setElapsed(Math.floor(elapsedSecs))
      setScore(gs.score)

      // ── Draw ──────────────────────────────────────────────────────────────

      ctx.clearRect(0, 0, W, H)

      // Screen shake
      if (gs.shakeFrames > 0) {
        const intensity = gs.shakeIntensity * (gs.shakeFrames / 18)
        ctx.save()
        ctx.translate(
          (Math.random() - 0.5) * intensity,
          (Math.random() - 0.5) * intensity
        )
      }

      drawBackground(gs)

      // Trail particles (drawn before character)
      drawParticles(ctx, gs.trailParticles)

      // Jump arc coins
      drawJumpCoins(gs)

      // Obstacle
      drawObstacle(gs)

      // Explosion particles
      drawParticles(ctx, gs.particles)

      // Character
      const foxCenterX = CHAR_X
      const foxCenterY = gs.charY
      drawFox(ctx, foxCenterX, foxCenterY, gs.frame, gs.isJumping, gs.jumpProgress)

      // Combo glow effect on character
      if (gs.combo >= 5) {
        let glowColor
        if (gs.combo >= 20) {
          glowColor = `hsl(${gs.rainbowHue}, 100%, 60%)`
        } else if (gs.combo >= 10) {
          glowColor = '#fbbf24'
        } else {
          glowColor = '#fb923c'
        }
        ctx.globalAlpha = 0.35
        ctx.fillStyle = glowColor
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 30
        ctx.beginPath()
        ctx.arc(foxCenterX, foxCenterY - 10, 35, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      if (gs.shakeFrames > 0) {
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── End game ────────────────────────────────────────────────────────────────

  function endGame() {
    statusRef.current = 'over'
    setStatus('over')
    cancelAnimationFrame(rafRef.current)
    const gs = gameState.current
    const duration = Math.round((Date.now() - gs.startTime) / 1000)
    const secs = duration || 1
    const finalWpm = Math.round((gs.charsTyped / 5) / (secs / 60))
    const accuracy = Math.round((gs.correctChars / Math.max(1, gs.totalChars)) * 100)
    onGameOver({
      score: gs.score,
      wpm: isFinite(finalWpm) ? finalWpm : 0,
      accuracy,
      peakCombo: gs.peakCombo,
      duration,
      wordsCompleted: gs.wordsCompleted,
    })
  }

  // ── Keyboard input ──────────────────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.focus()

    const handler = (e) => {
      // ESC = pause/resume
      if (e.key === 'Escape') {
        e.preventDefault()
        if (statusRef.current !== 'playing') return
        const next = !pausedRef.current
        pausedRef.current = next
        setPaused(next)
        return
      }

      if (pausedRef.current || statusRef.current !== 'playing') return

      const gs = gameState.current
      if (!gs || !gs.obstacle) return

      const ch = e.key
      if (ch.length !== 1) return
      e.preventDefault()

      const obs = gs.obstacle
      const idx = obs.typed.length
      const expected = obs.word[idx]

      gs.totalChars++

      if (ch === expected) {
        obs.typed += ch
        gs.charsTyped++
        gs.correctChars++

        // Word complete
        if (obs.typed === obs.word) {
          // score
          const pts = 10 + obs.word.length * 3 + gs.combo * 2
          gs.score += pts
          gs.combo++
          gs.wordsCompleted++
          if (gs.combo > gs.peakCombo) gs.peakCombo = gs.combo
          setCombo(gs.combo)

          // particles
          const pColor = gs.combo >= 20 ? `hsl(${gs.rainbowHue},100%,60%)` : gs.combo >= 10 ? '#fbbf24' : '#22d3ee'
          const explosionP = makeParticles(obs.x, gs.groundY - obs.h / 2, pColor, 20)
          const extraP = makeParticles(obs.x, gs.groundY - obs.h / 2, '#38bdf8', 10)
          gs.particles = gs.particles.concat(explosionP, extraP)

          // destroy obstacle + jump
          gs.obstacle = null
          gs.isJumping = true
          gs.jumpStart = Date.now()
          gs.jumpProgress = 0
        }
      } else {
        // wrong key
        obs.typed = ''
        gs.combo = 0
        gs.shakeFrames = 8
        gs.shakeIntensity = 5
        setCombo(0)
        const wrongP = makeParticles(CHAR_X, gs.groundY - 20, '#f87171', 6)
        gs.particles = gs.particles.concat(wrongP)
      }
    }

    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [])

  const handleResume = useCallback(() => {
    pausedRef.current = false
    setPaused(false)
  }, [])

  const handleQuit = useCallback(() => {
    endGame()
  }, [])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-full outline-none"
      style={{ background: '#050d1a' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* HUD overlay */}
      <GameHUD
        score={score}
        lives={lives}
        combo={combo}
        wpm={wpm}
        elapsed={elapsed}
        maxLives={preset.lives}
      />

      {/* Pause overlay */}
      {paused && (
        <PauseOverlay onResume={handleResume} onQuit={handleQuit} />
      )}
    </div>
  )
}
