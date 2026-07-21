CREATE TABLE IF NOT EXISTS analysis_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  signal_id INTEGER NOT NULL UNIQUE REFERENCES signals(id),
  status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','processing','ready','rejected')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_analysis_status ON analysis_queue(status, created_at DESC);
