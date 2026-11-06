import { useState } from 'react'
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
    </main>
  )
}

function Room({ room, name, isHost, onLeave }) {
  const { me, status, players, revealed, vote, reveal, hide, next, setFacilitator } = useRoom({ room, name, isHost })
  const [copied, setCopied] = useState(false)
  const mine = players.find((p) => p.id === me)
  const canRun = isHost || !!mine?.fac
  const present = players.filter((p) => p.online || p.voted)
  const votedCount = present.filter((p) => p.voted).length
  const waiting = present.filter((p) => !p.voted)

  const values = players.map((p) => p.vote).filter((v) => v != null)
  const avg = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null
  const consensus = revealed && values.length > 1 && values.every((v) => v === values[0])

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

  return (
    <div className="room">
      <header className="rail">
        <h1 className="wordmark">Poolthok</h1>
        <span className="code" title="Room code">#{room}</span>
        <button className="btn ghost" onClick={copy} aria-label={copied ? 'Copied' : 'Copy link'}>
          {copied ? <IconCheck /> : <IconLink />}
          <span>{copied ? 'Copied' : 'Copy link'}</span>
        </button>
        <span className="count" aria-live="polite">
          <b>{votedCount}</b> / {present.length} voted
        </span>
        <button className="btn ghost icon" onClick={leave} aria-label={leaveLabel} title={leaveLabel}>
          <IconLeave />
        </button>
      </header>

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

      <main className="table">
        <div className="status" aria-live="polite">
          {revealed ? (
            <div className="result">
              <span className="avg">{avg == null ? '–' : avg}</span>
              <span className="avg-label">Average</span>
              {consensus && <span className="consensus">Consensus</span>}
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
              {canRun && !p.host && p.id !== me ? (
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

      <footer className="hand" aria-label="Your cards">
        {DECK.map((v, i) => {
          const picked = mine?.vote === v
          return (
            <button
              key={v}
              className={'card face hand-card' + (picked ? ' picked' : '')}
              style={{ '--i': i - (DECK.length - 1) / 2, '--a': Math.abs(i - (DECK.length - 1) / 2) }}
              aria-pressed={picked}
              aria-label={`${v} points`}
              disabled={revealed || status !== 'online'}
              onClick={() => vote(picked ? null : v)}
            >
              <CardFace value={v} />
            </button>
          )
        })}
      </footer>
    </div>
  )
}

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
const IconCheck = () => <Svg><path d="M20 6 9 17l-5-5" /></Svg>
const IconLeave = () => (
  <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Svg>
)
