-- Phase 3: course platform (docs/ARCHITECTURE.md §5, docs/ROADMAP.md «Фаза 3»).
-- * enrollments: courses in a learner's library (level, placement result, exactly one active per user).
-- * topic_results / exam_results: topic tests (🏁) and section exams (👑), graded on the server.
-- * lesson_progress.course_id: course lessons get new ids `<course>:<section>:<topic>:<kind>-<n>`. Old rows
--   (`<chapterId>::<kind>-<n>`) are carried over lazily and idempotently on the learner's next visit
--   (src/server/courses/legacy.ts) — the old→new map comes from the compiled bundle, which SQL can't see.
-- * Supabase only (guarded like 0005, so this also runs on PGlite): RLS `user_id = auth.uid()` + grants.

CREATE TABLE "enrollments" (
	"user_id" uuid NOT NULL,
	"course_id" text NOT NULL,
	"source" text DEFAULT 'official' NOT NULL,
	"level" text DEFAULT 'noob' NOT NULL,
	"placement" jsonb,
	"active" boolean DEFAULT false NOT NULL,
	"enrolled_at" bigint NOT NULL,
	"last_opened_at" bigint NOT NULL,
	CONSTRAINT "enrollments_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "exam_results" (
	"user_id" uuid NOT NULL,
	"exam_id" text NOT NULL,
	"course_id" text NOT NULL,
	"section_id" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"graded" integer DEFAULT 0 NOT NULL,
	"last_seed" text,
	"last_score" double precision,
	"best_score" double precision DEFAULT 0 NOT NULL,
	"passed_at" bigint,
	"test_out" boolean DEFAULT false NOT NULL,
	"updated_at" bigint NOT NULL,
	CONSTRAINT "exam_results_user_id_exam_id_pk" PRIMARY KEY("user_id","exam_id")
);
--> statement-breakpoint
CREATE TABLE "topic_results" (
	"user_id" uuid NOT NULL,
	"test_id" text NOT NULL,
	"course_id" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"graded" integer DEFAULT 0 NOT NULL,
	"last_seed" text,
	"last_score" double precision,
	"best_score" double precision DEFAULT 0 NOT NULL,
	"passed_at" bigint,
	"updated_at" bigint NOT NULL,
	CONSTRAINT "topic_results_user_id_test_id_pk" PRIMARY KEY("user_id","test_id")
);
--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD COLUMN "course_id" text;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_results" ADD CONSTRAINT "topic_results_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_one_active_idx" ON "enrollments" USING btree ("user_id") WHERE "enrollments"."active";--> statement-breakpoint
CREATE INDEX "exam_results_user_course_idx" ON "exam_results" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "topic_results_user_course_idx" ON "topic_results" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "lesson_user_course_idx" ON "lesson_progress" USING btree ("user_id","course_id");--> statement-breakpoint

-- ── Lockdown (every database): RLS on for the new tables ────────────────────────────────────────────────────
ALTER TABLE "enrollments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "topic_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exam_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- ── Supabase only: per-request RLS for the `authenticated` role (same pattern as 0005) ────────────────────────
DO $$
DECLARE t text;
BEGIN
  IF to_regnamespace('auth') IS NULL
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
     OR to_regprocedure('auth.uid()') IS NULL THEN
    RAISE NOTICE 'No Supabase auth schema: RLS policies skipped (local PGlite / plain Postgres)';
    RETURN;
  END IF;
  FOREACH t IN ARRAY ARRAY['enrollments', 'topic_results', 'exam_results'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    END IF;
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('DROP POLICY IF EXISTS own_rows ON public.%I', t);
    EXECUTE format('CREATE POLICY own_rows ON public.%I FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()))', t);
  END LOOP;
END $$;
