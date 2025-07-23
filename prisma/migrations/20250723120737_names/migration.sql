/*
  Warnings:

  - You are about to drop the column `addedInAbandonedCollection` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `addedInPlannedCollection` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `addedInPostponedCollection` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `addedInUsersFavorites` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `addedInWatchedCollection` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `addedInWatchingCollection` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `anilistId` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `averageDurationOfEpisode` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `episodesTotal` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `externalPlayer` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `freshAt` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `isBlockedByCopyrights` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `isInProduction` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `isOngoing` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Anilibria` table. All the data in the column will be lost.
  - You are about to drop the column `isAdult` on the `AnilibriaAgeRating` table. All the data in the column will be lost.
  - You are about to drop the column `hls1080` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `hls480` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `hls720` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `nameEnglish` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `releaseId` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `rutubeId` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeId` on the `AnilibriaEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `optimizedPreview` on the `AnilibriaEpisodePreview` table. All the data in the column will be lost.
  - You are about to drop the column `optimizedThumbnail` on the `AnilibriaEpisodePreview` table. All the data in the column will be lost.
  - You are about to drop the column `optimizedPreview` on the `AnilibriaGenre` table. All the data in the column will be lost.
  - You are about to drop the column `optimizedThumbnail` on the `AnilibriaGenre` table. All the data in the column will be lost.
  - You are about to drop the column `totalReleases` on the `AnilibriaGenreEdge` table. All the data in the column will be lost.
  - You are about to drop the column `optimizedPreview` on the `AnilibriaPoster` table. All the data in the column will be lost.
  - You are about to drop the column `optimizedThumbnail` on the `AnilibriaPoster` table. All the data in the column will be lost.
  - You are about to drop the column `sponsorId` on the `AnilibriaSponsor` table. All the data in the column will be lost.
  - You are about to drop the column `urlTitle` on the `AnilibriaSponsor` table. All the data in the column will be lost.
  - You are about to drop the column `completedTimes` on the `AnilibriaTorrent` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AnilibriaTorrent` table. All the data in the column will be lost.
  - You are about to drop the column `isHardsub` on the `AnilibriaTorrent` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `AnilibriaTorrent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AnilibriaTorrent` table. All the data in the column will be lost.
  - You are about to drop the column `labelColor` on the `AnilibriaTorrentCodec` table. All the data in the column will be lost.
  - You are about to drop the column `labelIsVisible` on the `AnilibriaTorrentCodec` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[anilist_id]` on the table `Anilibria` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Anilibria" DROP CONSTRAINT "Anilibria_anilistId_fkey";

-- DropIndex
DROP INDEX "Anilibria_anilistId_key";

-- AlterTable
ALTER TABLE "Anilibria" DROP COLUMN "addedInAbandonedCollection",
DROP COLUMN "addedInPlannedCollection",
DROP COLUMN "addedInPostponedCollection",
DROP COLUMN "addedInUsersFavorites",
DROP COLUMN "addedInWatchedCollection",
DROP COLUMN "addedInWatchingCollection",
DROP COLUMN "anilistId",
DROP COLUMN "averageDurationOfEpisode",
DROP COLUMN "createdAt",
DROP COLUMN "episodesTotal",
DROP COLUMN "externalPlayer",
DROP COLUMN "freshAt",
DROP COLUMN "isBlockedByCopyrights",
DROP COLUMN "isInProduction",
DROP COLUMN "isOngoing",
DROP COLUMN "updatedAt",
ADD COLUMN     "added_in_abandoned_collection" INTEGER,
ADD COLUMN     "added_in_planned_collection" INTEGER,
ADD COLUMN     "added_in_postponed_collection" INTEGER,
ADD COLUMN     "added_in_users_favorites" INTEGER,
ADD COLUMN     "added_in_watched_collection" INTEGER,
ADD COLUMN     "added_in_watching_collection" INTEGER,
ADD COLUMN     "anilist_id" INTEGER,
ADD COLUMN     "average_duration_of_episode" INTEGER,
ADD COLUMN     "created_at" TEXT,
ADD COLUMN     "episodes_total" INTEGER,
ADD COLUMN     "external_player" TEXT,
ADD COLUMN     "fresh_at" TEXT,
ADD COLUMN     "is_blocked_by_copyrights" BOOLEAN,
ADD COLUMN     "is_in_production" BOOLEAN,
ADD COLUMN     "is_ongoing" BOOLEAN,
ADD COLUMN     "updated_at" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaAgeRating" DROP COLUMN "isAdult",
ADD COLUMN     "is_adult" BOOLEAN;

-- AlterTable
ALTER TABLE "AnilibriaEpisode" DROP COLUMN "hls1080",
DROP COLUMN "hls480",
DROP COLUMN "hls720",
DROP COLUMN "nameEnglish",
DROP COLUMN "releaseId",
DROP COLUMN "rutubeId",
DROP COLUMN "sortOrder",
DROP COLUMN "updatedAt",
DROP COLUMN "youtubeId",
ADD COLUMN     "hls_1080" TEXT,
ADD COLUMN     "hls_480" TEXT,
ADD COLUMN     "hls_720" TEXT,
ADD COLUMN     "name_english" TEXT,
ADD COLUMN     "release_id" INTEGER,
ADD COLUMN     "rutube_id" TEXT,
ADD COLUMN     "sort_order" INTEGER,
ADD COLUMN     "updated_at" TEXT,
ADD COLUMN     "youtube_id" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaEpisodePreview" DROP COLUMN "optimizedPreview",
DROP COLUMN "optimizedThumbnail",
ADD COLUMN     "optimized_preview" TEXT,
ADD COLUMN     "optimized_thumbnail" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaGenre" DROP COLUMN "optimizedPreview",
DROP COLUMN "optimizedThumbnail",
ADD COLUMN     "optimized_preview" TEXT,
ADD COLUMN     "optimized_thumbnail" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaGenreEdge" DROP COLUMN "totalReleases",
ADD COLUMN     "total_releases" INTEGER;

-- AlterTable
ALTER TABLE "AnilibriaPoster" DROP COLUMN "optimizedPreview",
DROP COLUMN "optimizedThumbnail",
ADD COLUMN     "optimized_preview" TEXT,
ADD COLUMN     "optimized_thumbnail" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaSponsor" DROP COLUMN "sponsorId",
DROP COLUMN "urlTitle",
ADD COLUMN     "sponsor_id" TEXT,
ADD COLUMN     "url_title" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaTorrent" DROP COLUMN "completedTimes",
DROP COLUMN "createdAt",
DROP COLUMN "isHardsub",
DROP COLUMN "sortOrder",
DROP COLUMN "updatedAt",
ADD COLUMN     "completed_times" INTEGER,
ADD COLUMN     "created_at" TEXT,
ADD COLUMN     "is_hardsub" BOOLEAN,
ADD COLUMN     "sort_order" INTEGER,
ADD COLUMN     "updated_at" TEXT;

-- AlterTable
ALTER TABLE "AnilibriaTorrentCodec" DROP COLUMN "labelColor",
DROP COLUMN "labelIsVisible",
ADD COLUMN     "label_color" TEXT,
ADD COLUMN     "label_is_visible" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "Anilibria_anilist_id_key" ON "Anilibria"("anilist_id");

-- AddForeignKey
ALTER TABLE "Anilibria" ADD CONSTRAINT "Anilibria_anilist_id_fkey" FOREIGN KEY ("anilist_id") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
