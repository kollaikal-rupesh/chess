import './Landing.css'

const FEATURES = [
  {
    icon: '♟',
    title: 'AI OPPONENT',
    desc: 'Challenge a smart AI with depth-3 minimax search and alpha-beta pruning',
  },
  {
    icon: '🤖',
    title: 'ZERO LINES OF CODE',
    desc: "World's first chess app built entirely by AI — not a single line typed by a human hand",
  },
  {
    icon: '⚔️',
    title: 'FULL CHESS RULES',
    desc: 'Castling, en passant, check, checkmate, draws — every rule is here',
  },
  {
    icon: '📜',
    title: 'MOVE HISTORY',
    desc: 'Every move tracked in standard algebraic notation with undo support',
  },
]

const PIECES = ['♔', '♕', '♖', '♗', '♘', '♙']

const TERRAIN_COUNT = 30

export default function Landing({ onStart }) {
  return (
    <div className="mc-world">
      {/* ── SKY / HERO ── */}
      <section className="mc-sky">
        <div className="mc-sun" />
        <div className="mc-clouds">
          <div className="mc-cloud" style={{ left: '8%', top: '50px' }} />
          <div className="mc-cloud" style={{ left: '38%', top: '30px', animationDelay: '-8s' }} />
          <div className="mc-cloud" style={{ left: '68%', top: '60px', animationDelay: '-16s' }} />
        </div>

        <div className="mc-hero">
          <div className="mc-title-panel">
            <h1 className="mc-title">CHESS<br />CRAFT</h1>
            <div className="mc-tagline">MINE YOUR STRATEGY</div>
          </div>

          <div className="mc-badge">
            ⚡ WORLD'S FIRST CHESS APP BUILT WITHOUT A SINGLE LINE OF HUMAN CODE ⚡
          </div>

          <div className="mc-piece-parade">
            {PIECES.map((p, i) => (
              <span
                key={i}
                className="mc-piece"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                {p}
              </span>
            ))}
          </div>

          <button className="mc-btn" onClick={onStart}>
            ▶&nbsp; PLAY NOW
          </button>

          <p className="mc-free-label">FREE TO PLAY · NO DOWNLOAD · NO SIGN-UP</p>
        </div>
      </section>

      {/* ── TERRAIN SEPARATOR ── */}
      <div className="mc-terrain" aria-hidden="true">
        {Array.from({ length: TERRAIN_COUNT }).map((_, i) => (
          <div key={i} className="mc-col">
            <div className="mc-grass" />
            <div className="mc-dirt" />
            <div className="mc-dirt dark" />
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="mc-section dark-bg">
        <h2 className="mc-section-title">[ GAME FEATURES ]</h2>
        <div className="mc-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="mc-card">
              <div className="mc-card-icon">{f.icon}</div>
              <div className="mc-card-title">{f.title}</div>
              <div className="mc-card-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="mc-section mid-bg">
        <h2 className="mc-section-title">[ THE STORY ]</h2>
        <div className="mc-story-panel">
          <p>In a world where every line of code was written by human hands...</p>
          <p>One team dared to do the impossible.</p>
          <p>No IDE. No keyboard. No human code.</p>
          <p className="mc-story-highlight">Just pure AI. Just pure chess.</p>
        </div>

        <div className="mc-craft-wrap">
          <div>
            <div className="mc-craft-label">CRAFTING RECIPE</div>
            <div className="mc-craft-grid">
              {['🤖', '💡', '⚡', '♟', '✨', '♟', '🏆', '💎', '🎮'].map((item, i) => (
                <div key={i} className={`mc-craft-slot${i === 4 ? ' center' : ''}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mc-craft-arrow">→</div>

          <div className="mc-craft-result">
            <div className="mc-craft-slot large">♞</div>
            <div className="mc-craft-result-label">CHESS CRAFT</div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mc-section black-bg mc-cta">
        <h2 className="mc-cta-title">READY TO PLAY?</h2>
        <button className="mc-btn green" onClick={onStart}>
          ▶&nbsp; START GAME
        </button>
        <p className="mc-footer">
          Crafted by Claude AI&nbsp;·&nbsp;Zero Lines of Human Code&nbsp;·&nbsp;100% Chess
        </p>
      </section>
    </div>
  )
}
