/*
  Warnings:

  - You are about to drop the column `moreInfo` on the `Anilist` table. All the data in the column will be lost.
  - You are about to drop the `AnilistJikanEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistMusicVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistPromoVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistVideoImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistVideoMeta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnilistJikanEpisode" DROP CONSTRAINT "AnilistJikanEpisode_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "AnilistMusicVideo" DROP CONSTRAINT "AnilistMusicVideo_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "AnilistPromoVideo" DROP CONSTRAINT "AnilistPromoVideo_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "AnilistVideoImages" DROP CONSTRAINT "AnilistVideoImages_musicVideoYoutubeId_fkey";

-- DropForeignKey
ALTER TABLE "AnilistVideoImages" DROP CONSTRAINT "AnilistVideoImages_promoVideoYoutubeId_fkey";

-- DropForeignKey
ALTER TABLE "AnilistVideoMeta" DROP CONSTRAINT "AnilistVideoMeta_musicVideoYoutubeId_fkey";

-- AlterTable
ALTER TABLE "Anilist" DROP COLUMN "moreInfo";

-- DropTable
DROP TABLE "AnilistJikanEpisode";

-- DropTable
DROP TABLE "AnilistMusicVideo";

-- DropTable
DROP TABLE "AnilistPromoVideo";

-- DropTable
DROP TABLE "AnilistVideoImages";

-- DropTable
DROP TABLE "AnilistVideoMeta";
