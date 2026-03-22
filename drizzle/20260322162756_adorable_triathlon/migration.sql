CREATE TABLE "anime_character_birth_date" (
	"id" varchar(255) PRIMARY KEY,
	"day" integer,
	"month" integer,
	"year" integer,
	"character_id" integer UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_voice_birth_date" (
	"id" varchar(255) PRIMARY KEY,
	"day" integer,
	"month" integer,
	"year" integer,
	"character_id" integer UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_voice_death_date" (
	"id" varchar(255) PRIMARY KEY,
	"day" integer,
	"month" integer,
	"year" integer,
	"character_id" integer UNIQUE
);
--> statement-breakpoint
ALTER TABLE "anime_character" ADD COLUMN "age" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_character" ADD COLUMN "blood_type" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_character" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "anime_character" ADD COLUMN "gender" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_character_name" ADD COLUMN "first" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_character_name" ADD COLUMN "middle" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_character_name" ADD COLUMN "last" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_character_name" ADD COLUMN "alternative_spoiler" text[];--> statement-breakpoint
ALTER TABLE "anime_voice_actor" ADD COLUMN "age" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_voice_actor" ADD COLUMN "blood_type" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_voice_actor" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "anime_voice_actor" ADD COLUMN "gender" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_voice_actor" ADD COLUMN "home_town" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_voice_name" ADD COLUMN "first" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_voice_name" ADD COLUMN "middle" varchar(255);--> statement-breakpoint
ALTER TABLE "anime_voice_name" ADD COLUMN "last" varchar(255);--> statement-breakpoint
CREATE INDEX "idx_anime_character_birth_date_character_id" ON "anime_character_birth_date" ("character_id");--> statement-breakpoint
CREATE INDEX "idx_anime_voice_birth_date_voice_actor_id" ON "anime_voice_birth_date" ("character_id");--> statement-breakpoint
CREATE INDEX "idx_anime_voice_death_date_voice_actor_id" ON "anime_voice_death_date" ("character_id");--> statement-breakpoint
ALTER TABLE "anime_character_birth_date" ADD CONSTRAINT "anime_character_birth_date_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_voice_birth_date" ADD CONSTRAINT "anime_voice_birth_date_character_id_anime_voice_actor_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_voice_death_date" ADD CONSTRAINT "anime_voice_death_date_character_id_anime_voice_actor_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;