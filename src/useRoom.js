import Peer from 'peerjs'
import { useEffect, useRef, useState } from 'react'

export const DECK = [0.5, 1, 2, 3, 5, 8, 13]
const PREFIX = 'poolthok-'
const RETRY_MS = 2000
const DROP_OFFLINE_MS = 60000
const BEAT_MS = 3000 // both sides ping; silence for SILENT_MS means the other side is gone
const SILENT_MS = 10000
const NOT_FOUND_MS = 15000 // a member who never reached the room probably has the wrong code

// sessionStorage lives in this browser tab only: nothing is stored on a server.
export const store = {
  get(key) {
    try { return JSON.parse(sessionStorage.getItem('pt:' + key)) } catch { return null }
  },
  set(key, value) {
    try { sessionStorage.setItem('pt:' + key, JSON.stringify(value)) } catch {}
  },
}

export const newRoomCode = () => Math.random().toString(36).slice(2, 8)

export function myId() {
  let id = store.get('id')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    store.set('id', id)
  }
  return id
}

// What one viewer may see: others' values stay hidden until the reveal.
function snapshot(state, viewerId) {
  const players = Object.entries(state.players).map(([id, p]) => ({
    id,
    name: p.name,
    host: !!p.host,
    fac: !!(p.host || p.fac),
    online: p.online,
    voted: p.vote != null,
    vote: state.revealed || id === viewerId ? p.vote : null,
  }))
  return { players, revealed: state.revealed }
}

