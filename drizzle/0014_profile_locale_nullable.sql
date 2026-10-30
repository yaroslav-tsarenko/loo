ALTER TABLE "profiles" ALTER COLUMN "locale" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "locale" DROP NOT NULL;--> statement-breakpoint
-- UI locale (src/i18n, docs/NEXTJS_SYLLABUS.md §8): NULL = not chosen → uk. Until now 'uk' was the only value (a
-- default nobody picked), so it becomes «not chosen»; the learner's UPDATE column grant on locale (0005) is unchanged.
UPDATE "profiles" SET "locale" = NULL WHERE "locale" = 'uk';
