/*
  Warnings:

  - You are about to drop the `AnimeRanking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnimeRanking" DROP CONSTRAINT "AnimeRanking_anime_id_fkey";

-- DropTable
DROP TABLE "AnimeRanking";
