-- D1 schema for leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  product TEXT,
  view TEXT,
  created_at TEXT NOT NULL,
  ip_last4 TEXT,
  ua_hash TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

