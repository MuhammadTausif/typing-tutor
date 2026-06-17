import { useEffect, useRef, useState, useCallback } from 'react'
import { PauseOverlay } from '../ArcadeShell'
import { DIFFICULTY, makeParticles, updateParticles, drawParticles, randomWord } from '../config'

// Monster definitions per wave
function getMonsterForWave(wave) {
  if (wave === 1) return { color: '#22c55e', glowColor: '#4ade80', type: 'slime', baseHp: 6 }
  if (wave === 2) return { color: '#ef4444', glowColor: '#f87171', type: 'goblin', baseHp: 7 }
  return { color: '#7c3aed', glowColor: '#a78bfa', type: 'boss', baseHp: 8 + (wave - 3) }
}

function drawWizard(ctx, x, y, t) {
  // Glow aura
  const grd = ctx.createRadialGradient(x, y, 5, x, y, 55)
  grd.addColorStop(0, 'rgba(167,139,250,0.18)')
  grd.addColorStop(1, 'rgba(167,139,250,0)')
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(x, y, 55, 0, Math.PI * 2)
  ctx.fill()

  // Robe body (ellipse)
  ctx.save()
  ctx.fillStyle = '#3b0764'
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(x, y + 18, 22, 34, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // Head
  ctx.save()
  ctx.fillStyle = '#fde68a'
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x, y - 22, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // Hat (triangle)
  ctx.save()
  ctx.fillStyle = '#4c1d95'
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x, y - 52 + Math.sin(t * 1.5) * 2)
  ctx.lineTo(x - 16, y - 32)
  ctx.lineTo(x + 16, y - 32)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // Wand (arm extended right)
  ctx.save()
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x + 18, y + 5)
  ctx.lineTo(x + 42, y - 12 + Math.sin(t * 2) * 4)
  ctx.stroke()
  // Wand tip glow
  const wx = x + 42
  const wy = y - 12 + Math.sin(t * 2) * 4
  const wg = ctx.createRadialGradient(wx, wy, 1, wx, wy, 8)
  wg.addColorStop(0, '#fff')
  wg.addColorStop(0.4, '#c4b5fd')
  wg.addColorStop(1, 'rgba(167,139,250,0)')
  ctx.fillStyle = wg
  ctx.beginPath()
  ctx.arc(wx, wy, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawSlime(ctx, x, y, t, hp, maxHp) {
  const wobble = Math.sin(t * 3) * 4
  const squash = 1 + Math.sin(t * 3) * 0.08

  ctx.save()
  const grd = ctx.createRadialGradient(x, y, 5, x, y, 60)
  grd.addColorStop(0, 'rgba(34,197,94,0.15)')
  grd.addColorStop(1, 'rgba(34,197,94,0)')
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(x, y, 60, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#15803d'
  ctx.strokeStyle = '#4ade80'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.ellipse(x, y + wobble, 32 * squash, 28 / squash, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Eyes
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(x - 9, y - 4 + wobble, 6, 0, Math.PI * 2)
  ctx.arc(x + 9, y - 4 + wobble, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#052e16'
  ctx.beginPath()
  ctx.arc(x - 8, y - 4 + wobble, 3, 0, Math.PI * 2)
  ctx.arc(x + 10, y - 4 + wobble, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawGoblin(ctx, x, y, t, hp, maxHp) {
  const bob = Math.sin(t * 2) * 3

  ctx.save()
  const grd = ctx.createRadialGradient(x, y, 5, x, y, 60)
  grd.addColorStop(0, 'rgba(239,68,68,0.15)')
  grd.addColorStop(1, 'rgba(239,68,68,0)')
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(x, y, 60, 0, Math.PI * 2)
  ctx.fill()

  // Body (angular)
  ctx.fillStyle = '#7f1d1d'
  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y - 30 + bob)
  ctx.lineTo(x + 24, y + 14 + bob)
  ctx.lineTo(x + 18, y + 30 + bob)
  ctx.lineTo(x - 18, y + 30 + bob)
  ctx.lineTo(x - 24, y + 14 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Head
  ctx.fillStyle = '#dc2626'
  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x, y - 38 + bob, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Eyes (menacing)
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(x - 6, y - 40 + bob, 4, 0, Math.PI * 2)
  ctx.arc(x + 6, y - 40 + bob, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(x - 5, y - 40 + bob, 2, 0, Math.PI * 2)
  ctx.arc(x + 7, y - 40 + bob, 2, 0, Math.PI * 2)
  ctx.fill()

  // Horns
  ctx.fillStyle = '#450a0a'
  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x - 10, y - 50 + bob)
  ctx.lineTo(x - 16, y - 62 + bob)
  ctx.lineTo(x - 4, y - 50 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + 10, y - 50 + bob)
  ctx.lineTo(x + 16, y - 62 + bob)
  ctx.lineTo(x + 4, y - 50 + bob)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function drawBoss(ctx, x, y, t, hp, maxHp) {
  const pulse = Math.sin(t * 2) * 0.12 + 1
  const spin = t * 0.8

  ctx.save()
  // Dark aura
  const grd = ctx.createRadialGradient(x, y, 10, x, y, 80)
  grd.addColorStop(0, 'rgba(124,58,237,0.3)')
  grd.addColorStop(1, 'rgba(124,58,237,0)')
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(x, y, 80, 0, Math.PI * 2)
  ctx.fill()

  // Spiky body
  const spikes = 8
  const innerR = 22 * pulse
  const outerR = 38 * pulse
  ctx.fillStyle = '#1e0038'
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes + spin
    const r = i % 2 === 0 ? outerR : innerR
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Core
  ctx.fillStyle = '#7c3aed'
  ctx.beginPath()
  ctx.arc(x, y, 16 * pulse, 0, Math.PI * 2)
  ctx.fill()

  // Eyes (glowing)
  ctx.fillStyle = '#f5f3ff'
  ctx.shadowColor = '#a78bfa'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(x - 7, y - 4, 5, 0, Math.PI * 2)
  ctx.arc(x + 7, y - 4, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#1e0038'
  ctx.beginPath()
  ctx.arc(x - 6, y - 4, 2.5, 0, Math.PI * 2)
  ctx.arc(x + 8, y - 4, 2.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawMonster(ctx, x, y, t, wave, hp, maxHp) {
  if (wave === 1) drawSlime(ctx, x, y, t, hp, maxHp)
  else if (wave === 2) drawGoblin(ctx, x, y, t, hp, maxHp)
  else drawBoss(ctx, x, y, t, hp, maxHp)
}

export default function SpellCaster({ wordPool, difficulty, onGameOver }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const gameState = useRef(null)

  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [paused, setPaused] = useState(false)
  const [status, setStatus] = useState('playing') // 'playing' | 'paused' | 'over'
  const pausedRef = useRef(false)
  const statusRef = useRef('playing')

  // Initialize game state
  function initState() {
    const diff = DIFFICULTY[difficulty]
    const monsterDef = getMonsterForWave(1)
    return {
      // Player
      wizardHp: diff.lives,
      wizardMaxHp: diff.lives,
      // Monster
      wave: 1,
      monsterHp: monsterDef.baseHp,
      monsterMaxHp: monsterDef.baseHp,
      monsterCharge: 0,        // 0..1
      chargeSpeed: 0.00025 * diff.speedMult,
      monsterType: monsterDef.type,
      monsterColor: monsterDef.color,
      monsterGlowColor: monsterDef.glowColor,
      // Typing
      currentWord: randomWord(wordPool),
      typedIndex: 0,
      hasError: false,
      // Projectile
      projectile: null,        // { x, y, targetX, targetY, speed, trail }
      // Stats
      score: 0,
      combo: 0,
      peakCombo: 0,
      charsTyped: 0,
      correctChars: 0,
      totalChars: 0,
      wordsCompleted: 0,
      startTime: Date.now(),
      lastWpmUpdate: Date.now(),
      // Effects
      particles: [],
      shake: 0,
      critFlash: 0,            // alpha for purple flash
      monsterFlash: 0,         // flash when hit
      wizardFlash: 0,          // flash when hit
      stars: Array.from({ length: 80 }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.7 + 0.3,
      })),
      time: 0,
      diff,
    }
  }

  const endGame = useCallback(() => {
    if (statusRef.current === 'over') return
    statusRef.current = 'over'
    setStatus('over')
    const gs = gameState.current
    if (!gs) return
    const elapsed = (Date.now() - gs.startTime) / 1000
    const wpmFinal = Math.round((gs.charsTyped / 5) / Math.max(0.01, elapsed / 60))
    const accuracy = Math.round((gs.correctChars / Math.max(1, gs.totalChars)) * 100)
    onGameOver({
      score: gs.score,
      wpm: isFinite(wpmFinal) ? wpmFinal : 0,
      accuracy,
      peakCombo: gs.peakCombo,
      duration: Math.round(elapsed),
      wordsCompleted: gs.wordsCompleted,
    })
  }, [onGameOver])

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    gameState.current = initState()
    statusRef.current = 'playing'
    pausedRef.current = false

    function resize() {
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()

    function loop(now) {
      rafRef.current = requestAnimationFrame(loop)
      if (pausedRef.current) return
      if (statusRef.current === 'over') return

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const gs = gameState.current
      gs.time += dt

      const canvas2 = canvasRef.current
      if (!canvas2) return
      const ctx = canvas2.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      const W = canvas2.offsetWidth
      const H = canvas2.offsetHeight

      // ── Update game logic ──────────────────────────────────────
      // Monster charge
      gs.monsterCharge += gs.chargeSpeed * (1 + gs.time * 0.002)
      if (gs.monsterCharge >= 1) {
        gs.monsterCharge = 0
        gs.wizardHp = Math.max(0, gs.wizardHp - 1)
        gs.wizardFlash = 0.7
        gs.shake = 12
        gs.combo = 0
        setCombo(0)
        if (gs.wizardHp <= 0) {
          endGame()
          return
        }
      }

      // Projectile update
      if (gs.projectile) {
        const p = gs.projectile
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const speed = 350 * dt
        if (dist < speed + 10) {
          // Impact
          const isCrit = p.isCrit
          gs.monsterHp -= isCrit ? 2 : 1
          gs.monsterFlash = isCrit ? 0.9 : 0.5
          if (isCrit) gs.critFlash = 0.5
          gs.particles.push(...makeParticles(p.targetX, p.targetY, gs.monsterGlowColor, 20))
          gs.particles.push(...makeParticles(p.targetX, p.targetY, '#fff', 8))
          gs.projectile = null

          if (gs.monsterHp <= 0) {
            // Wave cleared
            const pts = (10 + gs.currentWord.length * 2) * Math.max(1, Math.floor(gs.combo / 5))
            gs.score += pts + 50
            setScore(gs.score)
            gs.particles.push(...makeParticles(p.targetX, p.targetY, gs.monsterGlowColor, 40))
            // Next wave
            gs.wave += 1
            const monsterDef = getMonsterForWave(gs.wave)
            gs.monsterHp = monsterDef.baseHp + Math.floor((gs.wave - 1) * 0.5)
            gs.monsterMaxHp = gs.monsterHp
            gs.monsterType = monsterDef.type
            gs.monsterColor = monsterDef.color
            gs.monsterGlowColor = monsterDef.glowColor
            gs.chargeSpeed = gs.diff.chargeSpeed || 0.00025 * gs.diff.speedMult * (1 + gs.wave * 0.08)
            gs.monsterCharge = 0
          }
        } else {
          const nx = p.x + (dx / dist) * speed
          const ny = p.y + (dy / dist) * speed
          p.trail.push({ x: p.x, y: p.y, life: 1 })
          p.x = nx
          p.y = ny
        }
        // Update trail
        if (gs.projectile) {
          gs.projectile.trail = gs.projectile.trail
            .map(t => ({ ...t, life: t.life - dt * 4 }))
            .filter(t => t.life > 0)
        }
      }

      // Particles
      gs.particles = updateParticles(gs.particles)

      // Decay effects
      gs.shake *= 0.85
      gs.critFlash = Math.max(0, gs.critFlash - dt * 2)
      gs.monsterFlash = Math.max(0, gs.monsterFlash - dt * 3)
      gs.wizardFlash = Math.max(0, gs.wizardFlash - dt * 3)

      // WPM update
      if (Date.now() - gs.lastWpmUpdate > 500) {
        gs.lastWpmUpdate = Date.now()
        const secs = (Date.now() - gs.startTime) / 1000
        const w = Math.round((gs.charsTyped / 5) / (secs / 60))
        setWpm(isFinite(w) ? w : 0)
      }

      // ── Draw ───────────────────────────────────────────────────
      ctx.save()
      // Screen shake
      const shakeX = gs.shake > 0.5 ? (Math.random() - 0.5) * gs.shake : 0
      const shakeY = gs.shake > 0.5 ? (Math.random() - 0.5) * gs.shake : 0
      ctx.translate(shakeX, shakeY)

      // Background
      ctx.fillStyle = '#120820'
      ctx.fillRect(0, 0, W, H)

      // Stone texture grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'
      ctx.lineWidth = 1
      const tileW = 48, tileH = 48
      for (let tx = 0; tx < W; tx += tileW) {
        for (let ty = 0; ty < H; ty += tileH) {
          ctx.strokeRect(tx + 2, ty + 2, tileW - 4, tileH - 4)
        }
      }

      // Stars / ambient particles
      for (const s of gs.stars) {
        s.x -= s.speed * dt * 30
        if (s.x < 0) s.x = W + s.r
        ctx.globalAlpha = s.alpha * 0.6
        ctx.fillStyle = '#e2d9f3'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Ground line
      const groundY = H * 0.75
      ctx.strokeStyle = 'rgba(124,58,237,0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(W, groundY)
      ctx.stroke()

      // HP bars - top left (wizard), top right (monster)
      const barH = 18
      const barW = Math.min(220, W * 0.3)
      const barY = 24

      // Wizard HP
      ctx.fillStyle = '#1e0038'
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(20, barY, barW, barH, 5)
      ctx.fill()
      ctx.stroke()
      const wizFill = (gs.wizardHp / gs.wizardMaxHp) * barW
      const wizGrd = ctx.createLinearGradient(20, barY, 20 + wizFill, barY)
      wizGrd.addColorStop(0, '#7c3aed')
      wizGrd.addColorStop(1, '#c4b5fd')
      ctx.fillStyle = wizGrd
      ctx.beginPath()
      ctx.roundRect(20, barY, Math.max(0, wizFill), barH, 5)
      ctx.fill()
      ctx.fillStyle = '#e2d9f3'
      ctx.font = 'bold 11px monospace'
      ctx.fillText(`🧙 ${gs.wizardHp}/${gs.wizardMaxHp}`, 26, barY + 13)

      // Wizard flash overlay
      if (gs.wizardFlash > 0) {
        ctx.fillStyle = `rgba(239,68,68,${gs.wizardFlash * 0.3})`
        ctx.fillRect(0, 0, W * 0.45, H)
      }

      // Monster HP
      ctx.fillStyle = '#1e0038'
      ctx.strokeStyle = gs.monsterGlowColor
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(W - 20 - barW, barY, barW, barH, 5)
      ctx.fill()
      ctx.stroke()
      const monFill = (gs.monsterHp / gs.monsterMaxHp) * barW
      const monGrd = ctx.createLinearGradient(W - 20 - barW, barY, W - 20 - barW + monFill, barY)
      monGrd.addColorStop(0, gs.monsterColor)
      monGrd.addColorStop(1, gs.monsterGlowColor)
      ctx.fillStyle = monGrd
      ctx.beginPath()
      ctx.roundRect(W - 20 - barW, barY, Math.max(0, monFill), barH, 5)
      ctx.fill()
      ctx.fillStyle = '#e2d9f3'
      ctx.font = 'bold 11px monospace'
      const monLabel = `${gs.monsterHp}/${gs.monsterMaxHp} ⚔`
      const monLabelW = ctx.measureText(monLabel).width
      ctx.fillText(monLabel, W - 20 - barW + barW - monLabelW - 4, barY + 13)

      // Monster charge bar
      const chargeY = barY + barH + 5
      const chargeW = barW
      ctx.fillStyle = '#1a0010'
      ctx.strokeStyle = 'rgba(239,68,68,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(W - 20 - chargeW, chargeY, chargeW, 8, 4)
      ctx.fill()
      ctx.stroke()
      const chargeFillW = gs.monsterCharge * chargeW
      if (chargeFillW > 0) {
        const cgrd = ctx.createLinearGradient(W - 20 - chargeW, 0, W - 20 - chargeW + chargeFillW, 0)
        cgrd.addColorStop(0, '#dc2626')
        cgrd.addColorStop(1, '#fca5a5')
        ctx.fillStyle = cgrd
        ctx.beginPath()
        ctx.roundRect(W - 20 - chargeW, chargeY, chargeFillW, 8, 4)
        ctx.fill()
      }
      ctx.fillStyle = 'rgba(255,150,150,0.6)'
      ctx.font = '9px monospace'
      ctx.fillText('CHARGE', W - 20 - chargeW + 4, chargeY + 7)

      // Wizard
      const wizX = W * 0.22
      const wizY = groundY - 40
      drawWizard(ctx, wizX, wizY, gs.time)

      // Monster
      const monX = W * 0.75
      const monY = groundY - 50
      drawMonster(ctx, monX, monY, gs.time, gs.wave, gs.monsterHp, gs.monsterMaxHp)

      // Monster flash
      if (gs.monsterFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${gs.monsterFlash * 0.4})`
        ctx.beginPath()
        ctx.arc(monX, monY, 60, 0, Math.PI * 2)
        ctx.fill()
      }

      // Projectile + trail
      if (gs.projectile) {
        const p = gs.projectile
        // Trail
        for (const tr of p.trail) {
          ctx.globalAlpha = tr.life * 0.5
          ctx.fillStyle = p.isCrit ? '#fbbf24' : '#a78bfa'
          ctx.beginPath()
          ctx.arc(tr.x, tr.y, 5 * tr.life, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        // Orb
        const orbGrd = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 14)
        orbGrd.addColorStop(0, '#fff')
        orbGrd.addColorStop(0.3, p.isCrit ? '#fbbf24' : '#c4b5fd')
        orbGrd.addColorStop(1, 'rgba(124,58,237,0)')
        ctx.fillStyle = orbGrd
        ctx.beginPath()
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
        ctx.fill()
        // Orb core
        ctx.fillStyle = p.isCrit ? '#fef3c7' : '#fff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Particles
      drawParticles(ctx, gs.particles)

      // Critical flash
      if (gs.critFlash > 0) {
        ctx.fillStyle = `rgba(167,139,250,${gs.critFlash})`
        ctx.fillRect(0, 0, W, H)
      }

      // ── Spell word box ─────────────────────────────────────────
      const word = gs.currentWord
      const boxW = Math.max(300, word.length * 30 + 60)
      const boxH = 72
      const boxX = W / 2 - boxW / 2
      const boxY = H - boxH - 24

      // Box background
      ctx.fillStyle = 'rgba(18,8,32,0.92)'
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 2
      ctx.shadowColor = '#a78bfa'
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxW, boxH, 12)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      // Corner glow dots
      ;[[boxX + 8, boxY + 8], [boxX + boxW - 8, boxY + 8],
        [boxX + 8, boxY + boxH - 8], [boxX + boxW - 8, boxY + boxH - 8]].forEach(([cx, cy]) => {
        ctx.fillStyle = '#a78bfa'
        ctx.beginPath()
        ctx.arc(cx, cy, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Word label
      ctx.font = 'bold 11px monospace'
      ctx.fillStyle = '#9f7aea'
      ctx.textAlign = 'center'
      ctx.fillText('SPELL', W / 2, boxY + 16)

      // Characters
      const charSize = Math.min(32, Math.max(18, 28 - Math.max(0, word.length - 6) * 1.5))
      ctx.font = `bold ${charSize}px monospace`
      const totalTextW = ctx.measureText(word).width
      let cx2 = W / 2 - totalTextW / 2

      for (let i = 0; i < word.length; i++) {
        const ch = word[i]
        const chW = ctx.measureText(ch).width

        if (i < gs.typedIndex) {
          // Correct
          ctx.fillStyle = '#4ade80'
          ctx.shadowColor = '#4ade80'
          ctx.shadowBlur = 6
          ctx.fillText(ch, cx2 + chW / 2, boxY + boxH - 20)
          ctx.shadowBlur = 0
        } else if (i === gs.typedIndex) {
          // Current cursor
          const pulse = 0.7 + 0.3 * Math.sin(gs.time * 6)
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = `rgba(167,139,250,${pulse})`
          ctx.shadowBlur = 14 * pulse
          ctx.fillText(ch, cx2 + chW / 2, boxY + boxH - 20)
          ctx.shadowBlur = 0
          // Underline cursor
          ctx.strokeStyle = `rgba(167,139,250,${pulse})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(cx2, boxY + boxH - 15)
          ctx.lineTo(cx2 + chW, boxY + boxH - 15)
          ctx.stroke()
        } else {
          // Pending
          ctx.fillStyle = '#94a3b8'
          ctx.fillText(ch, cx2 + chW / 2, boxY + boxH - 20)
        }

        cx2 += chW
      }

      // Error indicator
      if (gs.hasError) {
        ctx.fillStyle = 'rgba(248,113,113,0.15)'
        ctx.strokeStyle = '#f87171'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxW, boxH, 12)
        ctx.fill()
        ctx.stroke()
      }

      ctx.textAlign = 'left'
      ctx.restore()
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, []) // eslint-disable-line

  // Key handler
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.focus()

    const handler = (e) => {
      if (e.key === 'Escape') {
        if (statusRef.current === 'over') return
        pausedRef.current = !pausedRef.current
        setPaused(pausedRef.current)
        setStatus(pausedRef.current ? 'paused' : 'playing')
        statusRef.current = pausedRef.current ? 'paused' : 'playing'
        return
      }

      if (pausedRef.current || statusRef.current !== 'playing') return

      const gs = gameState.current
      if (!gs) return

      // Single printable char
      if (e.key.length !== 1) return
      const ch = e.key

      const word = gs.currentWord
      const expected = word[gs.typedIndex]

      gs.totalChars++

      if (ch === expected) {
        gs.typedIndex++
        gs.correctChars++
        gs.charsTyped++

        if (gs.typedIndex === word.length) {
          // Word completed
          gs.wordsCompleted++
          gs.combo++
          if (gs.combo > gs.peakCombo) gs.peakCombo = gs.combo
          setCombo(gs.combo)

          const pts = (10 + word.length * 2) * Math.max(1, Math.floor(gs.combo / 5))
          gs.score += pts
          setScore(gs.score)

          // Fire projectile
          const canvas = canvasRef.current
          const W = canvas ? canvas.offsetWidth : 800
          const H = canvas ? canvas.offsetHeight : 600
          const wizX = W * 0.22
          const wizY = H * 0.75 - 40
          const monX = W * 0.75
          const monY = H * 0.75 - 50
          const isCrit = gs.combo >= 5
          gs.projectile = {
            x: wizX + 42,
            y: wizY - 12,
            targetX: monX,
            targetY: monY,
            isCrit,
            trail: [],
          }

          if (isCrit) {
            gs.critFlash = 0.3
          }

          // Particle burst at wand tip
          gs.particles.push(...makeParticles(wizX + 42, wizY - 12, '#a78bfa', 12))

          // Next word
          let nextWord
          do {
            nextWord = randomWord(wordPool)
          } while (nextWord === gs.currentWord && wordPool.length > 1)
          gs.currentWord = nextWord
          gs.typedIndex = 0
          gs.hasError = false
        }
      } else {
        // Mistype
        gs.hasError = true
        gs.combo = 0
        setCombo(0)
        // Speed up monster charge slightly
        gs.monsterCharge = Math.min(1, gs.monsterCharge + 0.04)
        gs.shake = 5
      }
    }

    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [wordPool])

  const handleResume = () => {
    pausedRef.current = false
    setPaused(false)
    setStatus('playing')
    statusRef.current = 'playing'
  }

  const handleQuit = () => {
    endGame()
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-full outline-none"
      style={{ background: '#120820' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: 'block' }}
      />

      {/* Score overlay top-left */}
      <div className="absolute top-14 left-4 pointer-events-none z-10">
        <div style={{
          background: 'rgba(18,8,32,0.85)',
          border: '1px solid rgba(167,139,250,0.35)',
          borderRadius: 8,
          padding: '6px 12px',
        }}>
          <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700, letterSpacing: 1 }}>SCORE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#e2d9f3', fontFamily: 'monospace' }}>
            {score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* WPM overlay top-left below score */}
      <div className="absolute top-14 right-4 pointer-events-none z-10">
        <div style={{
          background: 'rgba(18,8,32,0.85)',
          border: '1px solid rgba(167,139,250,0.35)',
          borderRadius: 8,
          padding: '6px 12px',
          textAlign: 'right',
        }}>
          <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700, letterSpacing: 1 }}>WPM</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa', fontFamily: 'monospace' }}>
            {wpm}
          </div>
        </div>
      </div>

      {/* Combo counter */}
      {combo >= 3 && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: '50%',
            top: '52%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <div style={{
            background: 'rgba(18,8,32,0.9)',
            border: `2px solid ${combo >= 20 ? '#fbbf24' : combo >= 10 ? '#f97316' : '#a78bfa'}`,
            borderRadius: 12,
            padding: '8px 20px',
            boxShadow: `0 0 24px ${combo >= 20 ? 'rgba(251,191,36,0.5)' : combo >= 10 ? 'rgba(249,115,22,0.5)' : 'rgba(167,139,250,0.5)'}`,
            animation: 'pop 0.15s ease-out',
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: combo >= 20 ? '#fbbf24' : combo >= 10 ? '#f97316' : '#a78bfa',
            }}>
              {combo >= 20 ? 'LEGENDARY' : combo >= 10 ? 'BLAZING' : 'COMBO'}
            </div>
            <div style={{
              fontSize: 30,
              fontWeight: 900,
              fontFamily: 'monospace',
              color: combo >= 20 ? '#fef3c7' : combo >= 10 ? '#fed7aa' : '#e2d9f3',
              lineHeight: 1.1,
            }}>
              x{combo}
            </div>
            {combo >= 5 && (
              <div style={{
                fontSize: 10,
                color: combo >= 20 ? '#fbbf24' : '#f97316',
                fontWeight: 700,
                letterSpacing: 1,
              }}>
                CRITICAL HIT!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {paused && (
        <PauseOverlay onResume={handleResume} onQuit={handleQuit} />
      )}
    </div>
  )
}
