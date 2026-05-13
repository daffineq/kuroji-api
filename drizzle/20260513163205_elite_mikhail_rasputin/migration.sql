CREATE TABLE "anime_age_rating" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"rating" varchar(255),
	"description" varchar(255),
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE TABLE "anime_broadcast" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"week" integer,
	"time" varchar(255),
	"timezone" varchar(255),
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
ALTER TABLE "anime" RENAME COLUMN "moreinfo" TO "more_info";--> statement-breakpoint
ALTER TABLE "anime" DROP COLUMN "age_rating";--> statement-breakpoint
ALTER TABLE "anime" DROP COLUMN "broadcast";--> statement-breakpoint
ALTER TABLE "anime" DROP COLUMN "nsfw";--> statement-breakpoint
CREATE INDEX "idx_anime_age_rating_anime_id" ON "anime_age_rating" ("anime_id");--> statement-breakpoint
CREATE INDEX "idx_anime_age_rating_rating" ON "anime_age_rating" ("rating");--> statement-breakpoint
CREATE INDEX "idx_anime_broadcast_anime_id" ON "anime_broadcast" ("anime_id");--> statement-breakpoint
CREATE INDEX "idx_anime_broadcast_week" ON "anime_broadcast" ("week");--> statement-breakpoint
ALTER TABLE "anime_age_rating" ADD CONSTRAINT "anime_age_rating_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_broadcast" ADD CONSTRAINT "anime_broadcast_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;