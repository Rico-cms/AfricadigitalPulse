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
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
INSERT OR IGNORE INTO sources(name,url,level,kind) VALUES
 ('OMS Afrique','https://www.afro.who.int/rss.xml','A','RSS institutionnel · santé'),
 ('CEDEAO','https://www.ecowas.int/feed/','A','RSS institutionnel · politiques publiques'),
 ('Union africaine','https://au.int/en/rss.xml','A','RSS institutionnel · continental'),
 ('Smart Africa','https://smartafrica.org/feed/','A','RSS organisation · transformation numérique'),
 ('Internet Society Afrique','https://www.internetsociety.org/regions/africa/feed/','A','RSS organisation · Internet'),
 ('Techpoint Africa','https://techpoint.africa/feed/','B','RSS média · startups et produits'),
 ('Tech Africa News','https://www.techafricanews.com/feed/','B','RSS média · télécoms et infrastructures'),
 ('Space in Africa','https://spaceinafrica.com/feed/','B','RSS spécialisé · spatial et connectivité'),
 ('Connecting Africa','https://www.connectingafrica.com/rss.xml','B','RSS spécialisé · télécommunications'),
 ('African Business','https://african.business/feed','B','RSS média · économie et innovation'),
 ('The Conversation Africa — Technologie','https://theconversation.com/africa/technology/articles.atom','B','Atom expertise · recherche et technologie'),
 ('Benjamindada','https://www.benjamindada.com/rss/','B','RSS média · écosystème technologique');
