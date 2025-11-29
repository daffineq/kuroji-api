/*
  Warnings:

  - Made the column `animeId` on table `Meta` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_animeId_fkey";

-- AlterTable
ALTER TABLE "Meta" ALTER COLUMN "animeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
