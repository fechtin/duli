-- Add per-locale content translations (Bible 013 — i18n overlay).
-- The column holds a JSON object: { "<locale>": { <translated fields> }, ... }.
-- Vietnamese stays in the base columns and is the fallback when a field is missing.
ALTER TABLE destinations ADD COLUMN i18n TEXT;
ALTER TABLE provinces ADD COLUMN i18n TEXT;
