import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { getBestMove } from './chessAI'
import './App.css'

const DIFFICULTY_DEPTH = { easy: 1, medium: 2, hard: 3 }

export default function App({ onBack }) {
  const [game, setGame] = useState(new Chess())
  const [moveHistory, setMoveHistory] = useState([])
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [squareStyles, setSquareStyles] = useState({})
  const [lastMove, setLastMove] = useState(null)
  const [status, setStatus] = useState('')
  const [aiThinking, setAiThinking] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')

  function getStatus(chess) {
    if (chess.isCheckmate()) return `Checkmate! ${chess.turn() === 'w' ? 'Black' : 'White'} wins!`
    if (chess.isStalemate()) return 'Draw by stalemate'
    if (chess.isThreefoldRepetition()) return 'Draw by repetition'
    if (chess.isInsufficientMaterial()) return 'Draw — insufficient material'
    if (chess.isDraw()) return 'Draw by 50-move rule'
    if (chess.isCheck()) return `${chess.turn() === 'w' ? 'White' : 'Black'} is in check!`
    return `${chess.turn() === 'w' ? 'White' : 'Black'} to move`
  }

  // Trigger AI move whenever it becomes black's turn
  useEffect(() => {
    if (game.turn() !== 'b' || game.isGameOver()) return

    setAiThinking(true)
    const fen = game.fen()

    const timer = setTimeout(() => {
      try {
        const bestMove = getBestMove(fen, DIFFICULTY_DEPTH[difficulty])
        if (bestMove) {
          const next = new Chess(fen)
          const result = next.move(bestMove)
          if (result) {
            setLastMove({ from: result.from, to: result.to })
            setGame(next)
            setMoveHistory((prev) => [...prev, result.san])
            setStatus(getStatus(next))
          }
        }
      } catch (e) {
        console.error('AI error:', e)
      }
      setAiThinking(false)
    }, 80)

    return () => clearTimeout(timer)
  }, [game])

  function getMoveOptions(square) {
    const moves = game.moves({ square, verbose: true })
    if (!moves.length) return {}
    const styles = {}
    moves.forEach((move) => {
      const isCapture = game.get(move.to) && game.get(move.to).color !== game.get(square)?.color
      styles[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.15) 25%, transparent 25%)',
        borderRadius: '50%',
      }
    })
    styles[square] = { background: 'rgba(255, 255, 0, 0.4)' }
    return styles
  }

  function makeHumanMove(from, to) {
    if (game.turn() !== 'w' || game.isGameOver() || aiThinking) return false
    const next = new Chess(game.fen())
    const result = next.move({ from, to, promotion: 'q' })
    if (!result) return false
    setLastMove({ from: result.from, to: result.to })
    setGame(next)
    setMoveHistory((prev) => [...prev, result.san])
    setStatus(getStatus(next))
    return true
  }

  function handleSquareClick({ square }) {
    if (game.turn() !== 'w' || game.isGameOver() || aiThinking) return

    if (selectedSquare) {
      const moved = makeHumanMove(selectedSquare, square)
      setSelectedSquare(null)
      setSquareStyles(buildSquareStyles(null, lastMove))
      if (moved) return
    }

    const piece = game.get(square)
    if (piece && piece.color === 'w') {
      setSelectedSquare(square)
      setSquareStyles({ ...buildSquareStyles(null, lastMove), ...getMoveOptions(square) })
    } else {
      setSelectedSquare(null)
      setSquareStyles(buildSquareStyles(null, lastMove))
    }
  }

  function handlePieceDrop({ sourceSquare, targetSquare }) {
    if (!targetSquare) return false
    const moved = makeHumanMove(sourceSquare, targetSquare)
    setSelectedSquare(null)
    setSquareStyles(buildSquareStyles(null, lastMove))
    return moved
  }

  function buildSquareStyles(selected, lm) {
    const styles = {}
    if (lm) {
      styles[lm.from] = { background: 'rgba(255, 206, 68, 0.3)' }
      styles[lm.to] = { background: 'rgba(255, 206, 68, 0.3)' }
    }
    if (selected) {
      Object.assign(styles, getMoveOptions(selected))
    }
    return styles
  }

  function resetGame() {
    setGame(new Chess())
    setMoveHistory([])
    setSelectedSquare(null)
    setSquareStyles({})
    setLastMove(null)
    setStatus('')
    setAiThinking(false)
  }

  function undoMove() {
    if (moveHistory.length < 2) return
    const next = new Chess(game.fen())
    next.undo()
    next.undo()
    setGame(next)
    setMoveHistory((prev) => prev.slice(0, -2))
    setLastMove(null)
    setSquareStyles({})
    setSelectedSquare(null)
    setStatus(getStatus(next))
  }

  // Keep squareStyles in sync when lastMove updates after AI move
  useEffect(() => {
    setSquareStyles(buildSquareStyles(selectedSquare, lastMove))
  }, [lastMove])

  const isOver = game.isGameOver()
  const movePairs = []
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({ white: moveHistory[i], black: moveHistory[i + 1] })
  }

  return (
    <div className="app">
      <div className="title-row">
        {onBack && (
          <button className="btn back-btn" onClick={onBack}>← MENU</button>
        )}
        <h1 className="title">Chess Craft</h1>
        <div className="difficulty-selector">
          {['easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              className={`btn difficulty-btn${difficulty === d ? ' active' : ''}`}
              onClick={() => setDifficulty(d)}
              disabled={aiThinking}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="players">
        <div className={`player ${game.turn() === 'b' && !isOver ? 'active' : ''}`}>
          <span className="piece-icon">♟</span> Black — AI
          {aiThinking && <span className="thinking-dot"> thinking…</span>}
        </div>
        <div className={`player ${game.turn() === 'w' && !isOver ? 'active' : ''}`}>
          <span className="piece-icon">♙</span> White — You
        </div>
      </div>
      <div className="layout">
        <div className="board-wrap">
          <div style={{ width: 520 }}>
            <Chessboard
              options={{
                position: game.fen(),
                onPieceDrop: handlePieceDrop,
                onSquareClick: handleSquareClick,
                squareStyles,
                boardStyle: {
                  borderRadius: '6px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                },
                darkSquareStyle: { backgroundColor: '#769656' },
                lightSquareStyle: { backgroundColor: '#eeeed2' },
                animationDurationInMs: 150,
                allowDragging: !isOver && !aiThinking,
                canDragPiece: ({ piece: { pieceType } }) => pieceType.startsWith('w'),
              }}
            />
          </div>
          <div className={`status-bar ${isOver ? 'gameover' : ''}`}>
            {aiThinking ? 'AI is thinking…' : (status || 'Your move — White to start')}
          </div>
          <div className="controls">
            <button onClick={undoMove} disabled={moveHistory.length < 2 || aiThinking} className="btn">
              ← Undo
            </button>
            <button onClick={resetGame} className="btn btn-primary">
              New Game
            </button>
          </div>
        </div>

        <div className="sidebar">
          <h2>Move History</h2>
          <div className="move-list">
            {movePairs.length === 0 && <p className="no-moves">Make your first move!</p>}
            {movePairs.map((pair, i) => (
              <div className="move-row" key={i}>
                <span className="move-num">{i + 1}.</span>
                <span className="move">{pair.white}</span>
                <span className="move muted">{pair.black ?? ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
