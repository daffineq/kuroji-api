/*
  Warnings:

  - A unique constraint covering the columns `[anilistId,tagId]` on the table `AnilistTagEdge` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tagId` on table `AnilistTagEdge` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AnilistTagEdge" DROP CONSTRAINT "AnilistTagEdge_tagId_fkey";

-- AlterTable
ALTER TABLE "AnilistTagEdge" ALTER COLUMN "tagId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Anilibria" (
    "id" INTEGER NOT NULL,
    "anilistId" INTEGER,
    "year" INTEGER,
    "alias" TEXT,
    "freshAt" TEXT,
    "createdAt" TEXT,
    "updatedAt" TEXT,
    "isOngoing" BOOLEAN,
    "publishDay" INTEGER,
    "description" TEXT,
    "notification" TEXT,
    "episodesTotal" INTEGER,
    "externalPlayer" TEXT,
    "isInProduction" BOOLEAN,
    "isBlockedByGeo" BOOLEAN,
    "isBlockedByCopyrights" BOOLEAN,
    "addedInUsersFavorites" INTEGER,
    "averageDurationOfEpisode" INTEGER,
    "addedInPlannedCollection" INTEGER,
    "addedInWatchedCollection" INTEGER,
    "addedInWatchingCollection" INTEGER,
    "addedInPostponedCollection" INTEGER,
    "addedInAbandonedCollection" INTEGER,

    CONSTRAINT "Anilibria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaType" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "value" TEXT,
    "description" TEXT,

    CONSTRAINT "AnilibriaType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaName" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "main" TEXT,
    "english" TEXT,
    "alternative" TEXT,

    CONSTRAINT "AnilibriaName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaSeason" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "value" TEXT,
    "description" TEXT,

    CONSTRAINT "AnilibriaSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaPoster" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "preview" TEXT,
    "thumbnail" TEXT,
    "optimizedPreview" TEXT,
    "optimizedThumbnail" TEXT,

    CONSTRAINT "AnilibriaPoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaAgeRating" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "value" TEXT,
    "label" TEXT,
    "isAdult" BOOLEAN,
    "description" TEXT,

    CONSTRAINT "AnilibriaAgeRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaSponsor" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "sponsorId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "urlTitle" TEXT,
    "url" TEXT,

    CONSTRAINT "AnilibriaSponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaGenreEdge" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "totalReleases" INTEGER,

    CONSTRAINT "AnilibriaGenreEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaGenre" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "preview" TEXT,
    "thumbnail" TEXT,
    "optimizedPreview" TEXT,
    "optimizedThumbnail" TEXT,

    CONSTRAINT "AnilibriaGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaMemberEdge" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "memberId" TEXT NOT NULL,
    "nickname" TEXT,

    CONSTRAINT "AnilibriaMemberEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaMember" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AnilibriaMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaMemberRole" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,

    CONSTRAINT "AnilibriaMemberRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaMemberUser" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "userId" INTEGER,
    "preview" TEXT,
    "thumbnail" TEXT,
    "optimizedPreview" TEXT,
    "optimizedThumbnail" TEXT,

    CONSTRAINT "AnilibriaMemberUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaEpisode" (
    "id" TEXT NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "name" TEXT,
    "nameEnglish" TEXT,
    "ordinal" DOUBLE PRECISION,
    "duration" INTEGER,
    "rutubeId" TEXT,
    "youtubeId" TEXT,
    "updatedAt" TEXT,
    "sortOrder" INTEGER,
    "releaseId" INTEGER,
    "hls480" TEXT,
    "hls720" TEXT,
    "hls1080" TEXT,

    CONSTRAINT "AnilibriaEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaEpisodeEnding" (
    "id" SERIAL NOT NULL,
    "episodeId" TEXT NOT NULL,
    "start" INTEGER,
    "stop" INTEGER,

    CONSTRAINT "AnilibriaEpisodeEnding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaEpisodeOpening" (
    "id" SERIAL NOT NULL,
    "episodeId" TEXT NOT NULL,
    "start" INTEGER,
    "stop" INTEGER,

    CONSTRAINT "AnilibriaEpisodeOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaEpisodePreview" (
    "id" SERIAL NOT NULL,
    "episodeId" TEXT NOT NULL,
    "preview" TEXT,
    "thumbnail" TEXT,
    "optimizedPreview" TEXT,
    "optimizedThumbnail" TEXT,

    CONSTRAINT "AnilibriaEpisodePreview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaTorrent" (
    "id" INTEGER NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "hash" TEXT,
    "size" BIGINT,
    "label" TEXT,
    "magnet" TEXT,
    "filename" TEXT,
    "seeders" INTEGER,
    "bitrate" INTEGER,
    "leechers" INTEGER,
    "sortOrder" INTEGER,
    "updatedAt" TEXT,
    "isHardsub" BOOLEAN,
    "description" TEXT,
    "createdAt" TEXT,
    "completedTimes" INTEGER,

    CONSTRAINT "AnilibriaTorrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaTorrentType" (
    "id" SERIAL NOT NULL,
    "torrentId" INTEGER NOT NULL,
    "value" TEXT,
    "description" TEXT,

    CONSTRAINT "AnilibriaTorrentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaTorrentColor" (
    "id" SERIAL NOT NULL,
    "torrentId" INTEGER NOT NULL,
    "value" TEXT,
    "description" TEXT,

    CONSTRAINT "AnilibriaTorrentColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaTorrentCodec" (
    "id" SERIAL NOT NULL,
    "torrentId" INTEGER NOT NULL,
    "value" TEXT,
    "label" TEXT,
    "description" TEXT,
    "labelColor" TEXT,
    "labelIsVisible" BOOLEAN,

    CONSTRAINT "AnilibriaTorrentCodec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilibriaTorrentQuality" (
    "id" SERIAL NOT NULL,
    "torrentId" INTEGER NOT NULL,
    "value" TEXT,
    "description" TEXT,

    CONSTRAINT "AnilibriaTorrentQuality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Anilibria_anilistId_key" ON "Anilibria"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "Anilibria_alias_key" ON "Anilibria"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaType_anilibriaId_key" ON "AnilibriaType"("anilibriaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaName_anilibriaId_key" ON "AnilibriaName"("anilibriaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaSeason_anilibriaId_key" ON "AnilibriaSeason"("anilibriaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaPoster_anilibriaId_key" ON "AnilibriaPoster"("anilibriaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaAgeRating_anilibriaId_key" ON "AnilibriaAgeRating"("anilibriaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaSponsor_anilibriaId_key" ON "AnilibriaSponsor"("anilibriaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaMemberRole_memberId_key" ON "AnilibriaMemberRole"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaMemberUser_memberId_key" ON "AnilibriaMemberUser"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaEpisodeEnding_episodeId_key" ON "AnilibriaEpisodeEnding"("episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaEpisodeOpening_episodeId_key" ON "AnilibriaEpisodeOpening"("episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaEpisodePreview_episodeId_key" ON "AnilibriaEpisodePreview"("episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaTorrentType_torrentId_key" ON "AnilibriaTorrentType"("torrentId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaTorrentColor_torrentId_key" ON "AnilibriaTorrentColor"("torrentId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaTorrentCodec_torrentId_key" ON "AnilibriaTorrentCodec"("torrentId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaTorrentQuality_torrentId_key" ON "AnilibriaTorrentQuality"("torrentId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilistTagEdge_anilistId_tagId_key" ON "AnilistTagEdge"("anilistId", "tagId");

-- AddForeignKey
ALTER TABLE "Anilibria" ADD CONSTRAINT "Anilibria_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaType" ADD CONSTRAINT "AnilibriaType_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaName" ADD CONSTRAINT "AnilibriaName_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaSeason" ADD CONSTRAINT "AnilibriaSeason_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaPoster" ADD CONSTRAINT "AnilibriaPoster_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaAgeRating" ADD CONSTRAINT "AnilibriaAgeRating_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaSponsor" ADD CONSTRAINT "AnilibriaSponsor_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaGenreEdge" ADD CONSTRAINT "AnilibriaGenreEdge_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaGenreEdge" ADD CONSTRAINT "AnilibriaGenreEdge_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "AnilibriaGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaMemberEdge" ADD CONSTRAINT "AnilibriaMemberEdge_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaMemberEdge" ADD CONSTRAINT "AnilibriaMemberEdge_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "AnilibriaMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaMemberRole" ADD CONSTRAINT "AnilibriaMemberRole_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "AnilibriaMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaMemberUser" ADD CONSTRAINT "AnilibriaMemberUser_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "AnilibriaMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaEpisode" ADD CONSTRAINT "AnilibriaEpisode_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaEpisodeEnding" ADD CONSTRAINT "AnilibriaEpisodeEnding_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "AnilibriaEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaEpisodeOpening" ADD CONSTRAINT "AnilibriaEpisodeOpening_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "AnilibriaEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaEpisodePreview" ADD CONSTRAINT "AnilibriaEpisodePreview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "AnilibriaEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaTorrent" ADD CONSTRAINT "AnilibriaTorrent_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaTorrentType" ADD CONSTRAINT "AnilibriaTorrentType_torrentId_fkey" FOREIGN KEY ("torrentId") REFERENCES "AnilibriaTorrent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaTorrentColor" ADD CONSTRAINT "AnilibriaTorrentColor_torrentId_fkey" FOREIGN KEY ("torrentId") REFERENCES "AnilibriaTorrent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaTorrentCodec" ADD CONSTRAINT "AnilibriaTorrentCodec_torrentId_fkey" FOREIGN KEY ("torrentId") REFERENCES "AnilibriaTorrent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilibriaTorrentQuality" ADD CONSTRAINT "AnilibriaTorrentQuality_torrentId_fkey" FOREIGN KEY ("torrentId") REFERENCES "AnilibriaTorrent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistTagEdge" ADD CONSTRAINT "AnilistTagEdge_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "AnilistTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
