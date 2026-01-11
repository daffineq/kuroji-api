ALTER TABLE "anime_title" ALTER COLUMN "anime_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "anime_title" ADD CONSTRAINT "anime_title_anime_id_key" UNIQUE("anime_id");--> statement-breakpoint
ALTER TABLE "anime_title" ADD CONSTRAINT "anime_title_anime_id_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE;