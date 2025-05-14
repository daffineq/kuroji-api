/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NameHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Socials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAnime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPrivacy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_socialsId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userPrivacyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userStatsId_fkey";

-- DropForeignKey
ALTER TABLE "UserAnime" DROP CONSTRAINT "UserAnime_userStatsId_fkey";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "NameHistory";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Socials";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAnime";

-- DropTable
DROP TABLE "UserPrivacy";

-- DropTable
DROP TABLE "UserStats";

-- DropEnum
DROP TYPE "AnimeStatus";

-- DropEnum
DROP TYPE "UserAccess";

-- CreateTable
CREATE TABLE "AnilistPromoVideo" (
    "anilistId" INTEGER NOT NULL,
    "title" TEXT,
    "youtubeId" TEXT NOT NULL,
    "url" TEXT,
    "embedUrl" TEXT,

    CONSTRAINT "AnilistPromoVideo_pkey" PRIMARY KEY ("youtubeId")
);

-- CreateTable
CREATE TABLE "AnilistMusicVideo" (
    "anilistId" INTEGER NOT NULL,
    "title" TEXT,
    "youtubeId" TEXT NOT NULL,
    "url" TEXT,
    "embedUrl" TEXT,

    CONSTRAINT "AnilistMusicVideo_pkey" PRIMARY KEY ("youtubeId")
);

-- CreateTable
CREATE TABLE "AnilistVideoImages" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT,
    "smallImageUrl" TEXT,
    "mediumImageUrl" TEXT,
    "largeImageUrl" TEXT,
    "maximumImageUrl" TEXT,
    "promoVideoYoutubeId" TEXT,
    "musicVideoYoutubeId" TEXT,

    CONSTRAINT "AnilistVideoImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilistVideoMeta" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "author" TEXT,
    "musicVideoYoutubeId" TEXT NOT NULL,

    CONSTRAINT "AnilistVideoMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnilistPromoVideo_youtubeId_key" ON "AnilistPromoVideo"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilistMusicVideo_youtubeId_key" ON "AnilistMusicVideo"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilistVideoImages_promoVideoYoutubeId_key" ON "AnilistVideoImages"("promoVideoYoutubeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilistVideoImages_musicVideoYoutubeId_key" ON "AnilistVideoImages"("musicVideoYoutubeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilistVideoMeta_musicVideoYoutubeId_key" ON "AnilistVideoMeta"("musicVideoYoutubeId");

-- AddForeignKey
ALTER TABLE "AnilistPromoVideo" ADD CONSTRAINT "AnilistPromoVideo_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistMusicVideo" ADD CONSTRAINT "AnilistMusicVideo_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistVideoImages" ADD CONSTRAINT "AnilistVideoImages_promoVideoYoutubeId_fkey" FOREIGN KEY ("promoVideoYoutubeId") REFERENCES "AnilistPromoVideo"("youtubeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistVideoImages" ADD CONSTRAINT "AnilistVideoImages_musicVideoYoutubeId_fkey" FOREIGN KEY ("musicVideoYoutubeId") REFERENCES "AnilistMusicVideo"("youtubeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistVideoMeta" ADD CONSTRAINT "AnilistVideoMeta_musicVideoYoutubeId_fkey" FOREIGN KEY ("musicVideoYoutubeId") REFERENCES "AnilistMusicVideo"("youtubeId") ON DELETE RESTRICT ON UPDATE CASCADE;
