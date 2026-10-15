-- Phase 2: multi-user (docs/SECURITY.md §4).
-- * profiles(id = auth.users.id) + user_id on every per-user table (part of the primary key, FK → profiles ON DELETE CASCADE).
-- * Existing single-user rows move to the placeholder "legacy owner" 00000000-0000-0000-0000-000000000000; the first
--   sign-in of an ADMIN_EMAILS address claims them (src/server/auth/claim.ts).
-- * settings → user_settings (per user) + system_state (internal.* keys, vaultPath).
-- * news_items.read_at / saved → news_reads(user_id, news_id); per-user "hide AI reel" → reel_state.hidden.
-- * Supabase only (guarded, so this also runs on PGlite): RLS policies `user_id = auth.uid()`, grants for the
--   `authenticated` role that the app switches to per request (src/server/db/with-user.ts), and a trigger that
--   deletes the profile (→ all progress) when an auth.users row is deleted.

CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"locale" text DEFAULT 'uk' NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"onboarding" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
INSERT INTO "profiles" ("id", "display_name", "created_at", "updated_at")
VALUES ('00000000-0000-0000-0000-000000000000', 'Legacy owner', (extract(epoch FROM now()) * 1000)::bigint, (extract(epoch FROM now()) * 1000)::bigint);
--> statement-breakpoint

-- ── user_id on every per-user table (existing rows → legacy owner) ─────────────────────────────────────────
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['achievements', 'attempts', 'chapter_progress', 'daily_activity', 'daily_missions', 'lesson_progress',
                           'mistakes', 'reel_state', 'sessions', 'srs_cards', 'task_state', 'xp_ledger'] LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN "user_id" uuid NOT NULL DEFAULT %L', t, '00000000-0000-0000-0000-000000000000');
    EXECUTE format('ALTER TABLE %I ALTER COLUMN "user_id" DROP DEFAULT', t);
    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action', t, t || '_user_id_profiles_id_fk');
  END LOOP;
END $$;
--> statement-breakpoint

-- Composite primary keys (user_id first: it also serves as the per-user index).
ALTER TABLE "achievements" DROP CONSTRAINT "achievements_pkey";--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_id_pk" PRIMARY KEY ("user_id", "id");--> statement-breakpoint
ALTER TABLE "chapter_progress" DROP CONSTRAINT "chapter_progress_pkey";--> statement-breakpoint
ALTER TABLE "chapter_progress" ADD CONSTRAINT "chapter_progress_user_id_chapter_id_pk" PRIMARY KEY ("user_id", "chapter_id");--> statement-breakpoint
ALTER TABLE "daily_activity" DROP CONSTRAINT "daily_activity_pkey";--> statement-breakpoint
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_user_id_day_pk" PRIMARY KEY ("user_id", "day");--> statement-breakpoint
ALTER TABLE "daily_missions" DROP CONSTRAINT "daily_missions_pkey";--> statement-breakpoint
ALTER TABLE "daily_missions" ADD CONSTRAINT "daily_missions_user_id_day_pk" PRIMARY KEY ("user_id", "day");--> statement-breakpoint
ALTER TABLE "lesson_progress" DROP CONSTRAINT "lesson_progress_pkey";--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_lesson_id_pk" PRIMARY KEY ("user_id", "lesson_id");--> statement-breakpoint
ALTER TABLE "mistakes" DROP CONSTRAINT "mistakes_pkey";--> statement-breakpoint
ALTER TABLE "mistakes" ADD CONSTRAINT "mistakes_user_id_unit_id_pk" PRIMARY KEY ("user_id", "unit_id");--> statement-breakpoint
ALTER TABLE "reel_state" DROP CONSTRAINT "reel_state_pkey";--> statement-breakpoint
ALTER TABLE "reel_state" ADD CONSTRAINT "reel_state_user_id_reel_id_pk" PRIMARY KEY ("user_id", "reel_id");--> statement-breakpoint
ALTER TABLE "srs_cards" DROP CONSTRAINT "srs_cards_pkey";--> statement-breakpoint
ALTER TABLE "srs_cards" ADD CONSTRAINT "srs_cards_user_id_unit_id_pk" PRIMARY KEY ("user_id", "unit_id");--> statement-breakpoint
ALTER TABLE "task_state" DROP CONSTRAINT "task_state_pkey";--> statement-breakpoint
ALTER TABLE "task_state" ADD CONSTRAINT "task_state_user_id_unit_id_pk" PRIMARY KEY ("user_id", "unit_id");--> statement-breakpoint

