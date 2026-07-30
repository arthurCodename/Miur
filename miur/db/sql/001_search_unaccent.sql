-- Accent-insensitive, typo-tolerant product search.
--
-- WHY THIS FILE EXISTS AT ALL
-- Drizzle's schema.ts can describe tables, columns and simple indexes, but it
-- cannot describe Postgres extensions or custom SQL functions. Those have to be
-- raw SQL. Everything here is idempotent (IF NOT EXISTS / OR REPLACE) so
-- re-running it is harmless.
--
-- Statements are separated by the breakpoint marker that scripts/apply-sql.ts
-- splits on (Drizzle's own convention), because the Neon HTTP driver sends one
-- statement per request. Don't write that marker inside a comment — the
-- splitter is a plain string split and will cut the comment in half.

CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint

CREATE EXTENSION IF NOT EXISTS unaccent;
--> statement-breakpoint

-- WHY A WRAPPER INSTEAD OF CALLING unaccent() DIRECTLY IN THE INDEX
--
-- Postgres will only build an index on an expression it considers IMMUTABLE —
-- meaning the same input must produce the same output forever. If that weren't
-- guaranteed, the stored index entries could silently stop matching what the
-- function returns today.
--
-- The one-argument unaccent() is only STABLE, not IMMUTABLE, because it looks
-- up the "unaccent" text-search dictionary at call time, and that dictionary
-- could in principle be redefined. So:
--
--     CREATE INDEX ... ON products USING gin (unaccent(name) gin_trgm_ops);
--
-- is rejected with "functions in index expression must be marked IMMUTABLE".
--
-- The two-argument form takes the dictionary explicitly, which removes the
-- runtime lookup and makes the result genuinely deterministic. Wrapping that
-- and marking it IMMUTABLE is the standard documented workaround.
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  PARALLEL SAFE
  STRICT
AS $$
  SELECT public.unaccent('public.unaccent'::regdictionary, $1)
$$;
--> statement-breakpoint

-- Trigram indexes over the UNACCENTED text.
--
-- These are additions, not replacements. The existing name_search_idx and
-- desc_search_idx (declared in db/schema.ts) index the raw columns. Postgres
-- cannot use an index on `name` to answer a query about
-- `immutable_unaccent(name)` — as far as the planner is concerned those are
-- two different expressions. So a query that unaccents needs its own index or
-- it falls back to scanning every row.
CREATE INDEX IF NOT EXISTS products_name_unaccent_trgm_idx
  ON products USING gin (immutable_unaccent(name) gin_trgm_ops);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS products_description_unaccent_trgm_idx
  ON products USING gin (immutable_unaccent(description) gin_trgm_ops);
