-- Loo's evolution replaces the Noob→God rank ladder (src/game/ranks.ts, src/game/evolution.ts).
-- * user_state.evo_step: the evolution step reached (0 = Яйце I … 21 = Легендарний).
-- * user_state.evo_seen: the last step whose evolution moment (full-screen cutscene) was shown — plays once per step.
-- * Old ranks are carried over (noob 0 · trainee 3 · junior 6 · middle 9 · senior 15 · staff 18 · principal 20 · god 21)
--   and marked as already announced; the next settle recomputes the real step from XP + course milestones.
-- * No new tables: RLS / grants of user_state (0007) are unchanged. Runs on PGlite and Supabase alike.

ALTER TABLE "user_state" ADD COLUMN "evo_step" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_state" ADD COLUMN "evo_seen" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE "user_state" SET "evo_step" = CASE "rank"
  WHEN 'trainee' THEN 3 WHEN 'junior' THEN 6 WHEN 'middle' THEN 9 WHEN 'senior' THEN 15
  WHEN 'staff' THEN 18 WHEN 'principal' THEN 20 WHEN 'god' THEN 21 ELSE 0 END;--> statement-breakpoint
UPDATE "user_state" SET "evo_seen" = "evo_step";--> statement-breakpoint
ALTER TABLE "user_state" DROP COLUMN "rank";
