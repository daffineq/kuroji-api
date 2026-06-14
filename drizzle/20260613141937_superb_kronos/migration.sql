CREATE TABLE "media_relation" (
	"id" varchar(255) PRIMARY KEY,
	"parent_id" integer NOT NULL,
	"related_id" integer NOT NULL,
	"relation_type" varchar(255) NOT NULL,
	"media_id" integer NOT NULL,
	"created_at" integer,
	"updated_at" integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX "media_relation_unique" ON "media_relation" ("parent_id","related_id");--> statement-breakpoint
CREATE INDEX "idx_media_relation_parent_id" ON "media_relation" ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_media_relation_media_id" ON "media_relation" ("media_id");--> statement-breakpoint
CREATE INDEX "idx_media_relation_related_id" ON "media_relation" ("related_id");--> statement-breakpoint
ALTER TABLE "media_relation" ADD CONSTRAINT "media_relation_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;
