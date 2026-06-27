-- User travel history, synced per Firebase UID.
CREATE TABLE IF NOT EXISTS checkins (
  id               TEXT PRIMARY KEY,
  uid              TEXT NOT NULL,
  destination_id   TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  province_slug    TEXT NOT NULL,
  caption          TEXT NOT NULL DEFAULT '',
  photo_seed       TEXT NOT NULL DEFAULT '',
  photo_url        TEXT,
  created_at       INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS checkins_uid_created ON checkins(uid, created_at DESC);
