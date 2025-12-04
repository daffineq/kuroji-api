/*
  Warnings:

  - You are about to drop the column `countryOfOrigin` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `idMal` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `isAdult` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `isLicensed` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `seasonYear` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `airingAt` on the `AnimeAiringSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeAiringSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeCharacterEdge` table. All the data in the column will be lost.
  - You are about to drop the column `characterId` on the `AnimeCharacterEdge` table. All the data in the column will be lost.
  - You are about to drop the column `characterId` on the `AnimeCharacterImage` table. All the data in the column will be lost.
  - You are about to drop the column `characterId` on the `AnimeCharacterName` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeEndDate` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeExternalLink` table. All the data in the column will be lost.
  - You are about to drop the column `isDisabled` on the `AnimeExternalLink` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `AnimeExternalLink` table. All the data in the column will be lost.
  - You are about to drop the column `airingAt` on the `AnimeLastEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeLastEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `airingAt` on the `AnimeLatestEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeLatestEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `airingAt` on the `AnimeNextEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeNextEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimePoster` table. All the data in the column will be lost.
  - You are about to drop the column `extraLarge` on the `AnimePoster` table. All the data in the column will be lost.
  - You are about to drop the column `allTime` on the `AnimeRanking` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeRanking` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeScoreDistribution` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeStartDate` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeStatusDistribution` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeStudioEdge` table. All the data in the column will be lost.
  - You are about to drop the column `isMain` on the `AnimeStudioEdge` table. All the data in the column will be lost.
  - You are about to drop the column `studioId` on the `AnimeStudioEdge` table. All the data in the column will be lost.
  - You are about to drop the column `isAdult` on the `AnimeTag` table. All the data in the column will be lost.
  - You are about to drop the column `isGeneralSpoiler` on the `AnimeTag` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeTagEdge` table. All the data in the column will be lost.
  - You are about to drop the column `isMediaSpoiler` on the `AnimeTagEdge` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `AnimeTagEdge` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeTitle` table. All the data in the column will be lost.
  - You are about to drop the column `voiceActorId` on the `AnimeVoiceImage` table. All the data in the column will be lost.
  - You are about to drop the column `voiceActorId` on the `AnimeVoiceName` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `apiKeyId` on the `ApiKeyUsage` table. All the data in the column will be lost.
  - You are about to drop the column `usedAt` on the `ApiKeyUsage` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `ApiKeyUsage` table. All the data in the column will be lost.
  - You are about to drop the column `episodeId` on the `EpisodeThumbnail` table. All the data in the column will be lost.
  - You are about to drop the column `lastFetchedPage` on the `IndexerState` table. All the data in the column will be lost.
  - You are about to drop the column `metaId` on the `Mappings` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Mappings` table. All the data in the column will be lost.
  - You are about to drop the column `sourceName` on the `Mappings` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `episodesAired` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `episodesTotal` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `originalUrl` on the `Screenshot` table. All the data in the column will be lost.
  - You are about to drop the column `x166Url` on the `Screenshot` table. All the data in the column will be lost.
  - You are about to drop the column `x332Url` on the `Screenshot` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `TvdbLogin` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `UpdateHistory` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UpdateHistory` table. All the data in the column will be lost.
  - You are about to drop the column `errorCount` on the `UpdateHistory` table. All the data in the column will be lost.
  - You are about to drop the column `malId` on the `UpdateHistory` table. All the data in the column will be lost.
  - You are about to drop the column `triggeredBy` on the `UpdateHistory` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the column `lastError` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the column `malId` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UpdateQueue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_mal]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[character_id]` on the table `AnimeCharacterImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[character_id]` on the table `AnimeCharacterName` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimeEndDate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimeLastEpisode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimeLatestEpisode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimeNextEpisode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimePoster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimeStartDate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id,tag_id]` on the table `AnimeTagEdge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `AnimeTitle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[voice_actor_id]` on the table `AnimeVoiceImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[voice_actor_id]` on the table `AnimeVoiceName` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[episode_id]` on the table `EpisodeThumbnail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source_id,source_name]` on the table `Mappings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `Meta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anime_id]` on the table `UpdateQueue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeAiringSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeCharacterEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `character_id` to the `AnimeCharacterEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeEndDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeExternalLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeLastEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeLatestEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeNextEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimePoster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeRanking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeScoreDistribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeStartDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeStatusDistribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeStudioEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studio_id` to the `AnimeStudioEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeTagEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `AnimeTagEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `AnimeTitle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `api_key_id` to the `ApiKeyUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `episode_id` to the `EpisodeThumbnail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_page` to the `IndexerState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_id` to the `Mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_id` to the `Mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_name` to the `Mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `Meta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `UpdateHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggered_by` to the `UpdateHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anime_id` to the `UpdateQueue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updared_at` to the `UpdateQueue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnimeAiringSchedule" DROP CONSTRAINT "AnimeAiringSchedule_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeCharacterEdge" DROP CONSTRAINT "AnimeCharacterEdge_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeCharacterEdge" DROP CONSTRAINT "AnimeCharacterEdge_characterId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeCharacterImage" DROP CONSTRAINT "AnimeCharacterImage_characterId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeCharacterName" DROP CONSTRAINT "AnimeCharacterName_characterId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeEndDate" DROP CONSTRAINT "anime_end_date_fkey";

-- DropForeignKey
ALTER TABLE "AnimeExternalLink" DROP CONSTRAINT "AnimeExternalLink_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeLastEpisode" DROP CONSTRAINT "AnimeLastEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeLatestEpisode" DROP CONSTRAINT "AnimeLatestEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeNextEpisode" DROP CONSTRAINT "AnimeNextEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimePoster" DROP CONSTRAINT "anime_poster_fkey";

-- DropForeignKey
ALTER TABLE "AnimeRanking" DROP CONSTRAINT "AnimeRanking_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeScoreDistribution" DROP CONSTRAINT "AnimeScoreDistribution_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeStartDate" DROP CONSTRAINT "anime_start_date_fkey";

-- DropForeignKey
ALTER TABLE "AnimeStatusDistribution" DROP CONSTRAINT "AnimeStatusDistribution_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeStudioEdge" DROP CONSTRAINT "AnimeStudioEdge_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeStudioEdge" DROP CONSTRAINT "AnimeStudioEdge_studioId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeTagEdge" DROP CONSTRAINT "AnimeTagEdge_animeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeTagEdge" DROP CONSTRAINT "AnimeTagEdge_tagId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeTitle" DROP CONSTRAINT "anime_title_fkey";

-- DropForeignKey
ALTER TABLE "AnimeVoiceImage" DROP CONSTRAINT "AnimeVoiceImage_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeVoiceName" DROP CONSTRAINT "AnimeVoiceName_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "ApiKeyUsage" DROP CONSTRAINT "ApiKeyUsage_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeThumbnail" DROP CONSTRAINT "EpisodeThumbnail_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "Mappings" DROP CONSTRAINT "Mappings_metaId_fkey";

-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_animeId_fkey";

-- DropIndex
DROP INDEX "Anime_idMal_key";

-- DropIndex
DROP INDEX "AnimeCharacterImage_characterId_key";

-- DropIndex
DROP INDEX "AnimeCharacterName_characterId_key";

-- DropIndex
DROP INDEX "AnimeEndDate_animeId_key";

-- DropIndex
DROP INDEX "AnimeLastEpisode_animeId_key";

-- DropIndex
DROP INDEX "AnimeLatestEpisode_animeId_key";

-- DropIndex
DROP INDEX "AnimeNextEpisode_animeId_key";

-- DropIndex
DROP INDEX "AnimePoster_animeId_key";

-- DropIndex
DROP INDEX "AnimeStartDate_animeId_key";

-- DropIndex
DROP INDEX "AnimeTagEdge_animeId_tagId_key";

-- DropIndex
DROP INDEX "AnimeTitle_animeId_key";

-- DropIndex
DROP INDEX "AnimeVoiceImage_voiceActorId_key";

-- DropIndex
DROP INDEX "AnimeVoiceName_voiceActorId_key";

-- DropIndex
DROP INDEX "EpisodeThumbnail_episodeId_key";

-- DropIndex
DROP INDEX "Mappings_sourceId_sourceName_key";

-- DropIndex
DROP INDEX "Meta_animeId_key";

-- DropIndex
DROP INDEX "UpdateHistory_animeId_createdAt_idx";

-- DropIndex
DROP INDEX "UpdateHistory_success_createdAt_idx";

-- DropIndex
DROP INDEX "UpdateQueue_animeId_idx";

-- DropIndex
DROP INDEX "UpdateQueue_animeId_key";

-- DropIndex
DROP INDEX "UpdateQueue_priority_addedAt_idx";

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "countryOfOrigin",
DROP COLUMN "idMal",
DROP COLUMN "isAdult",
DROP COLUMN "isLicensed",
DROP COLUMN "seasonYear",
DROP COLUMN "updatedAt",
ADD COLUMN     "country_of_origin" TEXT,
ADD COLUMN     "id_mal" INTEGER,
ADD COLUMN     "is_adult" BOOLEAN,
ADD COLUMN     "is_licensed" BOOLEAN,
ADD COLUMN     "season_year" INTEGER,
ADD COLUMN     "updated_at" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeAiringSchedule" DROP COLUMN "airingAt",
DROP COLUMN "animeId",
ADD COLUMN     "airing_at" INTEGER,
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeCharacterEdge" DROP COLUMN "animeId",
DROP COLUMN "characterId",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "character_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeCharacterImage" DROP COLUMN "characterId",
ADD COLUMN     "character_id" INTEGER;

-- AlterTable
ALTER TABLE "AnimeCharacterName" DROP COLUMN "characterId",
ADD COLUMN     "character_id" INTEGER;

-- AlterTable
ALTER TABLE "AnimeEndDate" DROP COLUMN "animeId",
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeExternalLink" DROP COLUMN "animeId",
DROP COLUMN "isDisabled",
DROP COLUMN "siteId",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "is_disabled" BOOLEAN,
ADD COLUMN     "site_id" INTEGER;

-- AlterTable
ALTER TABLE "AnimeLastEpisode" DROP COLUMN "airingAt",
DROP COLUMN "animeId",
ADD COLUMN     "airing_at" INTEGER,
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeLatestEpisode" DROP COLUMN "airingAt",
DROP COLUMN "animeId",
ADD COLUMN     "airing_at" INTEGER,
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeNextEpisode" DROP COLUMN "airingAt",
DROP COLUMN "animeId",
ADD COLUMN     "airing_at" INTEGER,
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimePoster" DROP COLUMN "animeId",
DROP COLUMN "extraLarge",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "extra_large" TEXT;

-- AlterTable
ALTER TABLE "AnimeRanking" DROP COLUMN "allTime",
DROP COLUMN "animeId",
ADD COLUMN     "all_time" BOOLEAN,
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeScoreDistribution" DROP COLUMN "animeId",
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeStartDate" DROP COLUMN "animeId",
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeStatusDistribution" DROP COLUMN "animeId",
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeStudioEdge" DROP COLUMN "animeId",
DROP COLUMN "isMain",
DROP COLUMN "studioId",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "is_main" BOOLEAN,
ADD COLUMN     "studio_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeTag" DROP COLUMN "isAdult",
DROP COLUMN "isGeneralSpoiler",
ADD COLUMN     "is_adult" BOOLEAN,
ADD COLUMN     "is_general_spoiler" BOOLEAN;

-- AlterTable
ALTER TABLE "AnimeTagEdge" DROP COLUMN "animeId",
DROP COLUMN "isMediaSpoiler",
DROP COLUMN "tagId",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "is_media_spoiler" BOOLEAN,
ADD COLUMN     "tag_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeTitle" DROP COLUMN "animeId",
ADD COLUMN     "anime_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AnimeVoiceImage" DROP COLUMN "voiceActorId",
ADD COLUMN     "voice_actor_id" INTEGER;

-- AlterTable
ALTER TABLE "AnimeVoiceName" DROP COLUMN "voiceActorId",
ADD COLUMN     "voice_actor_id" INTEGER;

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ApiKeyUsage" DROP COLUMN "apiKeyId",
DROP COLUMN "usedAt",
DROP COLUMN "userAgent",
ADD COLUMN     "api_key_id" TEXT NOT NULL,
ADD COLUMN     "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_agent" TEXT;

-- AlterTable
ALTER TABLE "EpisodeThumbnail" DROP COLUMN "episodeId",
ADD COLUMN     "episode_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "IndexerState" DROP COLUMN "lastFetchedPage",
ADD COLUMN     "last_page" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mappings" DROP COLUMN "metaId",
DROP COLUMN "sourceId",
DROP COLUMN "sourceName",
ADD COLUMN     "meta_id" INTEGER NOT NULL,
ADD COLUMN     "source_id" TEXT NOT NULL,
ADD COLUMN     "source_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meta" DROP COLUMN "animeId",
DROP COLUMN "episodesAired",
DROP COLUMN "episodesTotal",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "episodes_aired" INTEGER,
ADD COLUMN     "episodes_total" INTEGER;

-- AlterTable
ALTER TABLE "Screenshot" DROP COLUMN "originalUrl",
DROP COLUMN "x166Url",
DROP COLUMN "x332Url",
ADD COLUMN     "original" TEXT,
ADD COLUMN     "x166" TEXT,
ADD COLUMN     "x332" TEXT;

-- AlterTable
ALTER TABLE "TvdbLogin" DROP COLUMN "createDate",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UpdateHistory" DROP COLUMN "animeId",
DROP COLUMN "createdAt",
DROP COLUMN "errorCount",
DROP COLUMN "malId",
DROP COLUMN "triggeredBy",
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mal_id" INTEGER,
ADD COLUMN     "triggered_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UpdateQueue" DROP COLUMN "addedAt",
DROP COLUMN "animeId",
DROP COLUMN "createdAt",
DROP COLUMN "lastError",
DROP COLUMN "malId",
DROP COLUMN "updatedAt",
ADD COLUMN     "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "anime_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_error" TEXT,
ADD COLUMN     "mal_id" INTEGER,
ADD COLUMN     "updared_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Chronology" (
    "id" TEXT NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "related_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "meta_id" INTEGER NOT NULL,

    CONSTRAINT "Chronology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chronology_parent_id_related_id_key" ON "Chronology"("parent_id", "related_id");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_id_mal_key" ON "Anime"("id_mal");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterImage_character_id_key" ON "AnimeCharacterImage"("character_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterName_character_id_key" ON "AnimeCharacterName"("character_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeEndDate_anime_id_key" ON "AnimeEndDate"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLastEpisode_anime_id_key" ON "AnimeLastEpisode"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLatestEpisode_anime_id_key" ON "AnimeLatestEpisode"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeNextEpisode_anime_id_key" ON "AnimeNextEpisode"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimePoster_anime_id_key" ON "AnimePoster"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStartDate_anime_id_key" ON "AnimeStartDate"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTagEdge_anime_id_tag_id_key" ON "AnimeTagEdge"("anime_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTitle_anime_id_key" ON "AnimeTitle"("anime_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceImage_voice_actor_id_key" ON "AnimeVoiceImage"("voice_actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceName_voice_actor_id_key" ON "AnimeVoiceName"("voice_actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeThumbnail_episode_id_key" ON "EpisodeThumbnail"("episode_id");

-- CreateIndex
CREATE UNIQUE INDEX "Mappings_source_id_source_name_key" ON "Mappings"("source_id", "source_name");

-- CreateIndex
CREATE UNIQUE INDEX "Meta_anime_id_key" ON "Meta"("anime_id");

-- CreateIndex
CREATE INDEX "UpdateHistory_anime_id_created_at_idx" ON "UpdateHistory"("anime_id", "created_at");

-- CreateIndex
CREATE INDEX "UpdateHistory_success_created_at_idx" ON "UpdateHistory"("success", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "UpdateQueue_anime_id_key" ON "UpdateQueue"("anime_id");

-- CreateIndex
CREATE INDEX "UpdateQueue_priority_added_at_idx" ON "UpdateQueue"("priority", "added_at");

-- CreateIndex
CREATE INDEX "UpdateQueue_anime_id_idx" ON "UpdateQueue"("anime_id");

-- AddForeignKey
ALTER TABLE "AnimePoster" ADD CONSTRAINT "anime_poster_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeTitle" ADD CONSTRAINT "anime_title_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeStartDate" ADD CONSTRAINT "anime_start_date_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeEndDate" ADD CONSTRAINT "anime_end_date_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeAiringSchedule" ADD CONSTRAINT "AnimeAiringSchedule_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeLatestEpisode" ADD CONSTRAINT "AnimeLatestEpisode_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeNextEpisode" ADD CONSTRAINT "AnimeNextEpisode_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeLastEpisode" ADD CONSTRAINT "AnimeLastEpisode_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCharacterEdge" ADD CONSTRAINT "AnimeCharacterEdge_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCharacterEdge" ADD CONSTRAINT "AnimeCharacterEdge_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "AnimeCharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCharacterName" ADD CONSTRAINT "AnimeCharacterName_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "AnimeCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCharacterImage" ADD CONSTRAINT "AnimeCharacterImage_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "AnimeCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeVoiceName" ADD CONSTRAINT "AnimeVoiceName_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "AnimeVoiceActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeVoiceImage" ADD CONSTRAINT "AnimeVoiceImage_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "AnimeVoiceActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeStudioEdge" ADD CONSTRAINT "AnimeStudioEdge_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeStudioEdge" ADD CONSTRAINT "AnimeStudioEdge_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "AnimeStudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeTagEdge" ADD CONSTRAINT "AnimeTagEdge_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeTagEdge" ADD CONSTRAINT "AnimeTagEdge_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "AnimeTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRanking" ADD CONSTRAINT "AnimeRanking_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeExternalLink" ADD CONSTRAINT "AnimeExternalLink_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeScoreDistribution" ADD CONSTRAINT "AnimeScoreDistribution_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeStatusDistribution" ADD CONSTRAINT "AnimeStatusDistribution_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKeyUsage" ADD CONSTRAINT "ApiKeyUsage_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mappings" ADD CONSTRAINT "Mappings_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "Meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeThumbnail" ADD CONSTRAINT "EpisodeThumbnail_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chronology" ADD CONSTRAINT "Chronology_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "Meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
