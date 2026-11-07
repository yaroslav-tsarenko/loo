ALTER TABLE "exam_results" ADD COLUMN "attempt_started_at" bigint;--> statement-breakpoint
ALTER TABLE "topic_results" ADD COLUMN "attempt_started_at" bigint;--> statement-breakpoint

-- ── Supabase only: the app's own database role for learner requests (docs/SECURITY.md §4.2) ────────────────
-- Until now every learner transaction ran as `authenticated` — the same role Supabase's Data API (PostgREST) assumes
-- for any signed-in user's JWT. With the Data API on, a learner could call it with their own token and write their
-- own rows directly: mint XP, bucks or gems, refill hearts, edit league results. Disabling the Data API in the
-- dashboard was the only guard.
--
-- Now the app switches to `levelup_learner` (NOLOGIN; only the app's connection role is a member, PostgREST's
-- `authenticator` is not), every policy written for `authenticated` moves to it, and `anon` / `authenticated` lose
-- every privilege on public tables and sequences — the Data API sees nothing, on or off.
--
-- Same privileges as before, same policies (auth.uid() → public.levelup_uid(), which reads the same claims and
-- doesn't need the auth schema). New tables: grant to levelup_learner and write policies `TO levelup_learner`.
--
-- Deploy note: the previous app version still sets role `authenticated`; between this migration (start of the
-- Vercel build) and the promotion of the new build its database calls fail. Deploy when traffic is low.
DO $$
DECLARE
  r record;
  using_sql text;
  check_sql text;
BEGIN
  IF to_regnamespace('auth') IS NULL
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
     OR to_regprocedure('auth.uid()') IS NULL THEN
    RAISE NOTICE 'No Supabase auth schema: app role skipped (local PGlite / plain Postgres)';
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'levelup_learner') THEN
    CREATE ROLE levelup_learner NOLOGIN;
  END IF;
  -- the connection role must be able to SET ROLE levelup_learner
  BEGIN
    EXECUTE format('GRANT levelup_learner TO %I', current_user);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'GRANT levelup_learner TO %: % (fine if already a member)', current_user, SQLERRM;
  END;

  CREATE OR REPLACE FUNCTION public.levelup_uid() RETURNS uuid
    LANGUAGE sql STABLE SET search_path = '' AS
    $fn$ SELECT nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid $fn$;
  GRANT USAGE ON SCHEMA public TO levelup_learner;
  GRANT EXECUTE ON FUNCTION public.levelup_uid() TO levelup_learner;

  -- 1. copy what `authenticated` may do: table-level grants…
  FOR r IN
    SELECT DISTINCT table_name, privilege_type FROM information_schema.role_table_grants
    WHERE grantee = 'authenticated' AND table_schema = 'public'
      AND privilege_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
  LOOP
    EXECUTE format('GRANT %s ON public.%I TO levelup_learner', r.privilege_type, r.table_name);
  END LOOP;
  -- …column-level grants (profiles: the learner edits a few columns only)…
  FOR r IN
    SELECT c.table_name, c.column_name, c.privilege_type FROM information_schema.column_privileges c
    WHERE c.grantee = 'authenticated' AND c.table_schema = 'public'
      AND c.privilege_type IN ('SELECT', 'INSERT', 'UPDATE')
      AND NOT EXISTS (
        SELECT 1 FROM information_schema.role_table_grants t
        WHERE t.grantee = 'authenticated' AND t.table_schema = 'public' AND t.table_name = c.table_name AND t.privilege_type = c.privilege_type
      )
  LOOP
    EXECUTE format('GRANT %s (%I) ON public.%I TO levelup_learner', r.privilege_type, r.column_name, r.table_name);
  END LOOP;
  -- …and sequences (identity ids of attempts and the ledgers)
  FOR r IN
    SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'S'
      AND CASE WHEN c.relkind = 'S' THEN has_sequence_privilege('authenticated', c.oid, 'USAGE') ELSE false END
  LOOP
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE public.%I TO levelup_learner', r.relname);
  END LOOP;

  -- 2. move every policy of `authenticated` to the app role
  FOR r IN SELECT * FROM pg_policies WHERE schemaname = 'public' AND 'authenticated' = ANY (roles) LOOP
    using_sql := CASE WHEN r.qual IS NULL THEN '' ELSE format(' USING (%s)', replace(r.qual, 'auth.uid()', 'public.levelup_uid()')) END;
    check_sql := CASE WHEN r.with_check IS NULL THEN '' ELSE format(' WITH CHECK (%s)', replace(r.with_check, 'auth.uid()', 'public.levelup_uid()')) END;
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
    EXECUTE format('CREATE POLICY %I ON public.%I AS %s FOR %s TO levelup_learner%s%s', r.policyname, r.tablename, r.permissive, r.cmd, using_sql, check_sql);
  END LOOP;

  -- 3. the Data API roles lose everything in public, now and for tables created later by this role
  REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
  REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
  EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated', current_user);
  EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated', current_user);
END $$;
