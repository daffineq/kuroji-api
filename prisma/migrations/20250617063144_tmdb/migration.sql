/*
  Warnings:

  - Made the column `show_id` on table `TmdbLastEpisodeToAir` required. This step will fail if there are existing NULL values in that column.
  - Made the column `show_id` on table `TmdbNextEpisodeToAir` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TmdbLastEpisodeToAir" DROP CONSTRAINT "TmdbLastEpisodeToAir_show_id_fkey";

-- DropForeignKey
ALTER TABLE "TmdbNextEpisodeToAir" DROP CONSTRAINT "TmdbNextEpisodeToAir_show_id_fkey";

-- DropIndex
DROP INDEX "TmdbLastEpisodeToAir_show_id_idx";

-- DropIndex
DROP INDEX "TmdbNextEpisodeToAir_show_id_idx";

-- AlterTable
ALTER TABLE "TmdbLastEpisodeToAir" ALTER COLUMN "show_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "TmdbNextEpisodeToAir" ALTER COLUMN "show_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TmdbNextEpisodeToAir" ADD CONSTRAINT "TmdbNextEpisodeToAir_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Tmdb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmdbLastEpisodeToAir" ADD CONSTRAINT "TmdbLastEpisodeToAir_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Tmdb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
