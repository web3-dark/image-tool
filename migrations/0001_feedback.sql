CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('problem', 'suggestion', 'other')),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 2 AND 2000),
  email TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS feedback_status_id ON feedback(status, id);

CREATE TABLE IF NOT EXISTS feedback_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS feedback_rate_expiry ON feedback_rate_limits(expires_at);
