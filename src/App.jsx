import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DECK, newRoomCode, store, useRoom } from './useRoom.js'

const label = (v) => (v === 0.5 ? '½' : String(v))
const roomFromHash = () => location.hash.replace('#', '').trim().toLowerCase()

export default function App() {
  const [session, setSession] = useState(() => {
    const saved = store.get('session')
    const hash = roomFromHash()
    if (saved && (!hash || saved.room === hash)) {
      if (!hash) history.replaceState(null, '', '#' + saved.room)
      return saved
    }
    return null
  })

  const join = (s) => {
    store.set('session', s)
    history.replaceState(null, '', '#' + s.room)
    setSession(s)
  }
  const leave = () => {
    store.set('session', null)
    history.replaceState(null, '', location.pathname)
    setSession(null)
  }

  return session ? <Room key={session.room} {...session} onLeave={leave} /> : <Join onJoin={join} />
}

function Join({ onJoin }) {
  const linkRoom = roomFromHash()
  const [name, setName] = useState(() => store.get('name') || '')
  const [isHost, setIsHost] = useState(false)
  const [code, setCode] = useState(linkRoom)

  const submit = (e) => {
    e.preventDefault()
    const n = name.trim()
    const room = isHost ? newRoomCode() : code.trim().toLowerCase().replace('#', '')
    if (!n || !room) return
    store.set('name', n)
    onJoin({ name: n, isHost, room })
  }

  return (
    <main className="join">
      <div className="join-stack">
      {/* The table before the first hand: one deck fanned face-up above the join card, one face-down below it. */}
      <Fan dir="up" />
      <Fan dir="down" />
      <Note className="note-name" arrow="right">no sign-up, just your name</Note>
      <Note className="note-host" arrow="left">running grooming? flip this</Note>
      <form className="join-card" onSubmit={submit}>
        <span className="index" aria-hidden="true">P</span>
        <span className="index br" aria-hidden="true">P</span>
        <h1>Poolthok</h1>
        <p className="lede">Planning poker for sprint grooming.</p>

        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} autoFocus required autoComplete="nickname" />
        </label>

        <label className="switch">
          <input type="checkbox" role="switch" checked={isHost} onChange={(e) => setIsHost(e.target.checked)} />
          <span className="track" aria-hidden="true" />
          <span>I'm the facilitator</span>
        </label>

        {!isHost && !linkRoom && (
          <label className="field">
            <span>Room code</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="From the facilitator's link" required autoComplete="off" spellCheck="false" />
          </label>
        )}

        <button className="btn primary" type="submit">
          {isHost ? 'Create room' : linkRoom ? `Join room ${linkRoom}` : 'Join room'}
        </button>
      </form>
      </div>
    </main>
  )
}

