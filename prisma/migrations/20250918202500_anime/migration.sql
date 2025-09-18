-- AddForeignKey
ALTER TABLE "public"."Mappings" ADD CONSTRAINT "Mappings_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
