-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_animeId_fkey";

-- AlterTable
ALTER TABLE "Meta" ALTER COLUMN "animeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
