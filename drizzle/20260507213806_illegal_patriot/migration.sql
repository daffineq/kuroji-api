CREATE TABLE "_anime_to_translation" (
	"A" integer,
	"B" varchar(255),
	"created_at" integer,
	"updated_at" integer,
	CONSTRAINT "_anime_to_translation_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "anime_translation" (
	"id" varchar(255) PRIMARY KEY,
	"iso_639_1" varchar(255),
	"title" text,
	"description" text,
	"tagline" text,
	"source" varchar(255) NOT NULL,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE INDEX "idx_anime_to_translation_a" ON "_anime_to_translation" ("A");--> statement-breakpoint
CREATE UNIQUE INDEX "anime_translation_unique" ON "anime_translation" ("iso_639_1","title","source");--> statement-breakpoint
ALTER TABLE "_anime_to_translation" ADD CONSTRAINT "_anime_to_translation_A_anime_id_fkey" FOREIGN KEY ("A") REFERENCES "anime"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "_anime_to_translation" ADD CONSTRAINT "_anime_to_translation_B_anime_translation_id_fkey" FOREIGN KEY ("B") REFERENCES "anime_translation"("id") ON DELETE CASCADE;