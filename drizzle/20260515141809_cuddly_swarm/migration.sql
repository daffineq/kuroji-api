ALTER TABLE "anime_title" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (to_tsvector('english',
          coalesce("anime_title"."romaji", '') || ' ' ||
          coalesce("anime_title"."english", '') || ' ' ||
          coalesce("anime_title"."native", '')
        )) STORED;--> statement-breakpoint
CREATE INDEX "search_vector_idx" ON "anime_title" USING gin ("search_vector");