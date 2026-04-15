# Real-time API (Socket.IO) — handoff for frontend

This document describes how to connect to the ExamLee backend and use **live comments**, **notifications**, and **reactions**. The server uses **Socket.IO v4** over the same HTTP server as the REST app (default port **5000** unless `PORT` is set in `.env`).

---

## Prerequisites

1. **Database**: Run `backend/schema.sql` on your Postgres (e.g. Neon) so tables `exams`, `comments`, `notifications`, and `reactions` exist. The script seeds exam `id = 1` owned by user `1` for local testing.
2. **JWT**: Tokens must be signed with the same `JWT_SECRET` as the server. Payload must include **`id`** (integer user id). Generate test tokens with `node backend/generateToken.js`.
3. **CORS**: Socket server allows `origin: *` (adjust for production if needed).

---

## Connection

- **URL**: `http://<host>:<PORT>` (e.g. `http://localhost:5000`).

### Authentication (required)

The connection is rejected without a valid JWT. The server reads the token from **either**:

| Location | Notes |
|----------|--------|
| Handshake **`auth.token`** | Preferred for browser clients (`socket.io-client`: `io(url, { auth: { token } })`). |
| Handshake **query `token`** | Supported for tools that cannot set `auth` (e.g. some API clients). |

Decoded JWT is attached server-side as `socket.user`; **`socket.user.id`** is the current user id.

### Automatic rooms

On successful connect, the socket **automatically joins** a private room:

- `user_<userId>` — used to deliver notifications only to that user.

The client should **still emit** `join_exam` when viewing an exam so it receives comments and reaction updates for that exam.

---

## Client → server events (emit)

Emit these with `socket.emit(eventName, payload)`.

| Event | Payload | Purpose |
|-------|---------|---------|
| `join_exam` | `examId` (number or string) | Join room `exam_<examId>` to receive comments and reaction broadcasts for that exam. |
| `post_comment` | `{ examId, content }` | Create a comment. **`examOwnerId` is not sent** — the server loads the owner from the database. |
| `get_my_notifications` | _(none)_ | Request the current user’s saved notifications (see `notifications_list`). |
| `fetch_reactions` | `examId` | Load reaction state for one exam (see `reaction_state`). |
| `toggle_reaction` | `{ examId, emoji }` | Toggle a reaction (see behaviour below). |
| `send_notification` | `{ targetUserId, actionType, targetId }` | Generic notification (optional); `actorId` is always the connected user. |

### `post_comment`

- **Body**: `{ "examId": 1, "content": "Nice work!" }`
- **Broadcast**: Everyone in `exam_<examId>` receives `receive_comment` with the new row.
- **Side effect**: If the commenter is **not** the exam owner, the owner gets a `NEW_COMMENT` notification via `new_notification`.

### `toggle_reaction`

- **Body**: `{ "examId": 1, "emoji": "👍" }` (emoji is a short string, max 32 chars in DB).
- **Rules**: One reaction per user per exam. If the user clicks the **same** emoji they already have, that reaction is **removed**. Otherwise the row is inserted or updated to the new emoji.
- **Broadcast**: Everyone in `exam_<examId>` receives `reaction_updated` with full snapshot.
- **Side effect**: If the user is **not** the exam owner, the owner receives `NEW_REACTION` via `new_notification`.

### `send_notification` (generic)

- **Body**: `{ "targetUserId": 2, "actionType": "SOME_TYPE", "targetId": 1 }`
- Persists a row and emits `new_notification` to `user_<targetUserId>`.

---

## Server → client events (listen)

Subscribe with `socket.on(eventName, handler)`.

| Event | Payload | When |
|-------|---------|------|
| `receive_comment` | Comment row | After a successful `post_comment` (all clients in the exam room). |
| `new_notification` | Notification row | New notification for **this** user (private room). |
| `notifications_list` | `array` of notification rows | Response to `get_my_notifications`. |
| `reaction_state` | See below | Response to `fetch_reactions`. |
| `reaction_updated` | Same shape as `reaction_state` | After any `toggle_reaction` in that exam (all clients in the exam room). |
| `error` | `{ message: string }` | Validation / DB / not found errors. |

### Comment row (Postgres `RETURNING *`)

Typical fields: `id`, `exam_id`, `user_id`, `content`, `created_at` (exact names depend on DB driver casing; Node `pg` returns lowercase keys).

### Notification row

Typical fields: `id`, `user_id` (recipient), `actor_id`, `action_type`, `target_id`, `created_at`.

**Built-in `action_type` values** from comment/reaction flows:

- `NEW_COMMENT`
- `NEW_REACTION`

### Reaction payloads (`reaction_state` / `reaction_updated`)

```json
{
  "examId": 1,
  "counts": { "👍": 2, "❤️": 1 },
  "userReactions": { "1": "👍", "2": "❤️" }
}
```

- **`counts`**: emoji → number of users with that emoji.
- **`userReactions`**: string user id → that user’s current emoji for this exam.

---

## Suggested frontend flow

1. Connect with JWT (`auth.token` or `query.token`).
2. When navigating to an exam page: `join_exam(examId)`, then `fetch_reactions(examId)`, and `get_my_notifications()` (for bell / inbox).
3. Append incoming `receive_comment` to the thread; merge `reaction_updated` / `reaction_state` into local state.
4. On `new_notification`, update UI (and optionally refetch exam list if needed).
5. Handle `error` for user-visible messages.

---

## Testing with Postman

Postman **10.14+** supports **Socket.IO** as a request type (not plain WebSocket).

1. Create a request: **New → Socket.IO** (or **File → New → Socket.IO**).
2. **URL**: `http://localhost:5000` (adjust host/port).
3. **Auth / connection**:
   - Prefer **Query Params**: `token=<your_jwt>`  
   - Or use the client’s **Auth** section if your Postman version exposes `auth.token` for Socket.IO.
4. **Connect** and wait until the connection succeeds (server logs the user id).
5. **Emit** messages (names and JSON bodies must match the tables above), for example:
   - Event: `join_exam` — Message: `1` (raw number) or test both string and number; rooms use `exam_<String(examId)>`.
   - Event: `fetch_reactions` — Message: `1`
   - Event: `get_my_notifications` — Message: empty or omit body per Postman UI
   - Event: `post_comment` — Message: `{ "examId": 1, "content": "Hello from Postman" }`
   - Event: `toggle_reaction` — Message: `{ "examId": 1, "emoji": "👍" }`
6. Watch **Messages** / **Events** panel for `receive_comment`, `reaction_state`, `notifications_list`, `new_notification`, `reaction_updated`, `error`.

If Socket.IO is not available in your Postman build, use **Hoppscotch** (Socket.IO), a small **Node** script with `socket.io-client`, or the **Socket.IO Admin UI** / CLI tools — same event names and payloads.

---

## Environment reference (backend)

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP/Socket listen port (default `5000`). |
| `JWT_SECRET` | Must match token signing used by your auth service. |
| `DATABASE_URL` | Postgres connection string for Neon etc. |

---

## Changelog (for frontend)

- Comments no longer require `examOwnerId` from the client; the server resolves the owner from `exams`.
- Exam rooms are normalized as `exam_<examId>` with string id in the room name; send numeric or string `examId` consistently in payloads.

If anything in this doc does not match behaviour, treat the **server source** under `backend/src/socket/` as the source of truth and ask the backend team to update this file.
