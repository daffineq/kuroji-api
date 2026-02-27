CREATE TABLE "anime" (
	"id" integer PRIMARY KEY,
	"id_mal" integer,
	"background" varchar(255),
	"description" text,
	"status" varchar(255),
	"type" varchar(255),
	"format" varchar(255),
	"updated_at" integer,
	"season" varchar(255),
	"season_year" integer,
	"duration" integer,
	"country" varchar(255),
	"is_licensed" boolean DEFAULT false,
	"source" varchar(255),
	"hashtag" varchar(255),
	"is_adult" boolean DEFAULT false,
	"score" integer,
	"popularity" integer,
	"trending" integer,
	"favorites" integer,
	"color" varchar(255),
	"franchise" varchar(255),
	"age_rating" varchar(255),
	"episodes_aired" integer,
	"episodes_total" integer,
	"moreinfo" varchar(255),
	"broadcast" varchar(255),
	"nsfw" boolean DEFAULT false,
	"latest_airing_episode" integer,
	"next_airing_episode" integer,
	"last_airing_episode" integer,
	"auto_update" boolean DEFAULT true,
	"disabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "anime_airing_schedule" (
	"id" integer PRIMARY KEY,
	"episode" integer,
	"airing_at" integer
);
--> statement-breakpoint
CREATE TABLE "anime_artwork" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"height" integer,
	"width" integer,
	"large" varchar(255),
	"medium" varchar(255),
	"iso_639_1" varchar(255),
	"type" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_character" (
	"id" integer PRIMARY KEY
);
--> statement-breakpoint
CREATE TABLE "anime_character_image" (
	"id" varchar(255) PRIMARY KEY,
	"large" varchar(255),
	"medium" varchar(255),
	"character_id" integer UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_character_name" (
	"id" varchar(255) PRIMARY KEY,
	"full" varchar(255),
	"native" varchar(255),
	"alternative" text[],
	"character_id" integer UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_chronology" (
	"id" varchar(255) PRIMARY KEY,
	"parent_id" integer NOT NULL,
	"related_id" integer NOT NULL,
	"order" integer NOT NULL,
	"anime_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_end_date" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"day" integer,
	"month" integer,
	"year" integer
);
--> statement-breakpoint
CREATE TABLE "anime_genre" (
	"id" varchar(255) PRIMARY KEY,
	"name" varchar(255) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_image" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"small" varchar(255),
	"medium" varchar(255),
	"large" varchar(255),
	"type" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_link" (
	"id" varchar(255) PRIMARY KEY,
	"source_link" varchar(255) NOT NULL,
	"source_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_other_description" (
	"id" varchar(255) PRIMARY KEY,
	"description" text NOT NULL,
	"source" varchar(255) NOT NULL,
	"language" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_other_title" (
	"id" varchar(255) PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"language" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_poster" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"small" varchar(255),
	"medium" varchar(255),
	"large" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "anime_recommendation" (
	"id" varchar(255) PRIMARY KEY,
	"parent_id" integer NOT NULL,
	"related_id" integer NOT NULL,
	"order" integer NOT NULL,
	"anime_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_score_distribution" (
	"id" varchar(255) PRIMARY KEY,
	"score" integer NOT NULL,
	"amount" integer NOT NULL,
	"anime_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_screenshot" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"order" integer NOT NULL,
	"small" varchar(255),
	"medium" varchar(255),
	"large" varchar(255),
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_start_date" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"day" integer,
	"month" integer,
	"year" integer
);
--> statement-breakpoint
CREATE TABLE "anime_status_distribution" (
	"id" varchar(255) PRIMARY KEY,
	"status" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"anime_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_studio" (
	"id" integer PRIMARY KEY,
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "anime_tag" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) UNIQUE,
	"description" text,
	"category" varchar(255),
	"is_adult" boolean
);
--> statement-breakpoint
CREATE TABLE "anime_title" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"romaji" varchar(255),
	"english" varchar(255),
	"native" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "_anime_to_airing_schedule" (
	"A" integer,
	"B" integer,
	CONSTRAINT "_anime_to_airing_schedule_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_artwork" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_artwork_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_character" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"role" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "_anime_to_genre" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_genre_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_image" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_image_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_link" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_link_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_other_description" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_other_description_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_other_title" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_other_title_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_screenshot" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_screenshot_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_anime_to_studio" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"studio_id" integer NOT NULL,
	"is_main" boolean
);
--> statement-breakpoint
CREATE TABLE "_anime_to_tag" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"rank" integer,
	"is_spoiler" boolean
);
--> statement-breakpoint
CREATE TABLE "_anime_to_video" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_to_video_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "anime_video" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"title" varchar(255),
	"thumbnail" varchar(255),
	"artist" varchar(255),
	"type" varchar(255),
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anime_voice_actor" (
	"id" integer PRIMARY KEY,
	"language" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "anime_voice_image" (
	"id" varchar(255) PRIMARY KEY,
	"large" varchar(255),
	"medium" varchar(255),
	"voice_actor_id" integer UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_voice_name" (
	"id" varchar(255) PRIMARY KEY,
	"full" varchar(255),
	"native" varchar(255),
	"alternative" text[],
	"voice_actor_id" integer UNIQUE
);
--> statement-breakpoint
CREATE TABLE "_character_to_voice_actor" (
	"A" integer,
	"B" integer,
	CONSTRAINT "_character_to_voice_actor_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" varchar(255) PRIMARY KEY,
	"key" varchar(255) NOT NULL UNIQUE,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_key_usage" (
	"id" varchar(255) PRIMARY KEY,
	"api_key_id" varchar(255) NOT NULL,
	"endpoint" varchar(255) NOT NULL,
	"method" varchar(255) NOT NULL,
	"origin" varchar(255),
	"user_agent" varchar(255),
	"ip" varchar(255),
	"used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indexer_state" (
	"id" varchar(255) PRIMARY KEY,
	"last_page" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tvdb_login" (
	"id" varchar(255) PRIMARY KEY,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expired" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "update_queue" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"mal_id" integer,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "anime_artwork_unique" ON "anime_artwork" ("url","type","source");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_chronology_unique" ON "anime_chronology" ("parent_id","related_id");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_image_unique" ON "anime_image" ("url","type","source");--> statement-breakpoint
CREATE UNIQUE INDEX "link_unique" ON "anime_link" ("source_link","source_name");--> statement-breakpoint
CREATE UNIQUE INDEX "other_description_unique" ON "anime_other_description" ("description","source","language");--> statement-breakpoint
CREATE UNIQUE INDEX "other_title_unique" ON "anime_other_title" ("title","source","language");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_recommendation_unique" ON "anime_recommendation" ("parent_id","related_id");--> statement-breakpoint
CREATE UNIQUE INDEX "score_distribution_unique" ON "anime_score_distribution" ("anime_id","score");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_screenshot_unique" ON "anime_screenshot" ("url","source");--> statement-breakpoint
CREATE UNIQUE INDEX "status_distribution_unique" ON "anime_status_distribution" ("anime_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_tag_unique" ON "_anime_to_tag" ("anime_id","tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_video_unique" ON "anime_video" ("url","source");--> statement-breakpoint
CREATE INDEX "update_queue_anime_id_idx" ON "update_queue" ("anime_id");--> statement-breakpoint
ALTER TABLE "anime_character_image" ADD CONSTRAINT "anime_character_image_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_character_name" ADD CONSTRAINT "anime_character_name_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_chronology" ADD CONSTRAINT "anime_chronology_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_end_date" ADD CONSTRAINT "anime_end_date_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_poster" ADD CONSTRAINT "anime_poster_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_recommendation" ADD CONSTRAINT "anime_recommendation_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_score_distribution" ADD CONSTRAINT "anime_score_distribution_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_start_date" ADD CONSTRAINT "anime_start_date_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_status_distribution" ADD CONSTRAINT "anime_status_distribution_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_title" ADD CONSTRAINT "anime_title_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_airing_schedule" ADD CONSTRAINT "_anime_to_airing_schedule_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_airing_schedule" ADD CONSTRAINT "_anime_to_airing_schedule_B_anime_airing_schedule_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_airing_schedule"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_artwork" ADD CONSTRAINT "_anime_to_artwork_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_artwork" ADD CONSTRAINT "_anime_to_artwork_B_anime_artwork_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_artwork"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_character" ADD CONSTRAINT "_anime_to_character_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_character" ADD CONSTRAINT "_anime_to_character_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_genre" ADD CONSTRAINT "_anime_to_genre_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_genre" ADD CONSTRAINT "_anime_to_genre_B_anime_genre_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_genre"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_image" ADD CONSTRAINT "_anime_to_image_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_image" ADD CONSTRAINT "_anime_to_image_B_anime_image_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_image"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_link" ADD CONSTRAINT "_anime_to_link_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_link" ADD CONSTRAINT "_anime_to_link_B_anime_link_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_link"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_other_description" ADD CONSTRAINT "_anime_to_other_description_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_other_description" ADD CONSTRAINT "_anime_to_other_description_B_anime_other_description_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_other_description"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_other_title" ADD CONSTRAINT "_anime_to_other_title_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_other_title" ADD CONSTRAINT "_anime_to_other_title_B_anime_other_title_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_other_title"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_screenshot" ADD CONSTRAINT "_anime_to_screenshot_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_screenshot" ADD CONSTRAINT "_anime_to_screenshot_B_anime_screenshot_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_screenshot"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_studio" ADD CONSTRAINT "_anime_to_studio_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_studio" ADD CONSTRAINT "_anime_to_studio_studio_id_anime_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "anime_studio"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_tag" ADD CONSTRAINT "_anime_to_tag_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_tag" ADD CONSTRAINT "_anime_to_tag_tag_id_anime_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "anime_tag"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_video" ADD CONSTRAINT "_anime_to_video_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_video" ADD CONSTRAINT "_anime_to_video_B_anime_video_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_video"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_voice_image" ADD CONSTRAINT "anime_voice_image_voice_actor_id_anime_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_voice_name" ADD CONSTRAINT "anime_voice_name_voice_actor_id_anime_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_character_to_voice_actor" ADD CONSTRAINT "_character_to_voice_actor_A__anime_to_character_id_fkey" FOREIGN KEY ("A") REFERENCES "_anime_to_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_character_to_voice_actor" ADD CONSTRAINT "_character_to_voice_actor_B_anime_voice_actor_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_key_usage" ADD CONSTRAINT "api_key_usage_api_key_id_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE CASCADE;