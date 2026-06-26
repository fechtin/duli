-- Vietnam Atlas — D1 schema (Bible 013 data model).
-- Read-heavy: arrays kept as JSON columns to avoid joins at the edge (013 §Edge Friendly).

CREATE TABLE IF NOT EXISTS regions (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  color         TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS provinces (
  slug        TEXT PRIMARY KEY,
  region_id   TEXT NOT NULL,
  name        TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  region_name TEXT NOT NULL,
  color       TEXT NOT NULL,
  center_lng  REAL NOT NULL,
  center_lat  REAL NOT NULL,
  summary     TEXT,
  story       TEXT,
  best_time   TEXT,
  specialties TEXT,            -- JSON array
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE IF NOT EXISTS destinations (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL,
  province_slug TEXT NOT NULL,
  name          TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  type          TEXT NOT NULL,
  lng           REAL NOT NULL,
  lat           REAL NOT NULL,
  summary       TEXT NOT NULL,
  story         TEXT NOT NULL,
  facts         TEXT NOT NULL,   -- JSON array
  travel_tips   TEXT NOT NULL,   -- JSON array
  best_time     TEXT,
  visit_duration TEXT,
  ticket        TEXT,
  opening_hours TEXT,
  badges        TEXT NOT NULL,   -- JSON array
  tags          TEXT NOT NULL,   -- JSON array
  gallery       TEXT NOT NULL,   -- JSON array
  nearby        TEXT NOT NULL,   -- JSON array
  featured      INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (province_slug) REFERENCES provinces(slug)
);

CREATE INDEX IF NOT EXISTS idx_dest_province ON destinations(province_slug);
CREATE INDEX IF NOT EXISTS idx_dest_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_prov_region ON provinces(region_id);
