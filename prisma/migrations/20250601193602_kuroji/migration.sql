/*
  Warnings:

  - Made the column `season_number` on table `TmdbReleaseSeason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `show_id` on table `TmdbSeason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_number` on table `TmdbSeason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `episode_number` on table `TmdbSeasonEpisode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_number` on table `TmdbSeasonEpisode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `show_id` on table `TmdbSeasonEpisode` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TmdbSeasonEpisode" DROP CONSTRAINT "TmdbSeasonEpisode_show_id_fkey";

-- AlterTable
ALTER TABLE "TmdbReleaseSeason" ALTER COLUMN "season_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "TmdbSeason" ALTER COLUMN "show_id" SET NOT NULL,
ALTER COLUMN "season_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "TmdbSeasonEpisode" ADD COLUMN     "season_id" INTEGER,
ALTER COLUMN "episode_number" SET NOT NULL,
ALTER COLUMN "season_number" SET NOT NULL,
ALTER COLUMN "show_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TmdbSeason" ADD CONSTRAINT "TmdbSeason_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Tmdb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmdbSeasonEpisode" ADD CONSTRAINT "TmdbSeasonEpisode_show_fkey" FOREIGN KEY ("show_id") REFERENCES "Tmdb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmdbSeasonEpisode" ADD CONSTRAINT "TmdbSeasonEpisode_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "TmdbSeason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
