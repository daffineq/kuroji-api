/*
  Warnings:

  - You are about to drop the `_TmdbSeasonEpisode` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `season_number` on table `TmdbReleaseSeason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `show_id` on table `TmdbSeason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_number` on table `TmdbSeason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `episode_number` on table `TmdbSeasonEpisode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season_number` on table `TmdbSeasonEpisode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `show_id` on table `TmdbSeasonEpisode` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_TmdbSeasonEpisode" DROP CONSTRAINT "_TmdbSeasonEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "_TmdbSeasonEpisode" DROP CONSTRAINT "_TmdbSeasonEpisode_B_fkey";

-- AlterTable
ALTER TABLE "TmdbReleaseSeason" ALTER COLUMN "season_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "TmdbSeason" ALTER COLUMN "show_id" SET NOT NULL,
ALTER COLUMN "season_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "TmdbSeasonEpisode" ALTER COLUMN "episode_number" SET NOT NULL,
ALTER COLUMN "season_number" SET NOT NULL,
ALTER COLUMN "show_id" SET NOT NULL;

-- DropTable
DROP TABLE "_TmdbSeasonEpisode";

-- CreateTable
CREATE TABLE "TmdbSeasonEpisodeImages" (
    "id" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "TmdbSeasonEpisodeImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TmdbSeasonStillImage" (
    "id" SERIAL NOT NULL,
    "aspect_ratio" DOUBLE PRECISION,
    "height" INTEGER,
    "width" INTEGER,
    "iso_639_1" TEXT,
    "file_path" TEXT,
    "vote_average" DOUBLE PRECISION,
    "vote_count" INTEGER,
    "episodeImagesId" INTEGER NOT NULL,

    CONSTRAINT "TmdbSeasonStillImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TmdbSeasonEpisodeImages_episodeId_key" ON "TmdbSeasonEpisodeImages"("episodeId");

-- AddForeignKey
ALTER TABLE "TmdbSeasonEpisode" ADD CONSTRAINT "TmdbSeasonEpisode_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "TmdbSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmdbSeasonEpisodeImages" ADD CONSTRAINT "TmdbSeasonEpisodeImages_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "TmdbSeasonEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmdbSeasonStillImage" ADD CONSTRAINT "TmdbSeasonStillImage_episodeImagesId_fkey" FOREIGN KEY ("episodeImagesId") REFERENCES "TmdbSeasonEpisodeImages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
