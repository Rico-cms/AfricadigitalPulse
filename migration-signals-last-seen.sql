ALTER TABLE signals ADD COLUMN last_seen_at TEXT;
UPDATE signals SET last_seen_at = collected_at WHERE last_seen_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_signals_last_seen ON signals(last_seen_at DESC);
