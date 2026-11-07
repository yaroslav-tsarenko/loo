CREATE TABLE "user_counters" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"xp" bigint DEFAULT 0 NOT NULL,
	"cards" integer DEFAULT 0 NOT NULL,
	"cards_known" integer DEFAULT 0 NOT NULL,
	"quizzes" integer DEFAULT 0 NOT NULL,
	"quizzes_correct" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_counters" ADD CONSTRAINT "user_counters_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- ── Running totals kept by the database (src/db/schema.ts → userCounters) ─────────────────────────────────────
-- Same definitions as the count/sum subqueries they replace (statsRead, xpRead): cards = flashcard attempts,
-- cards_known = flashcard 'good', quizzes = quiz attempts, quizzes_correct = quiz 'correct', xp = sum(xp_ledger).
-- Inserts upsert the learner's row; deletes (resetProgress) only update it — when a whole account is deleted the
-- counters row may already be gone through the cascade, and must not come back.
-- SECURITY DEFINER: the trigger writes the row as the table owner; learners only ever read it (policy below).
-- The triggers lock attempts / xp_ledger for the rest of this migration, so the backfill below and the rows inserted
-- later never overlap or miss each other.
CREATE OR REPLACE FUNCTION public.levelup_count_attempt() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r record;
  d integer;
BEGIN
  IF TG_OP = 'INSERT' THEN r := NEW; d := 1; ELSE r := OLD; d := -1; END IF;
  IF r.kind NOT IN ('flashcard', 'quiz') THEN RETURN NULL; END IF;
  IF TG_OP = 'INSERT' THEN
    INSERT INTO user_counters AS c (user_id, cards, cards_known, quizzes, quizzes_correct)
    VALUES (
      r.user_id,
      (r.kind = 'flashcard')::int,
      (r.kind = 'flashcard' AND r.outcome = 'good')::int,
      (r.kind = 'quiz')::int,
      (r.kind = 'quiz' AND r.outcome = 'correct')::int
    )
    ON CONFLICT (user_id) DO UPDATE SET
      cards = c.cards + excluded.cards,
      cards_known = c.cards_known + excluded.cards_known,
      quizzes = c.quizzes + excluded.quizzes,
      quizzes_correct = c.quizzes_correct + excluded.quizzes_correct;
  ELSE
    UPDATE user_counters SET
      cards = cards - (r.kind = 'flashcard')::int,
      cards_known = cards_known - (r.kind = 'flashcard' AND r.outcome = 'good')::int,
      quizzes = quizzes - (r.kind = 'quiz')::int,
      quizzes_correct = quizzes_correct - (r.kind = 'quiz' AND r.outcome = 'correct')::int
    WHERE user_id = r.user_id;
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.levelup_count_xp() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO user_counters AS c (user_id, xp) VALUES (NEW.user_id, NEW.amount)
    ON CONFLICT (user_id) DO UPDATE SET xp = c.xp + excluded.xp;
  ELSE
    UPDATE user_counters SET xp = xp - OLD.amount WHERE user_id = OLD.user_id;
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.levelup_count_attempt() FROM PUBLIC;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.levelup_count_xp() FROM PUBLIC;
--> statement-breakpoint
CREATE TRIGGER attempts_count AFTER INSERT OR DELETE ON attempts FOR EACH ROW EXECUTE FUNCTION public.levelup_count_attempt();
--> statement-breakpoint
CREATE TRIGGER xp_ledger_count AFTER INSERT OR DELETE ON xp_ledger FOR EACH ROW EXECUTE FUNCTION public.levelup_count_xp();
--> statement-breakpoint
INSERT INTO user_counters (user_id, xp, cards, cards_known, quizzes, quizzes_correct)
SELECT p.id,
  coalesce((SELECT sum(x.amount) FROM xp_ledger x WHERE x.user_id = p.id), 0),
  (SELECT count(*) FROM attempts a WHERE a.user_id = p.id AND a.kind = 'flashcard'),
  (SELECT count(*) FROM attempts a WHERE a.user_id = p.id AND a.kind = 'flashcard' AND a.outcome = 'good'),
  (SELECT count(*) FROM attempts a WHERE a.user_id = p.id AND a.kind = 'quiz'),
  (SELECT count(*) FROM attempts a WHERE a.user_id = p.id AND a.kind = 'quiz' AND a.outcome = 'correct')
FROM profiles p
ON CONFLICT (user_id) DO NOTHING;
--> statement-breakpoint
ALTER TABLE user_counters ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
-- Supabase: learners read their own row (the app role from 0014); nobody but the triggers writes it.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'levelup_learner') OR to_regprocedure('public.levelup_uid()') IS NULL THEN
    RAISE NOTICE 'No app role: user_counters policy skipped (local PGlite / plain Postgres)';
    RETURN;
  END IF;
  GRANT SELECT ON user_counters TO levelup_learner;
  CREATE POLICY user_counters_own ON user_counters FOR SELECT TO levelup_learner USING (user_id = public.levelup_uid());
END $$;
