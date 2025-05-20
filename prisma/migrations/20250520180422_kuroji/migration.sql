/*
  Warnings:

  - The `malId` column on the `Shikimori` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[idMal]` on the table `Anilist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anilistId]` on the table `AnimeKai` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[alId]` on the table `Animepahe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[malId]` on the table `Shikimori` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[alID]` on the table `Zoro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Shikimori" DROP COLUMN "malId",
ADD COLUMN     "malId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Anilist_idMal_key" ON "Anilist"("idMal");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeKai_anilistId_key" ON "AnimeKai"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "Animepahe_alId_key" ON "Animepahe"("alId");

-- CreateIndex
CREATE UNIQUE INDEX "Shikimori_malId_key" ON "Shikimori"("malId");

-- CreateIndex
CREATE UNIQUE INDEX "Zoro_alID_key" ON "Zoro"("alID");

-- AddForeignKey
ALTER TABLE "AnimeKai" ADD CONSTRAINT "AnimeKai_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animepahe" ADD CONSTRAINT "Animepahe_alId_fkey" FOREIGN KEY ("alId") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shikimori" ADD CONSTRAINT "Shikimori_malId_fkey" FOREIGN KEY ("malId") REFERENCES "Anilist"("idMal") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zoro" ADD CONSTRAINT "Zoro_alID_fkey" FOREIGN KEY ("alID") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
