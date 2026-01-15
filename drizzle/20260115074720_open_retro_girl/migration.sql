DROP INDEX "update_queue_priority_added_at_idx";--> statement-breakpoint
ALTER TABLE "update_queue" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "update_queue" DROP COLUMN "reason";