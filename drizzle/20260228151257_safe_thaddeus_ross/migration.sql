ALTER TABLE "anime_artwork" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anime_image" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anime_link" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anime_other_description" ALTER COLUMN "language" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anime_other_title" ALTER COLUMN "language" DROP NOT NULL;--> statement-breakpoint
DROP INDEX "anime_artwork_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "anime_artwork_unique" ON "anime_artwork" ("url","source");--> statement-breakpoint
DROP INDEX "anime_image_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "anime_image_unique" ON "anime_image" ("url","source");--> statement-breakpoint
DROP INDEX "link_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "link_unique" ON "anime_link" ("link","label");--> statement-breakpoint
DROP INDEX "other_description_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "other_description_unique" ON "anime_other_description" ("description","source");--> statement-breakpoint
DROP INDEX "other_title_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "other_title_unique" ON "anime_other_title" ("title","source");