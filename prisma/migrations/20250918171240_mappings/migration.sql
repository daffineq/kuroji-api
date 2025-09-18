/*
  Warnings:

  - The primary key for the `Anime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `Anime` table. All the data in the column will be lost.
  - The primary key for the `AnimeAiringSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeAiringSchedule` table. All the data in the column will be lost.
  - The primary key for the `AnimeCharacter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeCharacter` table. All the data in the column will be lost.
  - The primary key for the `AnimeCharacterEdge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alId` on the `AnimeCharacterEdge` table. All the data in the column will be lost.
  - The `characterId` column on the `AnimeCharacterImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `characterId` column on the `AnimeCharacterName` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AnimeExternalLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeExternalLink` table. All the data in the column will be lost.
  - You are about to drop the column `animeId` on the `AnimeGenre` table. All the data in the column will be lost.
  - The primary key for the `AnimeLastEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeLastEpisode` table. All the data in the column will be lost.
  - The primary key for the `AnimeLatestEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeLatestEpisode` table. All the data in the column will be lost.
  - The primary key for the `AnimeNextEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeNextEpisode` table. All the data in the column will be lost.
  - The primary key for the `AnimeRanking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeRanking` table. All the data in the column will be lost.
  - The primary key for the `AnimeStudio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeStudio` table. All the data in the column will be lost.
  - The primary key for the `AnimeStudioEdge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeStudioEdge` table. All the data in the column will be lost.
  - The primary key for the `AnimeTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeTag` table. All the data in the column will be lost.
  - The primary key for the `AnimeVoiceActor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAl` on the `AnimeVoiceActor` table. All the data in the column will be lost.
  - The `voiceActorId` column on the `AnimeVoiceImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `voiceActorId` column on the `AnimeVoiceName` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `mappingsId` on the `Episode` table. All the data in the column will be lost.
  - The primary key for the `_CharacterVoiceActors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `AnimeArtwork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeBanner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeOtherBanner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeOtherDescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeOtherPoster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeOtherTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeScreenshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimeArtworks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimeScreenshots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimeVideos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Anime` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeAiringSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeAiringSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeCharacter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeCharacterEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeCharacterEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `characterId` on the `AnimeCharacterEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeEndDate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeExternalLink` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeExternalLink` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeLastEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeLastEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeLatestEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeLatestEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeNextEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeNextEpisode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimePoster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeRanking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeRanking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeScoreDistribution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeStartDate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeStatusDistribution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeStudio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeStudioEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeStudioEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `studioId` on the `AnimeStudioEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeTagEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tagId` on the `AnimeTagEdge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `AnimeTitle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `AnimeVoiceActor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_CharacterVoiceActors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_CharacterVoiceActors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."AnimeAiringSchedule" DROP CONSTRAINT "AnimeAiringSchedule_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeBanner" DROP CONSTRAINT "anime_banner_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeCharacterEdge" DROP CONSTRAINT "AnimeCharacterEdge_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeCharacterEdge" DROP CONSTRAINT "AnimeCharacterEdge_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeCharacterImage" DROP CONSTRAINT "AnimeCharacterImage_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeCharacterName" DROP CONSTRAINT "AnimeCharacterName_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeEndDate" DROP CONSTRAINT "anime_end_date_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeExternalLink" DROP CONSTRAINT "AnimeExternalLink_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeGenre" DROP CONSTRAINT "AnimeGenre_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeLastEpisode" DROP CONSTRAINT "AnimeLastEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeLatestEpisode" DROP CONSTRAINT "AnimeLatestEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeNextEpisode" DROP CONSTRAINT "AnimeNextEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeOtherBanner" DROP CONSTRAINT "AnimeOtherBanner_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeOtherDescription" DROP CONSTRAINT "AnimeOtherDescription_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeOtherPoster" DROP CONSTRAINT "AnimeOtherPoster_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeOtherTitle" DROP CONSTRAINT "AnimeOtherTitle_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimePoster" DROP CONSTRAINT "anime_poster_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeRanking" DROP CONSTRAINT "AnimeRanking_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeScoreDistribution" DROP CONSTRAINT "AnimeScoreDistribution_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStartDate" DROP CONSTRAINT "anime_start_date_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStatusDistribution" DROP CONSTRAINT "AnimeStatusDistribution_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStudioEdge" DROP CONSTRAINT "AnimeStudioEdge_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStudioEdge" DROP CONSTRAINT "AnimeStudioEdge_studioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeTagEdge" DROP CONSTRAINT "AnimeTagEdge_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeTagEdge" DROP CONSTRAINT "AnimeTagEdge_tagId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeTitle" DROP CONSTRAINT "anime_title_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeVoiceImage" DROP CONSTRAINT "AnimeVoiceImage_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeVoiceName" DROP CONSTRAINT "AnimeVoiceName_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Episode" DROP CONSTRAINT "Episode_mappingsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeArtworks" DROP CONSTRAINT "_AnimeArtworks_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeArtworks" DROP CONSTRAINT "_AnimeArtworks_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeScreenshots" DROP CONSTRAINT "_AnimeScreenshots_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeScreenshots" DROP CONSTRAINT "_AnimeScreenshots_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeVideos" DROP CONSTRAINT "_AnimeVideos_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeVideos" DROP CONSTRAINT "_AnimeVideos_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" DROP CONSTRAINT "_CharacterVoiceActors_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" DROP CONSTRAINT "_CharacterVoiceActors_B_fkey";

-- DropIndex
DROP INDEX "public"."Anime_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeAiringSchedule_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeCharacter_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeCharacterEdge_alId_key";

-- DropIndex
DROP INDEX "public"."AnimeExternalLink_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeGenre_animeId_key";

-- DropIndex
DROP INDEX "public"."AnimeLastEpisode_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeLatestEpisode_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeNextEpisode_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeRanking_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeStudio_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeStudioEdge_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeTag_idAl_key";

-- DropIndex
DROP INDEX "public"."AnimeVoiceActor_idAl_key";

-- AlterTable
ALTER TABLE "public"."Anime" DROP CONSTRAINT "Anime_pkey",
DROP COLUMN "idAl",
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "synonyms" TEXT[],
ADD COLUMN     "updatedAt" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Anime_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeAiringSchedule" DROP CONSTRAINT "AnimeAiringSchedule_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeAiringSchedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeCharacter" DROP CONSTRAINT "AnimeCharacter_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeCharacter_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeCharacterEdge" DROP CONSTRAINT "AnimeCharacterEdge_pkey",
DROP COLUMN "alId",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
DROP COLUMN "characterId",
ADD COLUMN     "characterId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeCharacterEdge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeCharacterImage" DROP COLUMN "characterId",
ADD COLUMN     "characterId" INTEGER;

-- AlterTable
ALTER TABLE "public"."AnimeCharacterName" DROP COLUMN "characterId",
ADD COLUMN     "characterId" INTEGER;

-- AlterTable
ALTER TABLE "public"."AnimeEndDate" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeExternalLink" DROP CONSTRAINT "AnimeExternalLink_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeExternalLink_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeGenre" DROP COLUMN "animeId";

-- AlterTable
ALTER TABLE "public"."AnimeLastEpisode" DROP CONSTRAINT "AnimeLastEpisode_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeLastEpisode_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeLatestEpisode" DROP CONSTRAINT "AnimeLatestEpisode_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeLatestEpisode_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeNextEpisode" DROP CONSTRAINT "AnimeNextEpisode_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeNextEpisode_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimePoster" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeRanking" DROP CONSTRAINT "AnimeRanking_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeRanking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeScoreDistribution" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeStartDate" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeStatusDistribution" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeStudio" DROP CONSTRAINT "AnimeStudio_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeStudio_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeStudioEdge" DROP CONSTRAINT "AnimeStudioEdge_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
DROP COLUMN "studioId",
ADD COLUMN     "studioId" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeStudioEdge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeTag" DROP CONSTRAINT "AnimeTag_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeTag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeTagEdge" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL,
DROP COLUMN "tagId",
ADD COLUMN     "tagId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeTitle" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnimeVoiceActor" DROP CONSTRAINT "AnimeVoiceActor_pkey",
DROP COLUMN "idAl",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "AnimeVoiceActor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnimeVoiceImage" DROP COLUMN "voiceActorId",
ADD COLUMN     "voiceActorId" INTEGER;

-- AlterTable
ALTER TABLE "public"."AnimeVoiceName" DROP COLUMN "voiceActorId",
ADD COLUMN     "voiceActorId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Episode" DROP COLUMN "mappingsId";

-- AlterTable
ALTER TABLE "public"."_CharacterVoiceActors" DROP CONSTRAINT "_CharacterVoiceActors_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_CharacterVoiceActors_AB_pkey" PRIMARY KEY ("A", "B");

-- DropTable
DROP TABLE "public"."AnimeArtwork";

-- DropTable
DROP TABLE "public"."AnimeBanner";

-- DropTable
DROP TABLE "public"."AnimeOtherBanner";

-- DropTable
DROP TABLE "public"."AnimeOtherDescription";

-- DropTable
DROP TABLE "public"."AnimeOtherPoster";

-- DropTable
DROP TABLE "public"."AnimeOtherTitle";

-- DropTable
DROP TABLE "public"."AnimeScreenshot";

-- DropTable
DROP TABLE "public"."AnimeVideo";

-- DropTable
DROP TABLE "public"."_AnimeArtworks";

-- DropTable
DROP TABLE "public"."_AnimeScreenshots";

-- DropTable
DROP TABLE "public"."_AnimeVideos";

-- CreateTable
CREATE TABLE "public"."Title" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Poster" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "source" TEXT NOT NULL,

    CONSTRAINT "Poster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "source" TEXT NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Video" (
    "url" TEXT NOT NULL,
    "title" TEXT,
    "thumbnail" TEXT,
    "artist" TEXT,
    "type" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("url")
);

-- CreateTable
CREATE TABLE "public"."Screenshot" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT,
    "x166Url" TEXT,
    "x332Url" TEXT,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artwork" (
    "id" INTEGER NOT NULL,
    "height" INTEGER,
    "image" TEXT,
    "includesText" BOOLEAN,
    "language" TEXT,
    "score" INTEGER,
    "thumbnail" TEXT,
    "type" INTEGER,
    "width" INTEGER,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToTitle" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MappingsToTitle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToPoster" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MappingsToPoster_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToVideo" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MappingsToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToScreenshot" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MappingsToScreenshot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToEpisode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MappingsToEpisode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToBanner" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MappingsToBanner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToArtwork" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MappingsToArtwork_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AnimeGenres" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnimeGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Title_title_source_language_key" ON "public"."Title"("title", "source", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Poster_url_source_key" ON "public"."Poster"("url", "source");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_url_source_key" ON "public"."Banner"("url", "source");

-- CreateIndex
CREATE INDEX "_MappingsToTitle_B_index" ON "public"."_MappingsToTitle"("B");

-- CreateIndex
CREATE INDEX "_MappingsToPoster_B_index" ON "public"."_MappingsToPoster"("B");

-- CreateIndex
CREATE INDEX "_MappingsToVideo_B_index" ON "public"."_MappingsToVideo"("B");

-- CreateIndex
CREATE INDEX "_MappingsToScreenshot_B_index" ON "public"."_MappingsToScreenshot"("B");

-- CreateIndex
CREATE INDEX "_MappingsToEpisode_B_index" ON "public"."_MappingsToEpisode"("B");

-- CreateIndex
CREATE INDEX "_MappingsToBanner_B_index" ON "public"."_MappingsToBanner"("B");

-- CreateIndex
CREATE INDEX "_MappingsToArtwork_B_index" ON "public"."_MappingsToArtwork"("B");

-- CreateIndex
CREATE INDEX "_AnimeGenres_B_index" ON "public"."_AnimeGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterImage_characterId_key" ON "public"."AnimeCharacterImage"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterName_characterId_key" ON "public"."AnimeCharacterName"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeEndDate_animeId_key" ON "public"."AnimeEndDate"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLastEpisode_animeId_key" ON "public"."AnimeLastEpisode"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLatestEpisode_animeId_key" ON "public"."AnimeLatestEpisode"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeNextEpisode_animeId_key" ON "public"."AnimeNextEpisode"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimePoster_animeId_key" ON "public"."AnimePoster"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStartDate_animeId_key" ON "public"."AnimeStartDate"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTagEdge_animeId_tagId_key" ON "public"."AnimeTagEdge"("animeId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTitle_animeId_key" ON "public"."AnimeTitle"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceImage_voiceActorId_key" ON "public"."AnimeVoiceImage"("voiceActorId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceName_voiceActorId_key" ON "public"."AnimeVoiceName"("voiceActorId");

-- CreateIndex
CREATE INDEX "_CharacterVoiceActors_B_index" ON "public"."_CharacterVoiceActors"("B");

-- AddForeignKey
ALTER TABLE "public"."AnimePoster" ADD CONSTRAINT "anime_poster_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeTitle" ADD CONSTRAINT "anime_title_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStartDate" ADD CONSTRAINT "anime_start_date_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeEndDate" ADD CONSTRAINT "anime_end_date_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeAiringSchedule" ADD CONSTRAINT "AnimeAiringSchedule_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeLatestEpisode" ADD CONSTRAINT "AnimeLatestEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeNextEpisode" ADD CONSTRAINT "AnimeNextEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeLastEpisode" ADD CONSTRAINT "AnimeLastEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterEdge" ADD CONSTRAINT "AnimeCharacterEdge_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterEdge" ADD CONSTRAINT "AnimeCharacterEdge_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterName" ADD CONSTRAINT "AnimeCharacterName_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterImage" ADD CONSTRAINT "AnimeCharacterImage_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeVoiceName" ADD CONSTRAINT "AnimeVoiceName_voiceActorId_fkey" FOREIGN KEY ("voiceActorId") REFERENCES "public"."AnimeVoiceActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeVoiceImage" ADD CONSTRAINT "AnimeVoiceImage_voiceActorId_fkey" FOREIGN KEY ("voiceActorId") REFERENCES "public"."AnimeVoiceActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStudioEdge" ADD CONSTRAINT "AnimeStudioEdge_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStudioEdge" ADD CONSTRAINT "AnimeStudioEdge_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."AnimeStudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeTagEdge" ADD CONSTRAINT "AnimeTagEdge_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeTagEdge" ADD CONSTRAINT "AnimeTagEdge_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."AnimeTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeRanking" ADD CONSTRAINT "AnimeRanking_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeExternalLink" ADD CONSTRAINT "AnimeExternalLink_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeScoreDistribution" ADD CONSTRAINT "AnimeScoreDistribution_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStatusDistribution" ADD CONSTRAINT "AnimeStatusDistribution_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToTitle" ADD CONSTRAINT "_MappingsToTitle_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToTitle" ADD CONSTRAINT "_MappingsToTitle_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToPoster" ADD CONSTRAINT "_MappingsToPoster_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToPoster" ADD CONSTRAINT "_MappingsToPoster_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Poster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToVideo" ADD CONSTRAINT "_MappingsToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToVideo" ADD CONSTRAINT "_MappingsToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Video"("url") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToScreenshot" ADD CONSTRAINT "_MappingsToScreenshot_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToScreenshot" ADD CONSTRAINT "_MappingsToScreenshot_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Screenshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToEpisode" ADD CONSTRAINT "_MappingsToEpisode_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToEpisode" ADD CONSTRAINT "_MappingsToEpisode_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToBanner" ADD CONSTRAINT "_MappingsToBanner_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToBanner" ADD CONSTRAINT "_MappingsToBanner_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToArtwork" ADD CONSTRAINT "_MappingsToArtwork_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToArtwork" ADD CONSTRAINT "_MappingsToArtwork_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeGenres" ADD CONSTRAINT "_AnimeGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeGenres" ADD CONSTRAINT "_AnimeGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AnimeGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" ADD CONSTRAINT "_CharacterVoiceActors_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."AnimeCharacterEdge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" ADD CONSTRAINT "_CharacterVoiceActors_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AnimeVoiceActor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