ALTER TABLE "reel_state" ADD COLUMN "hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint

-- Indexes: every per-user lookup starts with user_id.
DROP INDEX IF EXISTS "attempts_unit_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "attempts_time_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "attempts_day_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "srs_due_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "xp_day_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "lesson_chapter_idx";--> statement-breakpoint
CREATE INDEX "attempts_user_unit_idx" ON "attempts" USING btree ("user_id", "unit_id", "answered_at");--> statement-breakpoint
CREATE INDEX "attempts_user_day_idx" ON "attempts" USING btree ("user_id", "day");--> statement-breakpoint
CREATE INDEX "attempts_user_id_idx" ON "attempts" USING btree ("user_id", "id");--> statement-breakpoint
CREATE INDEX "lesson_user_guide_idx" ON "lesson_progress" USING btree ("user_id", "guide_id");--> statement-breakpoint
CREATE INDEX "reel_state_user_seen_idx" ON "reel_state" USING btree ("user_id", "last_seen_at");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id", "started_at");--> statement-breakpoint
CREATE INDEX "srs_user_due_idx" ON "srs_cards" USING btree ("user_id", "due");--> statement-breakpoint
CREATE INDEX "xp_user_day_idx" ON "xp_ledger" USING btree ("user_id", "day");--> statement-breakpoint

