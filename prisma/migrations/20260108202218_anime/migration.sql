/*
  Warnings:

  - You are about to drop the `Episode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EpisodeThumbnail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MetaToEpisode` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[anime_id,score]` on the table `AnimeScoreDistribution` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id,status]` on the table `AnimeStatusDistribution` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EpisodeThumbnail" DROP CONSTRAINT "EpisodeThumbnail_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "_MetaToEpisode" DROP CONSTRAINT "_MetaToEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "_MetaToEpisode" DROP CONSTRAINT "_MetaToEpisode_B_fkey";

-- DropTable
DROP TABLE "Episode";

-- DropTable
DROP TABLE "EpisodeThumbnail";

-- DropTable
DROP TABLE "_MetaToEpisode";

-- CreateIndex
CREATE UNIQUE INDEX "AnimeScoreDistribution_anime_id_score_key" ON "AnimeScoreDistribution"("anime_id", "score");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStatusDistribution_anime_id_status_key" ON "AnimeStatusDistribution"("anime_id", "status");
