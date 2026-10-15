CREATE TABLE "generated_reels" (
	"id" text PRIMARY KEY NOT NULL,
	"emoji" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"topic" text NOT NULL,
	"guide_id" text,
	"chapter_id" text,
	"source_url" text,
	"source_title" text,
	"model" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"lesson_id" text PRIMARY KEY NOT NULL,
	"guide_id" text NOT NULL,
	"chapter_id" text NOT NULL,
	"completions" integer DEFAULT 0 NOT NULL,
	"best_accuracy" double precision DEFAULT 0 NOT NULL,
	"last_xp" integer DEFAULT 0 NOT NULL,
	"first_completed_at" bigint,
	"last_completed_at" bigint
);
--> statement-breakpoint
CREATE INDEX "generated_reels_created_idx" ON "generated_reels" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lesson_chapter_idx" ON "lesson_progress" USING btree ("chapter_id");