-- ── settings → user_settings + system_state ─────────────────────────────────────────────────────────────────
CREATE TABLE "user_settings" (
	"user_id" uuid NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	CONSTRAINT "user_settings_user_id_key_pk" PRIMARY KEY ("user_id", "key")
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE TABLE "system_state" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
INSERT INTO "user_settings" ("user_id", "key", "value")
SELECT '00000000-0000-0000-0000-000000000000', "key", "value" FROM "settings" WHERE "key" NOT LIKE 'internal.%' AND "key" <> 'vaultPath';--> statement-breakpoint
INSERT INTO "system_state" ("key", "value")
SELECT "key", "value" FROM "settings" WHERE "key" LIKE 'internal.%' OR "key" = 'vaultPath';--> statement-breakpoint
DROP TABLE "settings";--> statement-breakpoint

-- ── news_items.read_at / saved → news_reads ─────────────────────────────────────────────────────────────────
CREATE TABLE "news_reads" (
	"user_id" uuid NOT NULL,
	"news_id" text NOT NULL,
	"read_at" bigint,
	"saved" boolean DEFAULT false NOT NULL,
	CONSTRAINT "news_reads_user_id_news_id_pk" PRIMARY KEY ("user_id", "news_id")
);
--> statement-breakpoint
ALTER TABLE "news_reads" ADD CONSTRAINT "news_reads_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_reads" ADD CONSTRAINT "news_reads_news_id_news_items_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_reads_news_idx" ON "news_reads" USING btree ("news_id");--> statement-breakpoint
INSERT INTO "news_reads" ("user_id", "news_id", "read_at", "saved")
SELECT '00000000-0000-0000-0000-000000000000', "id", "read_at", "saved" FROM "news_items" WHERE "read_at" IS NOT NULL OR "saved";--> statement-breakpoint
ALTER TABLE "news_items" DROP COLUMN "read_at";--> statement-breakpoint
ALTER TABLE "news_items" DROP COLUMN "saved";--> statement-breakpoint

-- No legacy data (fresh database): no placeholder owner either.
DELETE FROM "profiles" p
WHERE p."id" = '00000000-0000-0000-0000-000000000000'
  AND NOT EXISTS (SELECT 1 FROM "attempts" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "xp_ledger" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "chapter_progress" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "srs_cards" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "daily_activity" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "lesson_progress" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "reel_state" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "news_reads" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "user_settings" WHERE "user_id" = p."id")
  AND NOT EXISTS (SELECT 1 FROM "sessions" WHERE "user_id" = p."id");--> statement-breakpoint

-- ── Lockdown (every database): RLS on, nothing for anon / authenticated unless granted below ──────────────────
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE format('REVOKE ALL ON public.%I FROM authenticated', t);
    END IF;
  END LOOP;
END $$;
--> statement-breakpoint

-- ── Supabase only: per-request RLS for the `authenticated` role ────────────────────────────────────────────
-- The app connects as the table owner (bypasses RLS) and, for user requests, runs each transaction with
-- `set_config('role', 'authenticated', true)` + `request.jwt.claims` = { sub: <user id> }, so these policies
-- apply even if a query forgets its `where user_id = …`.
DO $$
DECLARE t text;
BEGIN
  IF to_regnamespace('auth') IS NULL
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
     OR to_regprocedure('auth.uid()') IS NULL THEN
    RAISE NOTICE 'No Supabase auth schema: RLS policies skipped (local PGlite / plain Postgres)';
    RETURN;
  END IF;

  -- The connection role must be allowed to SET ROLE authenticated (already true on Supabase for postgres).
  BEGIN
    EXECUTE format('GRANT authenticated TO %I', current_user);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'GRANT authenticated TO %: % (fine if already a member)', current_user, SQLERRM;
  END;

  GRANT USAGE ON SCHEMA public TO authenticated;

  FOREACH t IN ARRAY ARRAY['achievements', 'attempts', 'chapter_progress', 'daily_activity', 'daily_missions', 'lesson_progress',
                           'mistakes', 'news_reads', 'reel_state', 'sessions', 'srs_cards', 'task_state', 'user_settings', 'xp_ledger'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('DROP POLICY IF EXISTS own_rows ON public.%I', t);
    EXECUTE format('CREATE POLICY own_rows ON public.%I FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()))', t);
  END LOOP;
  GRANT USAGE, SELECT ON SEQUENCE public.attempts_id_seq, public.xp_ledger_id_seq TO authenticated;

  -- Profiles: read and edit your own; role / id / timestamps of creation are server-only (column grants).
  GRANT SELECT ON public.profiles TO authenticated;
  GRANT UPDATE ("display_name", "avatar_url", "locale", "onboarding", "preferences", "updated_at") ON public.profiles TO authenticated;
  DROP POLICY IF EXISTS own_profile_read ON public.profiles;
  CREATE POLICY own_profile_read ON public.profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS own_profile_update ON public.profiles;
  CREATE POLICY own_profile_update ON public.profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

  -- Shared content: read-only for signed-in users, written only by server/system code.
  FOREACH t IN ARRAY ARRAY['units', 'unit_aliases', 'news_items', 'generated_reels'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);
    EXECUTE format('DROP POLICY IF EXISTS read_all ON public.%I', t);
    EXECUTE format('CREATE POLICY read_all ON public.%I FOR SELECT TO authenticated USING (true)', t);
  END LOOP;

  -- Deleting a user in Supabase Auth deletes the profile, and ON DELETE CASCADE removes all progress.
  CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $fn$
  BEGIN
    DELETE FROM public.profiles WHERE id = OLD.id;
    RETURN OLD;
  END
  $fn$;
  REVOKE ALL ON FUNCTION public.handle_auth_user_deleted() FROM PUBLIC;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON FUNCTION public.handle_auth_user_deleted() FROM anon, authenticated;
  END IF;
  BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
    CREATE TRIGGER on_auth_user_deleted AFTER DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_deleted();
  EXCEPTION WHEN others THEN
    RAISE WARNING 'Trigger on auth.users not created (%). Delete profiles manually when deleting users.', SQLERRM;
  END;
END $$;
