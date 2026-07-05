-- Add per-locale content translations for Food Explorer (dishes + restaurants).
-- Same overlay shape as 0002: JSON object { "<locale>": { <translated fields> }, ... }.
-- Vietnamese stays in the base columns and is the fallback when a field is missing.
ALTER TABLE dishes ADD COLUMN i18n TEXT;
ALTER TABLE restaurants ADD COLUMN i18n TEXT;
