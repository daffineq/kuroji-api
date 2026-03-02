ALTER TABLE "anime_link" ADD COLUMN "type" varchar(255) NOT NULL;--> statement-breakpoint
DROP INDEX "link_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "link_unique" ON "anime_link" ("source_link","source_name","type");