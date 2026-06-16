ALTER TABLE "media" ADD COLUMN "slug" text;--> statement-breakpoint
CREATE INDEX "idx_media_slug" ON "media" ("slug");