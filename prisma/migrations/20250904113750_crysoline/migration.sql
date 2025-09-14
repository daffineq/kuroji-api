/*
  Warnings:

  - You are about to drop the column `alId` on the `Animepahe` table. All the data in the column will be lost.
  - You are about to drop the column `cover` on the `Animepahe` table. All the data in the column will be lost.
  - You are about to drop the column `episodePages` on the `Animepahe` table. All the data in the column will be lost.
  - You are about to drop the column `hasSub` on the `Animepahe` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Animepahe` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Animepahe` table. All the data in the column will be lost.
  - You are about to drop the column `alID` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `hasDub` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `hasSub` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `japaneseTitle` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `malID` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `subOrDub` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `totalEpisodes` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Zoro` table. All the data in the column will be lost.
  - You are about to drop the `DateDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EpisodeZoro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EpisodeZoro` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idAl]` on the table `Animepahe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idAl]` on the table `Zoro` will be added. If there are existing duplicate values, this will fail.
  - Made the column `updatedAt` on table `Animepahe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Zoro` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Animepahe" DROP CONSTRAINT "Animepahe_alId_fkey";

-- DropForeignKey
ALTER TABLE "Zoro" DROP CONSTRAINT "Zoro_alID_fkey";

-- DropForeignKey
ALTER TABLE "_EpisodeZoro" DROP CONSTRAINT "_EpisodeZoro_A_fkey";

-- DropForeignKey
ALTER TABLE "_EpisodeZoro" DROP CONSTRAINT "_EpisodeZoro_B_fkey";

-- DropIndex
DROP INDEX "Animepahe_alId_key";

-- DropIndex
DROP INDEX "Zoro_alID_key";

-- AlterTable
ALTER TABLE "Animepahe" DROP COLUMN "alId",
DROP COLUMN "cover",
DROP COLUMN "episodePages",
DROP COLUMN "hasSub",
DROP COLUMN "releaseDate",
DROP COLUMN "title",
ADD COLUMN     "airedEpisodes" INTEGER,
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "demographics" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "idAl" INTEGER,
ADD COLUMN     "idMal" INTEGER,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "startDate" TEXT,
ADD COLUMN     "studios" TEXT[],
ADD COLUMN     "synonyms" TEXT[],
ADD COLUMN     "themes" TEXT[],
ADD COLUMN     "titleEnglish" TEXT,
ADD COLUMN     "titleJapanese" TEXT,
ADD COLUMN     "titleRomaji" TEXT,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Zoro" DROP COLUMN "alID",
DROP COLUMN "hasDub",
DROP COLUMN "hasSub",
DROP COLUMN "japaneseTitle",
DROP COLUMN "malID",
DROP COLUMN "status",
DROP COLUMN "subOrDub",
DROP COLUMN "title",
DROP COLUMN "totalEpisodes",
DROP COLUMN "url",
ADD COLUMN     "adult" BOOLEAN,
ADD COLUMN     "airedEpisodes" INTEGER,
ADD COLUMN     "dubCount" INTEGER,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "idAl" INTEGER,
ADD COLUMN     "idMal" INTEGER,
ADD COLUMN     "producers" TEXT[],
ADD COLUMN     "rating" TEXT,
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "startDate" TEXT,
ADD COLUMN     "studios" TEXT[],
ADD COLUMN     "subCount" INTEGER,
ADD COLUMN     "synonyms" TEXT[],
ADD COLUMN     "titleEnglish" TEXT,
ADD COLUMN     "titleRomaji" TEXT,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT 0;

-- DropTable
DROP TABLE "DateDetails";

-- DropTable
DROP TABLE "EpisodeZoro";

-- DropTable
DROP TABLE "_EpisodeZoro";

-- CreateTable
CREATE TABLE "ZoroEpisode" (
    "id" INTEGER NOT NULL,
    "title" TEXT,
    "number" INTEGER,
    "isFiller" BOOLEAN,
    "titleJp" TEXT,

    CONSTRAINT "ZoroEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoroSeason" (
    "id" TEXT NOT NULL,
    "dataNumber" INTEGER,
    "dataId" INTEGER,
    "season" TEXT,
    "title" TEXT,
    "image" TEXT,

    CONSTRAINT "ZoroSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ZoroEpisode" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ZoroEpisode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ZoroSeason" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ZoroSeason_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ZoroEpisode_B_index" ON "_ZoroEpisode"("B");

-- CreateIndex
CREATE INDEX "_ZoroSeason_B_index" ON "_ZoroSeason"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Animepahe_idAl_key" ON "Animepahe"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "Zoro_idAl_key" ON "Zoro"("idAl");

-- AddForeignKey
ALTER TABLE "Animepahe" ADD CONSTRAINT "Animepahe_idAl_fkey" FOREIGN KEY ("idAl") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zoro" ADD CONSTRAINT "Zoro_idAl_fkey" FOREIGN KEY ("idAl") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ZoroEpisode" ADD CONSTRAINT "_ZoroEpisode_A_fkey" FOREIGN KEY ("A") REFERENCES "Zoro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ZoroEpisode" ADD CONSTRAINT "_ZoroEpisode_B_fkey" FOREIGN KEY ("B") REFERENCES "ZoroEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ZoroSeason" ADD CONSTRAINT "_ZoroSeason_A_fkey" FOREIGN KEY ("A") REFERENCES "Zoro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ZoroSeason" ADD CONSTRAINT "_ZoroSeason_B_fkey" FOREIGN KEY ("B") REFERENCES "ZoroSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;
