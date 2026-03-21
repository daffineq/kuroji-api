CREATE TABLE "anime_episode" (
	"id" varchar(255) PRIMARY KEY,
	"title" varchar(255),
	"number" integer NOT NULL,
	"air_date" varchar(255),
	"runtime" integer,
	"overview" text,
	"anime_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_episode_image" (
	"id" varchar(255) PRIMARY KEY,
	"small" varchar(255),
	"medium" varchar(255),
	"large" varchar(255),
	"episode_id" varchar(255) UNIQUE
);
--> statement-breakpoint
CREATE UNIQUE INDEX "anime_episode_unique" ON "anime_episode" ("anime_id","number");--> statement-breakpoint
CREATE INDEX "idx_anime_episode_anime_id" ON "anime_episode" ("anime_id");--> statement-breakpoint
CREATE INDEX "idx_anime_episode_image_episode_id" ON "anime_episode_image" ("episode_id");--> statement-breakpoint
ALTER TABLE "anime_episode" ADD CONSTRAINT "anime_episode_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_episode_image" ADD CONSTRAINT "anime_episode_image_episode_id_anime_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "anime_episode"("id") ON DELETE CASCADE;