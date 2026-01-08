/*
  Warnings:

  - You are about to drop the column `banner` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the `AnimeLastEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeLatestEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeNextEpisode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnimeLastEpisode" DROP CONSTRAINT "AnimeLastEpisode_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "AnimeLatestEpisode" DROP CONSTRAINT "AnimeLatestEpisode_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "AnimeNextEpisode" DROP CONSTRAINT "AnimeNextEpisode_anime_id_fkey";

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "banner",
ADD COLUMN     "background" TEXT,
ADD COLUMN     "last_airing_episode" INTEGER,
ADD COLUMN     "latest_airing_episode" INTEGER,
ADD COLUMN     "next_airing_episode" INTEGER;

-- DropTable
DROP TABLE "AnimeLastEpisode";

-- DropTable
DROP TABLE "AnimeLatestEpisode";

-- DropTable
DROP TABLE "AnimeNextEpisode";
