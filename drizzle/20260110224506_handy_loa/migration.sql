CREATE TABLE "anime" (
	"id" integer PRIMARY KEY,
	"id_mal" integer,
	"background" varchar(255),
	"synonyms" text[],
	"description" text,
	"status" varchar(255),
	"type" varchar(255),
	"format" varchar(255),
	"updated_at" integer NOT NULL,
	"season" varchar(255),
	"season_year" integer,
	"episodes" integer,
	"duration" integer,
	"country_of_origin" varchar(255),
	"is_licensed" boolean,
	"source" varchar(255),
	"hashtag" varchar(255),
	"is_adult" boolean,
	"score" integer,
	"popularity" integer,
	"trending" integer,
	"favorites" integer,
	"color" varchar(255),
	"latest_airing_episode" integer,
	"next_airing_episode" integer,
	"last_airing_episode" integer
);
--> statement-breakpoint
CREATE TABLE "anime_airing_schedule" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"episode" integer,
	"airing_at" integer
);
--> statement-breakpoint
CREATE TABLE "anime_character" (
	"id" integer PRIMARY KEY
);
--> statement-breakpoint
CREATE TABLE "anime_character_edge" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"role" varchar(255)
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
CREATE TABLE "anime_end_date" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"day" integer,
	"month" integer,
	"year" integer
);
--> statement-breakpoint
CREATE TABLE "anime_external_link" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"url" varchar(255),
	"site" varchar(255),
	"site_id" integer,
	"type" varchar(255),
	"language" varchar(255),
	"color" varchar(255),
	"icon" varchar(255),
	"notes" varchar(255),
	"is_disabled" boolean
);
--> statement-breakpoint
CREATE TABLE "anime_genre" (
	"id" varchar(255) PRIMARY KEY,
	"name" varchar(255) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "anime_poster" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"large" varchar(255),
	"medium" varchar(255),
	"extra_large" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "anime_score_distribution" (
	"id" varchar(255) PRIMARY KEY,
	"score" integer NOT NULL,
	"amount" integer NOT NULL,
	"anime_id" integer NOT NULL
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
CREATE TABLE "anime_studio_edge" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"studio_id" integer NOT NULL,
	"is_main" boolean
);
--> statement-breakpoint
CREATE TABLE "anime_tag" (
	"id" integer PRIMARY KEY,
	"name" varchar(255) UNIQUE,
	"description" text,
	"category" varchar(255),
	"is_general_spoiler" boolean,
	"is_adult" boolean
);
--> statement-breakpoint
CREATE TABLE "anime_tag_edge" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"rank" integer,
	"is_media_spoiler" boolean
);
--> statement-breakpoint
CREATE TABLE "anime_title" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer,
	"romaji" varchar(255),
	"english" varchar(255),
	"native" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "_anime_genres" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_anime_genres_pkey" PRIMARY KEY("A","B")
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
CREATE TABLE "meta" (
	"id" integer PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"franchise" varchar(255),
	"rating" varchar(255),
	"episodes_aired" integer,
	"episodes_total" integer,
	"moreinfo" varchar(255),
	"broadcast" varchar(255),
	"nsfw" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_artwork" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"height" integer,
	"width" integer,
	"image" varchar(255),
	"iso_639_1" varchar(255),
	"thumbnail" varchar(255),
	"type" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_chronology" (
	"id" varchar(255) PRIMARY KEY,
	"parent_id" integer NOT NULL,
	"related_id" integer NOT NULL,
	"order" integer NOT NULL,
	"meta_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_description" (
	"id" varchar(255) PRIMARY KEY,
	"description" text NOT NULL,
	"source" varchar(255) NOT NULL,
	"language" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_image" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"small" varchar(255),
	"medium" varchar(255),
	"large" varchar(255),
	"type" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_mapping" (
	"id" varchar(255) PRIMARY KEY,
	"source_id" varchar(255) NOT NULL,
	"source_name" varchar(255) NOT NULL,
	"meta_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_screenshot" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"small" varchar(255),
	"medium" varchar(255),
	"large" varchar(255),
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_title" (
	"id" varchar(255) PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"language" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_meta_to_artwork" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_meta_to_artwork_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_meta_to_description" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_meta_to_description_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_meta_to_image" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_meta_to_image_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_meta_to_screenshot" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_meta_to_screenshot_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_meta_to_title" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_meta_to_title_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_meta_to_video" (
	"A" integer,
	"B" varchar(255),
	CONSTRAINT "_meta_to_video_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "meta_video" (
	"id" varchar(255) PRIMARY KEY,
	"url" varchar(255) NOT NULL,
	"title" varchar(255),
	"thumbnail" varchar(255),
	"artist" varchar(255),
	"type" varchar(255),
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tvdb_login" (
	"id" varchar(255) PRIMARY KEY,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expired" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "update_queue" (
	"id" varchar(255) PRIMARY KEY,
	"anime_id" integer NOT NULL UNIQUE,
	"mal_id" integer,
	"priority" varchar(255) NOT NULL,
	"reason" varchar(255) NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "score_distribution_unique" ON "anime_score_distribution" ("anime_id","score");--> statement-breakpoint
CREATE UNIQUE INDEX "status_distribution_unique" ON "anime_status_distribution" ("anime_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_tag_unique" ON "anime_tag_edge" ("anime_id","tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "artwork_unique" ON "meta_artwork" ("url","type","source");--> statement-breakpoint
CREATE UNIQUE INDEX "chronology_unique" ON "meta_chronology" ("parent_id","related_id");--> statement-breakpoint
CREATE UNIQUE INDEX "description_unique" ON "meta_description" ("description","source","language");--> statement-breakpoint
CREATE UNIQUE INDEX "image_unique" ON "meta_image" ("url","type","source");--> statement-breakpoint
CREATE UNIQUE INDEX "mapping_source_unique" ON "meta_mapping" ("source_id","source_name");--> statement-breakpoint
CREATE UNIQUE INDEX "screenshot_unique" ON "meta_screenshot" ("url","source");--> statement-breakpoint
CREATE UNIQUE INDEX "title_unique" ON "meta_title" ("title","source","language");--> statement-breakpoint
CREATE UNIQUE INDEX "video_unique" ON "meta_video" ("url","source");--> statement-breakpoint
CREATE INDEX "update_queue_priority_added_at_idx" ON "update_queue" ("priority","added_at");--> statement-breakpoint
CREATE INDEX "update_queue_anime_id_idx" ON "update_queue" ("anime_id");--> statement-breakpoint
ALTER TABLE "anime_airing_schedule" ADD CONSTRAINT "anime_airing_schedule_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id");--> statement-breakpoint
ALTER TABLE "anime_character_edge" ADD CONSTRAINT "anime_character_edge_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_character_edge" ADD CONSTRAINT "anime_character_edge_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_character_image" ADD CONSTRAINT "anime_character_image_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_character_name" ADD CONSTRAINT "anime_character_name_character_id_anime_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "anime_character"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_end_date" ADD CONSTRAINT "anime_end_date_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_external_link" ADD CONSTRAINT "anime_external_link_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id");--> statement-breakpoint
ALTER TABLE "anime_poster" ADD CONSTRAINT "anime_poster_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_score_distribution" ADD CONSTRAINT "anime_score_distribution_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_start_date" ADD CONSTRAINT "anime_start_date_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_status_distribution" ADD CONSTRAINT "anime_status_distribution_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_studio_edge" ADD CONSTRAINT "anime_studio_edge_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_studio_edge" ADD CONSTRAINT "anime_studio_edge_studio_id_anime_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "anime_studio"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_tag_edge" ADD CONSTRAINT "anime_tag_edge_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_tag_edge" ADD CONSTRAINT "anime_tag_edge_tag_id_anime_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "anime_tag"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_genres" ADD CONSTRAINT "_anime_genres_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id");--> statement-breakpoint
ALTER TABLE "_anime_genres" ADD CONSTRAINT "_anime_genres_B_anime_genre_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_genre"("id");--> statement-breakpoint
ALTER TABLE "anime_voice_image" ADD CONSTRAINT "anime_voice_image_voice_actor_id_anime_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "anime_voice_name" ADD CONSTRAINT "anime_voice_name_voice_actor_id_anime_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "anime_voice_actor"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_character_to_voice_actor" ADD CONSTRAINT "_character_to_voice_actor_A_anime_character_edge_id_fkey" FOREIGN KEY ("A") REFERENCES "anime_character_edge"("id");--> statement-breakpoint
ALTER TABLE "_character_to_voice_actor" ADD CONSTRAINT "_character_to_voice_actor_B_anime_voice_actor_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_voice_actor"("id");--> statement-breakpoint
ALTER TABLE "api_key_usage" ADD CONSTRAINT "api_key_usage_api_key_id_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meta" ADD CONSTRAINT "meta_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meta_chronology" ADD CONSTRAINT "meta_chronology_meta_id_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meta_mapping" ADD CONSTRAINT "meta_mapping_meta_id_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_meta_to_artwork" ADD CONSTRAINT "_meta_to_artwork_A_meta_id_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_artwork" ADD CONSTRAINT "_meta_to_artwork_B_meta_artwork_id_fkey" FOREIGN KEY ("B") REFERENCES "meta_artwork"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_description" ADD CONSTRAINT "_meta_to_description_A_meta_id_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_description" ADD CONSTRAINT "_meta_to_description_B_meta_description_id_fkey" FOREIGN KEY ("B") REFERENCES "meta_description"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_image" ADD CONSTRAINT "_meta_to_image_A_meta_id_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_image" ADD CONSTRAINT "_meta_to_image_B_meta_image_id_fkey" FOREIGN KEY ("B") REFERENCES "meta_image"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_screenshot" ADD CONSTRAINT "_meta_to_screenshot_A_meta_id_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_screenshot" ADD CONSTRAINT "_meta_to_screenshot_B_meta_screenshot_id_fkey" FOREIGN KEY ("B") REFERENCES "meta_screenshot"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_title" ADD CONSTRAINT "_meta_to_title_A_meta_id_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_title" ADD CONSTRAINT "_meta_to_title_B_meta_title_id_fkey" FOREIGN KEY ("B") REFERENCES "meta_title"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_video" ADD CONSTRAINT "_meta_to_video_A_meta_id_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id");--> statement-breakpoint
ALTER TABLE "_meta_to_video" ADD CONSTRAINT "_meta_to_video_B_meta_video_id_fkey" FOREIGN KEY ("B") REFERENCES "meta_video"("id");