function Room({ room, name, isHost, onLeave }) {
  const { me, status, players, revealed, vote, reveal, hide, next, setFacilitator } = useRoom({ room, name, isHost })
  const [copied, setCopied] = useState(false)
  const [hideHand, setHide] = useState(() => !!store.get('hideHand'))
  const setHideHand = (on) => { store.set('hideHand', on); setHide(on) }
  const [floatWin, toggleFloat] = useFloatingWindow()
  const mine = players.find((p) => p.id === me)
  const canRun = isHost || !!mine?.fac
  const present = players.filter((p) => p.online || p.voted)
  const votedCount = present.filter((p) => p.voted).length
  const waiting = present.filter((p) => !p.voted)

  const values = players.map((p) => p.vote).filter((v) => v != null)
  const avg = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null
  const consensus = revealed && values.length > 1 && values.every((v) => v === values[0])
  // The most-picked value leads the reveal; a tie of up to three values shows them all.
  const tally = {}
  for (const v of values) tally[v] = (tally[v] || 0) + 1
  const top = Math.max(0, ...Object.values(tally))
  const leaders = DECK.filter((v) => tally[v] === top)
  const lead = leaders.length && leaders.length <= 3 ? leaders.map(label).join(' · ') : '–'
  const leadLabel = !values.length ? 'No votes' : leaders.length === 1 ? 'Majority' : leaders.length <= 3 ? 'Split' : 'No majority'

  const copy = async () => {
    try { await navigator.clipboard.writeText(location.href) } catch { return }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  // Only the creator's browser holds the room, so leaving ends it for everyone.
  const leaveLabel = isHost ? 'End room' : 'Leave room'
  const leave = () => {
    if (!isHost || confirm('End the room for everyone? Their votes will be lost.')) onLeave()
  }

  let line
  if (revealed) line = null
  else if (!present.length) line = isHost ? 'Setting the table…' : 'The facilitator opens the table. Hang tight.'
  else if (!waiting.length) line = canRun ? 'Everyone has a card down. Reveal when ready.' : 'Everyone has a card down. Waiting for the reveal.'
  else line = `Waiting on ${waiting.map((p) => (p.id === me ? 'you' : p.name)).join(', ')}`

  const count = (
    <span className="count" aria-live="polite">
      <b>{votedCount}</b> / {present.length} voted
    </span>
  )

  // The table itself, shared by the tab and the floating window (mini drops the role toggles).
  const table = (mini) => (
    <>
      {status !== 'online' && (
        <div className="banner" role="status">
          {status !== 'notfound' && <span className="pulse" aria-hidden="true" />}
          {status === 'notfound' ? (
            <>
              No room #{room} is open. Check the code with your facilitator.
              <button className="btn ghost" onClick={onLeave}>Change room</button>
            </>
          ) : status === 'connecting' ? (
            isHost ? 'Opening the room…' : 'Looking for the facilitator…'
          ) : isHost ? 'Reconnecting…' : 'Reconnecting to the facilitator…'}
        </div>
      )}

      <main className={'table' + (consensus ? ' is-consensus' : '')}>
        <div className="status" aria-live="polite">
          {revealed ? (
            <div className="result">
              <span className="majority">{lead}{lead !== '–' && !consensus && <Circled />}</span>
              {consensus && <Burst />}
              {consensus ? (
                <span className="consensus">Consensus</span>
              ) : (
                <>
                  <span className="result-label">{leadLabel}</span>
                  {avg != null && <span className="avg">Average <b>{avg}</b></span>}
                </>
              )}
            </div>
          ) : (
            <p>{line}</p>
          )}
        </div>

        <ul className="seats">
          {players.map((p, i) => (
            <li key={p.id} className={'seat' + (p.online ? '' : ' offline') + (p.id === me ? ' me' : '')}>
              <SeatCard player={p} revealed={revealed} index={i} />
              <span className="seat-name">
                <span className="nm">{p.name}</span>
                {p.id === me && <em>&nbsp;(you)</em>}
              </span>
              {canRun && !mini && !p.host && p.id !== me ? (
                <button
                  className="seat-role role-btn"
                  aria-pressed={p.fac}
                  title={p.fac ? 'Remove facilitator role' : 'Make facilitator'}
                  onClick={() => setFacilitator(p.id, !p.fac)}
                >
                  {p.fac ? 'Facilitator' : 'Make facilitator'}
                </button>
              ) : (
                <span className="seat-role">{[p.fac && 'Facilitator', !p.online && 'Offline'].filter(Boolean).join(' · ')}</span>
              )}
            </li>
          ))}
        </ul>

        {canRun && (
          <div className="controls">
            {revealed ? (
              <>
                <button className="btn ghost" onClick={hide} title="Turn the cards back over. Votes are kept.">
                  <IconHide />
                  <span>Hide cards</span>
                </button>
                <button className="btn primary" onClick={next}>Next round</button>
              </>
            ) : (
              <button className="btn primary" onClick={reveal} disabled={!votedCount}>Reveal cards</button>
            )}
          </div>
        )}
      </main>

      <footer className={'hand' + (hideHand ? ' is-hidden' : '')} aria-label="Your cards">
        {DECK.map((v, i) => {
          const picked = mine?.vote === v
          return (
            <button
              key={v + (hideHand ? 'b' : 'f')}
              className={'card hand-card' + (hideHand ? ' back' : ' face') + (picked && !hideHand ? ' picked' : '')}
              style={{ '--i': i - (DECK.length - 1) / 2, '--a': Math.abs(i - (DECK.length - 1) / 2), '--n': i }}
              aria-pressed={picked && !hideHand}
              aria-label={hideHand ? 'Hidden card' : `${v} points`}
              disabled={revealed || status !== 'online' || hideHand}
              onClick={() => vote(picked ? null : v)}
            >
              {!hideHand && <CardFace value={v} />}
            </button>
          )
        })}
      </footer>
    </>
  )

  return (
    <div className="room">
      <header className="rail">
        <h1 className="wordmark">Poolthok</h1>
        <span className="code" title="Room code">#{room}</span>
        <button className="btn ghost" onClick={copy} aria-label={copied ? 'Copied' : 'Copy link'}>
          {copied ? <IconCheck /> : <IconLink />}
          <span>{copied ? 'Copied' : 'Copy link'}</span>
        </button>
        {canFloat && (
          <button
            className="btn ghost"
            onClick={toggleFloat}
            aria-pressed={!!floatWin}
            aria-label="Pop out"
            title={floatWin ? 'Close the floating window' : 'Keep the table in a small window on top of Jira or your call'}
          >
            <IconPopOut />
            <span>Pop out</span>
          </button>
        )}
        {count}
        <button className="btn ghost icon" onClick={leave} aria-label={leaveLabel} title={leaveLabel}>
          <IconLeave />
        </button>
      </header>

      {table(false)}
      {status === 'online' && !revealed && !hideHand && mine && mine.vote == null && (
        <Note className="note-hand" arrow="right">pick a card, nobody peeks</Note>
      )}
      {/* For screen sharing: turns your hand face-down so the call can't see your pick. */}
      <label className="hand-toggle" title="Turn your cards face-down while you share your screen">
        <input type="checkbox" role="switch" checked={hideHand} onChange={(e) => setHideHand(e.target.checked)} />
        <span className="track" aria-hidden="true" />
        <span>Hide my hand</span>
      </label>

      {floatWin && createPortal(
        <div className="room mini">
          <header className="rail">
            <span className="wordmark">Poolthok</span>
            {count}
          </header>
          {table(true)}
        </div>,
        floatWin.document.body,
      )}
    </div>
  )
}

// Document Picture-in-Picture (Chrome and Edge on desktop): an always-on-top window
// that stays visible while you work in another tab or app.
const canFloat = typeof window !== 'undefined' && 'documentPictureInPicture' in window

function useFloatingWindow() {
  const [win, setWin] = useState(null)
  useEffect(() => () => win?.close(), [win])

  const toggle = async () => {
    if (win) return win.close()
    let w
    try {
      w = await window.documentPictureInPicture.requestWindow({ width: 360, height: 540 })
    } catch {
      return
    }
    for (const node of document.head.querySelectorAll('link[rel="stylesheet"], style')) {
      const copy = node.cloneNode(true)
      if (node.href) copy.href = node.href
      w.document.head.append(copy)
    }
    w.document.title = document.title
    w.document.documentElement.lang = document.documentElement.lang
    w.addEventListener('pagehide', () => setWin(null), { once: true })
    setWin(w)
  }
  return [win, toggle]
}

// A decorative fan of the deck on the join page. Hover draws a card out; click turns it over.
function Fan({ dir }) {
  const [turned, setTurned] = useState(() => new Set())
  const turn = (v) => setTurned((t) => { const n = new Set(t); n.has(v) ? n.delete(v) : n.add(v); return n })
  return (
    <div className={'join-fan ' + dir} aria-hidden="true">
      {DECK.map((v, i) => (
        <div key={v} className="fan-card" data-turned={turned.has(v)} style={{ '--i': i - (DECK.length - 1) / 2 }} onClick={() => turn(v)}>
          <div className="fan-inner">
            <div className="card face"><CardFace value={v} /></div>
            <div className="card back" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Handwritten marker notes: the table's one gimmick, scribbled in red.
const ARROWS = {
  right: 'M4 8 C 26 2, 52 10, 66 34 M54 30 L67 36 L69 22',
  left: 'M76 8 C 54 2, 28 10, 14 34 M26 30 L13 36 L11 22',
}
function Note({ className, arrow, children }) {
  return (
    <p className={'note ' + className} aria-hidden="true">
      <span>{children}</span>
      <svg className={'note-arrow ' + arrow} viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROWS[arrow]} pathLength="1" />
      </svg>
    </p>
  )
}

// Consensus: one big brass moment. A light flash, then a burst of tiny cards and sparks that fall away.
function Burst() {
  const [bits] = useState(() => {
    const kinds = ['card', 'spark', 'dot', 'card']
    const rnd = (a, b) => a + Math.random() * (b - a)
    // Wave 1 bursts out of the number; wave 2 rains down across the whole table.
    const burst = Array.from({ length: 56 }, (_, k) => {
      const a = (k / 56) * Math.PI * 2 + rnd(0, 0.35)
      const d = rnd(150, 420)
      return { kind: kinds[k % 4], x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7 - 70, d: rnd(0, 160) }
    })
    const rain = Array.from({ length: 40 }, (_, k) => ({ kind: kinds[k % 4], rain: true, x: rnd(-560, 560), y: 0, d: rnd(250, 1300) }))
    return [...burst, ...rain].map((b) => ({ ...b, back: Math.random() < 0.45, r: rnd(-540, 540), s: rnd(0.75, 1.4) }))
  })
  return (
    <span className="burst" aria-hidden="true">
      <span className="flash" />
      {bits.map((b, k) => (
        <span key={k} className={'bit ' + b.kind + (b.back ? ' back' : '') + (b.rain ? ' rain' : '')} style={{ '--x': `${b.x}px`, '--y': `${b.y}px`, '--r': `${b.r}deg`, '--d': `${b.d}ms`, '--s': b.s }} />
      ))}
    </span>
  )
}

// A loose marker loop drawn around the revealed majority.
const Circled = () => (
  <svg className="circled" viewBox="0 0 200 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path d="M38 70 C 14 52, 30 16, 96 10 C 160 6, 194 30, 186 58 C 178 86, 118 96, 74 90 C 36 85, 10 66, 26 40 C 34 28, 52 20, 70 17" pathLength="1" />
  </svg>
)

function SeatCard({ player, revealed, index }) {
  const state = revealed && player.vote != null ? 'up' : player.voted ? 'down' : 'empty'
  return (
    <div className="flip" role="img" data-state={state} style={{ '--i': index }} aria-label={state === 'up' ? `${player.vote} points` : state === 'down' ? 'Voted' : 'Not voted yet'}>
      <div className="flip-inner">
        <div className="card back" />
        <div className="card face front">{state === 'up' && <CardFace value={player.vote} />}</div>
      </div>
    </div>
  )
}

function CardFace({ value }) {
  return (
    <>
      <span className="index" aria-hidden="true">{label(value)}</span>
      <span className="pip">{label(value)}</span>
      <span className="index br" aria-hidden="true">{label(value)}</span>
    </>
  )
}

const Svg = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />
)
const IconLink = () => (
  <Svg><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></Svg>
)
const IconHide = () => (
  <Svg><path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.4 3.3" /><path d="M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5.1-1.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /><path d="m2 2 20 20" /></Svg>
)
const IconPopOut = () => (
  <Svg><rect x="2.5" y="4" width="19" height="16" rx="2" /><rect x="12" y="12" width="6.5" height="5" rx="1" /></Svg>
)
const IconCheck = () => <Svg><path d="M20 6 9 17l-5-5" /></Svg>
const IconLeave = () => (
  <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Svg>
)
