-- Run once against your Neon Postgres database (psql or SQL editor).

CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  owner_user_id INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_exam ON comments (exam_id);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  actor_id INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  target_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);

CREATE TABLE IF NOT EXISTS reactions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  emoji VARCHAR(32) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (exam_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_exam ON reactions (exam_id);

-- Demo row: exam id 1 owned by user 1 (matches JWT id:1 from generateToken.js)
INSERT INTO exams (id, owner_user_id, title)
VALUES (1, 1, 'Demo exam')
ON CONFLICT (id) DO NOTHING;
