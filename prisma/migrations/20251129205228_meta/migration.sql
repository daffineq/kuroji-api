/*
  Warnings:

  - A unique constraint covering the columns `[animeId]` on the table `Meta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `animeId` to the `Meta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_id_fkey";

-- AlterTable
ALTER TABLE "Meta" ADD COLUMN     "animeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Meta_animeId_key" ON "Meta"("animeId");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
