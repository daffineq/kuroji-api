CREATE TABLE "media_embedding" (
	"id" varchar(255) PRIMARY KEY,
	"media_id" integer NOT NULL UNIQUE,
	"embedding" vector(1536),
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE TABLE "media_local_score_distribution" (
	"id" varchar(255) PRIMARY KEY,
	"score" integer NOT NULL,
	"amount" integer NOT NULL,
	"media_id" integer NOT NULL,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE TABLE "media_local_status_distribution" (
	"id" varchar(255) PRIMARY KEY,
	"status" integer NOT NULL,
	"amount" integer NOT NULL,
	"media_id" integer NOT NULL,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE TABLE "media_statistic" (
	"id" varchar(255) PRIMARY KEY,
	"media_id" integer NOT NULL,
	"views_count" integer DEFAULT 0,
	"record_date" date DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "anime" RENAME TO "media";--> statement-breakpoint
ALTER TABLE "anime_age_rating" RENAME TO "media_age_rating";--> statement-breakpoint
ALTER TABLE "anime_airing_schedule" RENAME TO "media_airing_schedule";--> statement-breakpoint
ALTER TABLE "anime_other_description" RENAME TO "media_alt_description";--> statement-breakpoint
ALTER TABLE "anime_other_title" RENAME TO "media_alt_title";--> statement-breakpoint
ALTER TABLE "anime_artwork" RENAME TO "media_artwork";--> statement-breakpoint
ALTER TABLE "anime_broadcast" RENAME TO "media_broadcast";--> statement-breakpoint
ALTER TABLE "anime_character" RENAME TO "media_character";--> statement-breakpoint
ALTER TABLE "anime_character_birth_date" RENAME TO "media_character_birth_date";--> statement-breakpoint
ALTER TABLE "anime_character_image" RENAME TO "media_character_image";--> statement-breakpoint
ALTER TABLE "anime_character_name" RENAME TO "media_character_name";--> statement-breakpoint
ALTER TABLE "anime_chronology" RENAME TO "media_chronology";--> statement-breakpoint
ALTER TABLE "anime_end_date" RENAME TO "media_end_date";--> statement-breakpoint
ALTER TABLE "anime_episode" RENAME TO "media_episode";--> statement-breakpoint
ALTER TABLE "anime_episode_image" RENAME TO "media_episode_image";--> statement-breakpoint
ALTER TABLE "anime_genre" RENAME TO "media_genre";--> statement-breakpoint
ALTER TABLE "anime_image" RENAME TO "media_image";--> statement-breakpoint
ALTER TABLE "anime_last_airing_episode" RENAME TO "media_last_airing_episode";--> statement-breakpoint
ALTER TABLE "anime_latest_airing_episode" RENAME TO "media_latest_airing_episode";--> statement-breakpoint
ALTER TABLE "anime_link" RENAME TO "media_link";--> statement-breakpoint
ALTER TABLE "anime_next_airing_episode" RENAME TO "media_next_airing_episode";--> statement-breakpoint
ALTER TABLE "anime_poster" RENAME TO "media_poster";--> statement-breakpoint
ALTER TABLE "anime_recommendation" RENAME TO "media_recommendation";--> statement-breakpoint
ALTER TABLE "anime_score_distribution" RENAME TO "media_score_distribution";--> statement-breakpoint
ALTER TABLE "anime_screenshot" RENAME TO "media_screenshot";--> statement-breakpoint
ALTER TABLE "anime_start_date" RENAME TO "media_start_date";--> statement-breakpoint
ALTER TABLE "anime_status_distribution" RENAME TO "media_status_distribution";--> statement-breakpoint
ALTER TABLE "anime_studio" RENAME TO "media_studio";--> statement-breakpoint
ALTER TABLE "anime_tag" RENAME TO "media_tag";--> statement-breakpoint
ALTER TABLE "anime_title" RENAME TO "media_title";--> statement-breakpoint
ALTER TABLE "_anime_to_other_description" RENAME TO "_media_to_alt_description";--> statement-breakpoint
ALTER TABLE "_anime_to_other_title" RENAME TO "_media_to_alt_title";--> statement-breakpoint
ALTER TABLE "_anime_to_artwork" RENAME TO "_media_to_artwork";--> statement-breakpoint
ALTER TABLE "_anime_to_character" RENAME TO "_media_to_character";--> statement-breakpoint
ALTER TABLE "_anime_to_genre" RENAME TO "_media_to_genre";--> statement-breakpoint
ALTER TABLE "_anime_to_image" RENAME TO "_media_to_image";--> statement-breakpoint
ALTER TABLE "_anime_to_link" RENAME TO "_media_to_link";--> statement-breakpoint
ALTER TABLE "_anime_to_screenshot" RENAME TO "_media_to_screenshot";--> statement-breakpoint
ALTER TABLE "_anime_to_studio" RENAME TO "_media_to_studio";--> statement-breakpoint
ALTER TABLE "_anime_to_tag" RENAME TO "_media_to_tag";--> statement-breakpoint
ALTER TABLE "_anime_to_translation" RENAME TO "_media_to_translation";--> statement-breakpoint
ALTER TABLE "_anime_to_video" RENAME TO "_media_to_video";--> statement-breakpoint
ALTER TABLE "anime_translation" RENAME TO "media_translation";--> statement-breakpoint
ALTER TABLE "anime_video" RENAME TO "media_video";--> statement-breakpoint
ALTER TABLE "anime_voice_actor" RENAME TO "media_voice_actor";--> statement-breakpoint
ALTER TABLE "anime_voice_birth_date" RENAME TO "media_voice_birth_date";--> statement-breakpoint
ALTER TABLE "anime_voice_death_date" RENAME TO "media_voice_death_date";--> statement-breakpoint
ALTER TABLE "anime_voice_image" RENAME TO "media_voice_image";--> statement-breakpoint
ALTER TABLE "anime_voice_name" RENAME TO "media_voice_name";--> statement-breakpoint
ALTER TABLE "media_age_rating" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_airing_schedule" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_broadcast" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_chronology" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_end_date" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_episode" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_last_airing_episode" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_latest_airing_episode" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_next_airing_episode" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_poster" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_recommendation" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_score_distribution" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_start_date" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_status_distribution" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "media_title" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "_media_to_character" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "_media_to_studio" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "_media_to_tag" RENAME COLUMN "anime_id" TO "media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_id_mal" RENAME TO "idx_media_id_mal";--> statement-breakpoint
ALTER INDEX "idx_anime_status" RENAME TO "idx_media_status";--> statement-breakpoint
ALTER INDEX "idx_anime_type" RENAME TO "idx_media_type";--> statement-breakpoint
ALTER INDEX "idx_anime_format" RENAME TO "idx_media_format";--> statement-breakpoint
ALTER INDEX "idx_anime_season" RENAME TO "idx_media_season";--> statement-breakpoint
ALTER INDEX "idx_anime_season_year" RENAME TO "idx_media_season_year";--> statement-breakpoint
ALTER INDEX "idx_anime_source" RENAME TO "idx_media_source";--> statement-breakpoint
ALTER INDEX "idx_anime_country" RENAME TO "idx_media_country";--> statement-breakpoint
ALTER INDEX "idx_anime_is_adult" RENAME TO "idx_media_is_adult";--> statement-breakpoint
ALTER INDEX "idx_anime_is_licensed" RENAME TO "idx_media_is_licensed";--> statement-breakpoint
ALTER INDEX "idx_anime_score" RENAME TO "idx_media_score";--> statement-breakpoint
ALTER INDEX "idx_anime_popularity" RENAME TO "idx_media_popularity";--> statement-breakpoint
ALTER INDEX "idx_anime_trending" RENAME TO "idx_media_trending";--> statement-breakpoint
ALTER INDEX "idx_anime_favorites" RENAME TO "idx_media_favorites";--> statement-breakpoint
ALTER INDEX "idx_anime_franchise" RENAME TO "idx_media_franchise";--> statement-breakpoint
ALTER INDEX "idx_anime_updated_at" RENAME TO "idx_media_updated_at";--> statement-breakpoint
ALTER INDEX "idx_anime_season_season_year" RENAME TO "idx_media_season_season_year";--> statement-breakpoint
ALTER INDEX "idx_anime_season_year_format" RENAME TO "idx_media_season_year_format";--> statement-breakpoint
ALTER INDEX "idx_anime_age_rating_anime_id" RENAME TO "idx_media_age_rating_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_age_rating_rating" RENAME TO "idx_media_age_rating_rating";--> statement-breakpoint
ALTER INDEX "anime_airing_schedule_unique" RENAME TO "media_airing_schedule_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_airing_schedule_anime_id" RENAME TO "idx_media_airing_schedule_media_id";--> statement-breakpoint
ALTER INDEX "other_description_unique" RENAME TO "alt_description_unique";--> statement-breakpoint
ALTER INDEX "other_title_unique" RENAME TO "alt_title_unique";--> statement-breakpoint
ALTER INDEX "anime_artwork_unique" RENAME TO "media_artwork_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_broadcast_anime_id" RENAME TO "idx_media_broadcast_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_broadcast_week" RENAME TO "idx_media_broadcast_week";--> statement-breakpoint
ALTER INDEX "idx_anime_character_birth_date_character_id" RENAME TO "idx_media_character_birth_date_character_id";--> statement-breakpoint
ALTER INDEX "idx_anime_character_image_character_id" RENAME TO "idx_media_character_image_character_id";--> statement-breakpoint
ALTER INDEX "idx_anime_character_name_character_id" RENAME TO "idx_media_character_name_character_id";--> statement-breakpoint
ALTER INDEX "anime_chronology_unique" RENAME TO "media_chronology_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_chronology_parent_id" RENAME TO "idx_media_chronology_parent_id";--> statement-breakpoint
ALTER INDEX "idx_anime_chronology_anime_id" RENAME TO "idx_media_chronology_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_chronology_related_id" RENAME TO "idx_media_chronology_related_id";--> statement-breakpoint
ALTER INDEX "idx_anime_end_date_anime_id" RENAME TO "idx_media_end_date_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_end_date_year" RENAME TO "idx_media_end_date_year";--> statement-breakpoint
ALTER INDEX "anime_episode_unique" RENAME TO "media_episode_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_episode_anime_id" RENAME TO "idx_media_episode_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_episode_image_episode_id" RENAME TO "idx_media_episode_image_episode_id";--> statement-breakpoint
ALTER INDEX "idx_anime_genre_name" RENAME TO "idx_media_genre_name";--> statement-breakpoint
ALTER INDEX "anime_image_unique" RENAME TO "media_image_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_poster_anime_id" RENAME TO "idx_media_poster_media_id";--> statement-breakpoint
ALTER INDEX "anime_recommendation_unique" RENAME TO "media_recommendation_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_recommendation_parent_id" RENAME TO "idx_media_recommendation_parent_id";--> statement-breakpoint
ALTER INDEX "idx_anime_recommendation_anime_id" RENAME TO "idx_media_recommendation_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_recommendation_related_id" RENAME TO "idx_media_recommendation_related_id";--> statement-breakpoint
ALTER INDEX "idx_anime_score_distribution_anime_id" RENAME TO "idx_media_score_distribution_media_id";--> statement-breakpoint
ALTER INDEX "anime_screenshot_unique" RENAME TO "media_screenshot_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_start_date_anime_id" RENAME TO "idx_media_start_date_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_start_date_year" RENAME TO "idx_media_start_date_year";--> statement-breakpoint
ALTER INDEX "idx_anime_status_distribution_anime_id" RENAME TO "idx_media_status_distribution_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_studio_name" RENAME TO "idx_media_studio_name";--> statement-breakpoint
ALTER INDEX "idx_anime_tag_category" RENAME TO "idx_media_tag_category";--> statement-breakpoint
ALTER INDEX "idx_anime_tag_is_adult" RENAME TO "idx_media_tag_is_adult";--> statement-breakpoint
ALTER INDEX "idx_anime_tag_name" RENAME TO "idx_media_tag_name";--> statement-breakpoint
ALTER INDEX "idx_anime_title_anime_id" RENAME TO "idx_media_title_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_title_romaji" RENAME TO "idx_media_title_romaji";--> statement-breakpoint
ALTER INDEX "idx_anime_title_english" RENAME TO "idx_media_title_english";--> statement-breakpoint
ALTER INDEX "idx_anime_title_native" RENAME TO "idx_media_title_native";--> statement-breakpoint
ALTER INDEX "idx_anime_to_other_description_a" RENAME TO "idx_media_to_alt_description_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_other_title_a" RENAME TO "idx_media_to_alt_title_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_artwork_a" RENAME TO "idx_media_to_artwork_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_character_anime_id" RENAME TO "idx_media_to_character_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_to_character_character_id" RENAME TO "idx_media_to_character_character_id";--> statement-breakpoint
ALTER INDEX "idx_anime_to_genre_a" RENAME TO "idx_media_to_genre_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_genre_b" RENAME TO "idx_media_to_genre_b";--> statement-breakpoint
ALTER INDEX "idx_anime_to_image_a" RENAME TO "idx_media_to_image_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_link_a" RENAME TO "idx_media_to_link_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_screenshot_a" RENAME TO "idx_media_to_screenshot_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_studio_anime_id" RENAME TO "idx_media_to_studio_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_to_studio_studio_id" RENAME TO "idx_media_to_studio_studio_id";--> statement-breakpoint
ALTER INDEX "anime_tag_unique" RENAME TO "media_tag_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_to_tag_anime_id" RENAME TO "idx_media_to_tag_media_id";--> statement-breakpoint
ALTER INDEX "idx_anime_to_tag_tag_id" RENAME TO "idx_media_to_tag_tag_id";--> statement-breakpoint
ALTER INDEX "idx_anime_to_translation_a" RENAME TO "idx_media_to_translation_a";--> statement-breakpoint
ALTER INDEX "idx_anime_to_video_a" RENAME TO "idx_media_to_video_a";--> statement-breakpoint
ALTER INDEX "anime_translation_unique" RENAME TO "media_translation_unique";--> statement-breakpoint
ALTER INDEX "anime_video_unique" RENAME TO "media_video_unique";--> statement-breakpoint
ALTER INDEX "idx_anime_voice_birth_date_voice_actor_id" RENAME TO "idx_media_voice_birth_date_voice_actor_id";--> statement-breakpoint
ALTER INDEX "idx_anime_voice_death_date_voice_actor_id" RENAME TO "idx_media_voice_death_date_voice_actor_id";--> statement-breakpoint
ALTER INDEX "idx_anime_voice_image_voice_actor_id" RENAME TO "idx_media_voice_image_voice_actor_id";--> statement-breakpoint
ALTER INDEX "idx_anime_voice_name_voice_actor_id" RENAME TO "idx_media_voice_name_voice_actor_id";--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "local_favorites" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "volumes" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "chapters" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "views_total" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "views_hour" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "views_today" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "views_week" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "views_month" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media_episode" ADD COLUMN "views" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media_title" DROP COLUMN "search_vector";--> statement-breakpoint
ALTER TABLE "media_title" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (to_tsvector('english',
          coalesce("media_title"."romaji", '') || ' ' ||
          coalesce("media_title"."english", '') || ' ' ||
          coalesce("media_title"."native", '')
        )) STORED;--> statement-breakpoint
CREATE UNIQUE INDEX "score_local_distribution_unique" ON "media_local_score_distribution" ("media_id","score");--> statement-breakpoint
CREATE INDEX "idx_media_local_score_distribution_media_id" ON "media_local_score_distribution" ("media_id");--> statement-breakpoint
CREATE UNIQUE INDEX "status_local_distribution_unique" ON "media_local_status_distribution" ("media_id","status");--> statement-breakpoint
CREATE INDEX "idx_media_local_status_distribution_media_id" ON "media_local_status_distribution" ("media_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_statistic_unique" ON "media_statistic" ("media_id","record_date");--> statement-breakpoint
CREATE INDEX "search_vector_idx" ON "media_title" USING gin ("search_vector");--> statement-breakpoint
ALTER TABLE "media_embedding" ADD CONSTRAINT "media_embedding_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_local_score_distribution" ADD CONSTRAINT "media_local_score_distribution_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_local_status_distribution" ADD CONSTRAINT "media_local_status_distribution_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_statistic" ADD CONSTRAINT "media_statistic_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;