export function useRoom({ room, name, isHost }) {
  const me = myId()
  const [view, setView] = useState({ players: [], revealed: false })
  const [status, setStatus] = useState('connecting') // connecting | online | reconnecting | notfound
  const api = useRef(() => {})

  useEffect(() => {
    let peer
    let alive = true
    let timer
    const later = (fn) => { clearTimeout(timer); timer = setTimeout(() => alive && fn(), RETRY_MS) }

    if (isHost) {
      const key = 'host:' + room
      const conns = new Map()
      const drops = new Map()
      const state = store.get(key) || { players: {}, revealed: false }
      state.players[me] = { ...state.players[me], name, host: true, online: true, vote: state.players[me]?.vote ?? null }

      const publish = () => {
        store.set(key, state)
        setView(snapshot(state, me))
        conns.forEach((conn, id) => conn.open && conn.send(snapshot(state, id)))
      }
      const scheduleDrop = (id) => {
        clearTimeout(drops.get(id))
        drops.set(id, setTimeout(() => {
          if (state.players[id] && !state.players[id].online) { delete state.players[id]; publish() }
        }, DROP_OFFLINE_MS))
      }
      // After a refresh nobody is connected yet; give them time to come back.
      Object.keys(state.players).forEach((id) => {
        if (id !== me) { state.players[id].online = false; scheduleDrop(id) }
      })

      const gone = (conn) => {
        const id = conn.memberId
        if (!id || conns.get(id) !== conn) return
        conns.delete(id)
        if (state.players[id]) { state.players[id].online = false; scheduleDrop(id); publish() }
      }
      const handle = (conn, msg) => {
        conn.lastSeen = Date.now()
        if (msg.type === 'ping') return
        if (msg.type === 'bye') return gone(conn)
        if (msg.type === 'join') {
          conn.memberId = msg.id
          conns.set(msg.id, conn)
          clearTimeout(drops.get(msg.id))
          const prev = state.players[msg.id]
          state.players[msg.id] = { name: msg.name, online: true, fac: !!prev?.fac, vote: prev ? prev.vote : state.revealed ? null : msg.vote ?? null }
          return publish()
        }
        act(conn.memberId, msg)
      }
      // Every change goes through here, from this browser or a member's. Round controls need the facilitator role.
      const act = (actorId, msg) => {
        const actor = state.players[actorId]
        if (!actor) return
        const fac = actor.host || actor.fac
        if (msg.type === 'vote') { if (state.revealed) return; actor.vote = msg.value }
        else if (!fac) return
        else if (msg.type === 'reveal') state.revealed = true
        else if (msg.type === 'hide') state.revealed = false
        else if (msg.type === 'next') {
          state.revealed = false
          Object.values(state.players).forEach((p) => { p.vote = null })
        } else if (msg.type === 'role') {
          const target = state.players[msg.id]
          if (!target || target.host) return
          target.fac = !!msg.fac
        } else return
        publish()
      }

      const start = () => {
        peer = new Peer(PREFIX + room)
        peer.on('open', () => { setStatus('online'); publish() })
        peer.on('connection', (conn) => {
          conn.on('data', (msg) => handle(conn, msg))
          conn.on('close', () => gone(conn))
        })
        peer.on('disconnected', () => alive && !peer.destroyed && peer.reconnect())
        peer.on('error', (err) => {
          // 'unavailable-id': our old ID is still held after a refresh. Wait and claim it again.
          if (['unavailable-id', 'network', 'server-error', 'socket-error', 'socket-closed'].includes(err.type)) {
            setStatus('reconnecting')
            peer.destroy()
            later(start)
          }
        })
      }

      api.current = (msg) => act(me, msg)
      const beat = setInterval(() => {
        conns.forEach((conn) => {
          if (Date.now() - conn.lastSeen > SILENT_MS) { gone(conn); conn.close() }
          else if (conn.open) conn.send({ type: 'ping' })
        })
      }, BEAT_MS)
      setView(snapshot(state, me))
      start()
      return () => { alive = false; clearTimeout(timer); clearInterval(beat); drops.forEach(clearTimeout); peer?.destroy() }
    }

    // Member: connect to the facilitator's browser and follow its snapshots.
    let conn
    let lastSeen = 0
    const voteKey = 'vote:' + room
    let reached = false
    // Keep retrying in the background, but tell the person if the room never answers.
    const notFound = setTimeout(() => alive && !reached && setStatus('notfound'), NOT_FOUND_MS)
    const connect = () => {
      if (!alive || peer.destroyed) return
      conn = peer.connect(PREFIX + room, { reliable: true })
      conn.on('open', () => {
        reached = true
        setStatus('online')
        lastSeen = Date.now()
        conn.send({ type: 'join', id: me, name, vote: store.get(voteKey) })
      })
      conn.on('data', (snap) => {
        lastSeen = Date.now()
        if (snap.type === 'ping') return
        setView(snap)
        if (!snap.revealed) store.set(voteKey, snap.players.find((p) => p.id === me)?.vote ?? null)
      })
      conn.on('close', () => { setStatus((s) => (s === 'online' ? 'reconnecting' : s)); later(connect) })
    }
    const start = () => {
      peer = new Peer()
      peer.on('open', connect)
      peer.on('disconnected', () => alive && !peer.destroyed && peer.reconnect())
      peer.on('error', (err) => {
        setStatus((s) => (s === 'online' ? 'reconnecting' : s))
        if (err.type === 'peer-unavailable') later(connect) // facilitator not here (yet)
        else { peer.destroy(); later(start) }
      })
    }

    api.current = (msg) => {
      if (msg.type === 'vote') {
        store.set(voteKey, msg.value)
        setView((v) => ({ ...v, players: v.players.map((p) => (p.id === me ? { ...p, vote: msg.value, voted: msg.value != null } : p)) }))
      }
      if (conn?.open) conn.send(msg)
    }
    const beat = setInterval(() => {
      if (!conn?.open) return
      if (Date.now() - lastSeen > SILENT_MS) conn.close() // host vanished; 'close' triggers a retry
      else conn.send({ type: 'ping' })
    }, BEAT_MS)
    const bye = () => conn?.open && conn.send({ type: 'bye' })
    addEventListener('pagehide', bye)
    start()
    return () => { alive = false; bye(); clearTimeout(timer); clearTimeout(notFound); clearInterval(beat); removeEventListener('pagehide', bye); peer?.destroy() }
  }, [room, name, isHost, me])

  return {
    me,
    status,
    ...view,
    vote: (value) => api.current({ type: 'vote', value }),
    reveal: () => api.current({ type: 'reveal' }),
    hide: () => api.current({ type: 'hide' }),
    next: () => api.current({ type: 'next' }),
    setFacilitator: (id, fac) => api.current({ type: 'role', id, fac }),
  }
}
