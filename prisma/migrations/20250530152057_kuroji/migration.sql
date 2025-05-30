/*
  Warnings:

  - You are about to drop the `AnilistNextAiringEpisode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnilistNextAiringEpisode" DROP CONSTRAINT "AnilistNextAiringEpisode_anilistId_fkey";

-- AlterTable
ALTER TABLE "AnimeKai" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Animepahe" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Zoro" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "AnilistNextAiringEpisode";
