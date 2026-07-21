CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL CHECK(level IN ('A','B','C')),
  kind TEXT NOT NULL DEFAULT 'RSS',
  active INTEGER NOT NULL DEFAULT 1,
  last_fetched_at TEXT,
  last_status INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  url TEXT NOT NULL UNIQUE,
  fingerprint TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  published_at TEXT,
  collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  country TEXT,
  sector TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','qualified','rejected','used'))
);
CREATE INDEX IF NOT EXISTS idx_signals_collected ON signals(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE TABLE IF NOT EXISTS collection_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  fetched INTEGER NOT NULL DEFAULT 0,
  inserted INTEGER NOT NULL DEFAULT 0,
  error TEXT
);
INSERT OR IGNORE INTO sources(name,url,level,kind) VALUES
 ('BCEAO','https://www.bceao.int/fr/rss.xml','A','RSS institutionnel'),
 ('TechCabal','https://techcabal.com/feed/','B','RSS média'),
 ('Disrupt Africa','https://disruptafrica.com/feed/','B','RSS média'),
 ('Digital Business Africa','https://www.digitalbusiness.africa/feed/','B','RSS média');
