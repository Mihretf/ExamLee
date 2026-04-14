import { useState, useEffect, useCallback, useRef } from 'react'
import io from 'socket.io-client'
import './App.css'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
const EMOJIS = ['👍', '❤️', '🔥', '🎉']

function normalizeReactionMap(raw) {
  const next = Object.fromEntries(EMOJIS.map((e) => [e, 0]))
  if (!raw || typeof raw !== 'object') return next
  for (const e of EMOJIS) {
    const v = raw[e]
    if (typeof v === 'number' && !Number.isNaN(v)) next[e] = v
  }
  return next
}

export default function App() {
  const [jwt, setJwt] = useState('')
  const [examIdInput, setExamIdInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [comments, setComments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [reactionCounts, setReactionCounts] = useState(() =>
    normalizeReactionMap(null),
  )
  const [commentDraft, setCommentDraft] = useState('')
  const [liveError, setLiveError] = useState(null)

  const socketRef = useRef(null)

  const disconnect = useCallback(() => {
    const s = socketRef.current
    if (s) {
      s.removeAllListeners()
      s.disconnect()
      socketRef.current = null
    }
    setConnected(false)
  }, [])

  const connect = useCallback(() => {
    setLiveError(null)
    const examId = Number(examIdInput)
    if (!examIdInput.trim() || Number.isNaN(examId)) {
      setLiveError('Enter a valid exam ID.')
      return
    }
    if (!jwt.trim()) {
      setLiveError('JWT is required.')
      return
    }

    disconnect()

    const socket = io(SOCKET_URL, {
      auth: { token: jwt.trim() },
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      setComments([])
      setNotifications([])
      setReactionCounts(normalizeReactionMap(null))
      socket.emit('join_exam', { examId })
      socket.emit('get_my_notifications', {})
      socket.emit('fetch_reactions', { examId })
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('receive_comment', (payload) => {
      const c = payload?.comment ?? payload
      if (c && typeof c === 'object') {
        setComments((prev) => [...prev, c])
      } else if (typeof payload === 'string') {
        setComments((prev) => [...prev, { content: payload }])
      }
    })

    socket.on('new_notification', (n) => {
      if (n != null) setNotifications((prev) => [n, ...prev])
    })

    socket.on('notifications_list', (data) => {
      const list = Array.isArray(data)
        ? data
        : data?.notifications ?? data?.list ?? []
      setNotifications(Array.isArray(list) ? list : [])
    })

    socket.on('reaction_state', (data) => {
      const map = data?.counts ?? data?.reactions ?? data
      setReactionCounts(normalizeReactionMap(map))
    })

    socket.on('reaction_updated', (data) => {
      const emoji = data?.emoji
      const count = data?.count ?? data?.total
      if (emoji && typeof count === 'number' && !Number.isNaN(count)) {
        setReactionCounts((prev) => ({ ...prev, [emoji]: count }))
      }
    })

    socket.on('error', (err) => {
      const msg =
        typeof err === 'string'
          ? err
          : err?.message ?? err?.error ?? String(err)
      setLiveError(msg)
    })

    socket.on('connect_error', (err) => {
      setLiveError(err?.message || 'Connection failed.')
    })
  }, [jwt, examIdInput, disconnect])

  useEffect(() => () => disconnect(), [disconnect])

  const sendComment = () => {
    const socket = socketRef.current
    if (!socket?.connected) return
    const examId = Number(examIdInput)
    const content = commentDraft.trim()
    if (!content || Number.isNaN(examId)) return
    socket.emit('post_comment', { examId, content })
    setCommentDraft('')
  }

  const toggleReaction = (emoji) => {
    const socket = socketRef.current
    if (!socket?.connected) return
    const examId = Number(examIdInput)
    if (Number.isNaN(examId)) return
    socket.emit('toggle_reaction', { examId, emoji })
  }

  return (
    <div className="app-root">
      <header className="live-header">
        <h1>Exam live</h1>
        <div className="live-connect-row">
          <label className="live-field">
            <span>JWT</span>
            <input
              type="password"
              autoComplete="off"
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              placeholder="Bearer token"
              disabled={connected}
            />
          </label>
          <label className="live-field">
            <span>Exam ID</span>
            <input
              type="number"
              min={1}
              value={examIdInput}
              onChange={(e) => setExamIdInput(e.target.value)}
              placeholder="e.g. 42"
              disabled={connected}
            />
          </label>
          {connected ? (
            <button
              type="button"
              className="btn-primary"
              onClick={disconnect}
            >
              Disconnect
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={connect}>
              Connect
            </button>
          )}
        </div>
        <p className="live-socket-url">
          Socket: <code>{SOCKET_URL}</code>
        </p>
        {liveError ? <div className="live-error">{liveError}</div> : null}
      </header>

      <div className="live-grid">
        <section className="live-card">
          <h2>Comments</h2>
          <div className="comment-compose">
            <textarea
              rows={3}
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              placeholder="Write a comment…"
              disabled={!connected}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={sendComment}
              disabled={!connected || !commentDraft.trim()}
            >
              Send
            </button>
          </div>
          <ul className="comment-list">
            {comments.length === 0 ? (
              <li className="comment-empty">No comments yet.</li>
            ) : (
              comments.map((c, i) => (
                <li key={c.id ?? i}>
                  <div className="comment-body">
                    {c.content ?? c.text ?? JSON.stringify(c)}
                  </div>
                  {(c.author ?? c.userName) && (
                    <div className="comment-meta">{c.author ?? c.userName}</div>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="live-card">
          <h2>Reactions</h2>
          <div className="reaction-bar">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="reaction-btn"
                onClick={() => toggleReaction(emoji)}
                disabled={!connected}
                title={emoji}
              >
                <span className="reaction-emoji">{emoji}</span>
                <span className="reaction-count">{reactionCounts[emoji] ?? 0}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="live-card live-card-wide">
          <h2>Notifications</h2>
          <ul className="notif-list">
            {notifications.length === 0 ? (
              <li className="notif-empty">No notifications.</li>
            ) : (
              notifications.map((n, i) => (
                <li key={n.id ?? i}>
                  <pre className="notif-pre">
                    {typeof n === 'string' ? n : JSON.stringify(n, null, 2)}
                  </pre>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}
