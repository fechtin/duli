-- Food Explorer (Bible 026) — dishes + restaurants, read-heavy, JSON columns like 0001.

CREATE TABLE IF NOT EXISTS dishes (
  id              TEXT PRIMARY KEY,      -- slug
  slug            TEXT NOT NULL,
  name            TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  emoji           TEXT,
  summary         TEXT NOT NULL,
  story           TEXT NOT NULL,
  origin_province TEXT,                  -- province slug of origin
  province_slugs  TEXT NOT NULL,         -- JSON array — where it is a specialty
  ingredients     TEXT NOT NULL,         -- JSON array
  flavor          TEXT,
  best_time       TEXT,
  tags            TEXT NOT NULL,         -- JSON array: noodle/spicy/vegetarian/coffee/street/breakfast/dessert/seafood
  featured        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS restaurants (
  id            TEXT PRIMARY KEY,
  dish_id       TEXT NOT NULL,
  name          TEXT NOT NULL,
  province_slug TEXT NOT NULL,
  address       TEXT,
  lng           REAL NOT NULL,
  lat           REAL NOT NULL,
  price_range   TEXT,
  open_hours    TEXT,
  labels        TEXT NOT NULL,           -- JSON array: ai-pick/local-favorite/atlas-pick/street-food/fine-dining/family
  atlas_score   REAL NOT NULL,
  reasons       TEXT NOT NULL,           -- JSON array — "phù hợp với bạn vì..." (026 §AI Recommendation)
  FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

CREATE INDEX IF NOT EXISTS idx_rest_dish ON restaurants(dish_id);
CREATE INDEX IF NOT EXISTS idx_rest_province ON restaurants(province_slug);
