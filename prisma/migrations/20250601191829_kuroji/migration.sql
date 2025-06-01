-- DropForeignKey
ALTER TABLE "TmdbSeasonEpisode" DROP CONSTRAINT "TmdbSeasonEpisode_show_id_fkey";

-- AlterTable
ALTER TABLE "TmdbReleaseSeason" ALTER COLUMN "season_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TmdbSeason" ALTER COLUMN "show_id" DROP NOT NULL,
ALTER COLUMN "season_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TmdbSeasonEpisode" ALTER COLUMN "episode_number" DROP NOT NULL,
ALTER COLUMN "season_number" DROP NOT NULL,
ALTER COLUMN "show_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TmdbSeasonEpisode" ADD CONSTRAINT "TmdbSeasonEpisode_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "TmdbSeason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
