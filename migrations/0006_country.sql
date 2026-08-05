-- Multi-country atlas: every content row now belongs to exactly one country.
-- Existing rows are Vietnamese, so the default backfills them in place.
-- Slugs/ids are only unique WITHIN a country, hence the composite indexes below.

ALTER TABLE regions      ADD COLUMN country TEXT NOT NULL DEFAULT 'vn';
ALTER TABLE provinces    ADD COLUMN country TEXT NOT NULL DEFAULT 'vn';
ALTER TABLE destinations ADD COLUMN country TEXT NOT NULL DEFAULT 'vn';
ALTER TABLE dishes       ADD COLUMN country TEXT NOT NULL DEFAULT 'vn';
ALTER TABLE restaurants  ADD COLUMN country TEXT NOT NULL DEFAULT 'vn';
ALTER TABLE checkins     ADD COLUMN country TEXT NOT NULL DEFAULT 'vn';

CREATE INDEX IF NOT EXISTS regions_country       ON regions(country, display_order);
CREATE INDEX IF NOT EXISTS provinces_country     ON provinces(country, slug);
CREATE INDEX IF NOT EXISTS destinations_country  ON destinations(country, province_slug);
CREATE INDEX IF NOT EXISTS dishes_country        ON dishes(country, featured DESC);
CREATE INDEX IF NOT EXISTS restaurants_country   ON restaurants(country, dish_id);
CREATE INDEX IF NOT EXISTS checkins_uid_country  ON checkins(uid, country, created_at DESC);
