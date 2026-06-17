import { useState, useCallback } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { GAMES } from '../arcade/config'
import { PreGame, PostGame } from '../arcade/ArcadeShell'
import useProgressStore from '../store/useProgressStore'

import TypeBlaster  from '../arcade/games/TypeBlaster'
import TypeSnake    from '../arcade/games/TypeSnake'
import TypeJump     from '../arcade/games/TypeJump'
import SpellCaster  from '../arcade/games/SpellCaster'
import TypeBeat     from '../arcade/games/TypeBeat'
import TypeGarden   from '../arcade/games/TypeGarden'

const GAME_MAP = { typeblaster: TypeBlaster, typesnake: TypeSnake, typejump: TypeJump, spellcaster: SpellCaster, typebeat: TypeBeat, typegarden: TypeGarden }

export default function ArcadeGamePage() {
  const { id }          = useParams()
  const navigate        = useNavigate()
  const recordArcadeGame = useProgressStore(s => s.recordArcadeGame)
  const getArcadeBest    = useProgressStore(s => s.getArcadeBest)

  const game = GAMES.find(g => g.id === id)
  if (!game) return <Navigate to="/arcade" replace />

  const GameComponent = GAME_MAP[id]
  if (!GameComponent) return <Navigate to="/arcade" replace />

  const [phase,   setPhase]   = useState('pre')   // 'pre' | 'playing' | 'post'
  const [config,  setConfig]  = useState(null)
  const [stats,   setStats]   = useState(null)
  const [isNewBest, setNewBest] = useState(false)
  // key forces full remount on replay
  const [playKey, setPlayKey] = useState(0)

  const handleStart = useCallback((cfg) => {
    setConfig(cfg)
    setPhase('playing')
  }, [])

  const handleGameOver = useCallback((gameStats) => {
    const { isNewBest: nb } = recordArcadeGame(id, gameStats)
    setStats(gameStats)
    setNewBest(nb)
    setPhase('post')
  }, [id, recordArcadeGame])

  const handleReplay = useCallback(() => {
    setPlayKey(k => k + 1)
    setPhase('playing')
  }, [])

  const handleQuit = useCallback(() => {
    navigate('/arcade')
  }, [navigate])

  if (phase === 'pre') {
    return <PreGame game={game} onStart={handleStart} />
  }

  if (phase === 'post') {
    return <PostGame game={game} stats={stats} isNewBest={isNewBest} onReplay={handleReplay} onQuit={handleQuit} />
  }

  return (
    <div className="h-full w-full relative">
      <GameComponent
        key={playKey}
        wordPool={config.wordPool}
        difficulty={config.difficulty}
        onGameOver={handleGameOver}
      />
    </div>
  )
}
