CREATE TABLE "anime_last_airing_episode" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"episode" integer,
	"airing_at" integer,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE TABLE "anime_latest_airing_episode" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"episode" integer,
	"airing_at" integer,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE TABLE "anime_next_airing_episode" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"episode" integer,
	"airing_at" integer,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
DROP TABLE "_anime_to_airing_schedule";--> statement-breakpoint
DROP INDEX "idx_anime_next_airing_episode";--> statement-breakpoint
DELETE FROM "anime_airing_schedule";--> statement-breakpoint
ALTER TABLE "anime_airing_schedule" ADD COLUMN "anime_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "anime" DROP COLUMN "latest_airing_episode";--> statement-breakpoint
ALTER TABLE "anime" DROP COLUMN "next_airing_episode";--> statement-breakpoint
ALTER TABLE "anime" DROP COLUMN "last_airing_episode";--> statement-breakpoint
ALTER TABLE "anime_airing_schedule" ALTER COLUMN "id" SET DATA TYPE varchar(255) USING "id"::varchar(255);--> statement-breakpoint
CREATE UNIQUE INDEX "anime_airing_schedule_unique" ON "anime_airing_schedule" ("anime_id","episode");--> statement-breakpoint
CREATE INDEX "idx_anime_airing_schedule_anime_id" ON "anime_airing_schedule" ("anime_id");--> statement-breakpoint
ALTER TABLE "anime_airing_schedule" ADD CONSTRAINT "anime_airing_schedule_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_last_airing_episode" ADD CONSTRAINT "anime_last_airing_episode_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_latest_airing_episode" ADD CONSTRAINT "anime_latest_airing_episode_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_next_airing_episode" ADD CONSTRAINT "anime_next_airing_episode_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;
