-- Performance indexes (docs/PERFORMANCE.md): per-kind counts of a learner's answers as index-only scans, a session's
-- answers, and the per-source daily XP cap lookup on every grant.
CREATE INDEX "attempts_user_kind_outcome_idx" ON "attempts" USING btree ("user_id","kind","outcome");--> statement-breakpoint
CREATE INDEX "attempts_user_session_idx" ON "attempts" USING btree ("user_id","session_id") WHERE "attempts"."session_id" is not null;--> statement-breakpoint
CREATE INDEX "xp_user_reason_day_idx" ON "xp_ledger" USING btree ("user_id","reason","day");