/*
  Warnings:

  - You are about to drop the column `timeUntilAiring` on the `AnilistAiringSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `timeUntilAiring` on the `AnilistNextAiringEpisode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnilistAiringSchedule" DROP COLUMN "timeUntilAiring";

-- AlterTable
ALTER TABLE "AnilistNextAiringEpisode" DROP COLUMN "timeUntilAiring";
