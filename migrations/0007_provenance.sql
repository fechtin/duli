-- Editorial provenance for destinations (031).
-- `ticket`, `opening_hours` and numeric facts go stale; these two columns record what they
-- were last checked against and when, so scripts/verify-kr.mjs can report on staleness
-- instead of the data silently rotting. NULL = never verified.

ALTER TABLE destinations ADD COLUMN source_url  TEXT;
ALTER TABLE destinations ADD COLUMN verified_at TEXT;
