/*
  Warnings:

  - The primary key for the `Mappings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `franchise` on the `Mappings` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Mappings` table. All the data in the column will be lost.
  - You are about to drop the `Mapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToArtwork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToDescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToScreenshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToVideo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sourceId,sourceName]` on the table `Mappings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `metaId` to the `Mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `Mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceName` to the `Mappings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mapping" DROP CONSTRAINT "Mapping_mappingsId_fkey";

-- DropForeignKey
ALTER TABLE "Mappings" DROP CONSTRAINT "Mappings_id_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToArtwork" DROP CONSTRAINT "_MappingsToArtwork_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToArtwork" DROP CONSTRAINT "_MappingsToArtwork_B_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToDescription" DROP CONSTRAINT "_MappingsToDescription_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToDescription" DROP CONSTRAINT "_MappingsToDescription_B_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToEpisode" DROP CONSTRAINT "_MappingsToEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToEpisode" DROP CONSTRAINT "_MappingsToEpisode_B_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToImage" DROP CONSTRAINT "_MappingsToImage_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToImage" DROP CONSTRAINT "_MappingsToImage_B_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToScreenshot" DROP CONSTRAINT "_MappingsToScreenshot_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToScreenshot" DROP CONSTRAINT "_MappingsToScreenshot_B_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToTitle" DROP CONSTRAINT "_MappingsToTitle_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToTitle" DROP CONSTRAINT "_MappingsToTitle_B_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToVideo" DROP CONSTRAINT "_MappingsToVideo_A_fkey";

-- DropForeignKey
ALTER TABLE "_MappingsToVideo" DROP CONSTRAINT "_MappingsToVideo_B_fkey";

-- AlterTable
ALTER TABLE "Mappings" DROP CONSTRAINT "Mappings_pkey",
DROP COLUMN "franchise",
DROP COLUMN "rating",
ADD COLUMN     "metaId" INTEGER NOT NULL,
ADD COLUMN     "sourceId" TEXT NOT NULL,
ADD COLUMN     "sourceName" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mappings_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Mapping";

-- DropTable
DROP TABLE "_MappingsToArtwork";

-- DropTable
DROP TABLE "_MappingsToDescription";

-- DropTable
DROP TABLE "_MappingsToEpisode";

-- DropTable
DROP TABLE "_MappingsToImage";

-- DropTable
DROP TABLE "_MappingsToScreenshot";

-- DropTable
DROP TABLE "_MappingsToTitle";

-- DropTable
DROP TABLE "_MappingsToVideo";

-- CreateTable
CREATE TABLE "Meta" (
    "id" INTEGER NOT NULL,
    "franchise" TEXT,
    "rating" TEXT,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MetaToTitle" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MetaToTitle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MetaToVideo" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MetaToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MetaToScreenshot" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MetaToScreenshot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MetaToEpisode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MetaToEpisode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MetaToDescription" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MetaToDescription_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MetaToImage" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MetaToImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MetaToArtwork" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MetaToArtwork_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MetaToTitle_B_index" ON "_MetaToTitle"("B");

-- CreateIndex
CREATE INDEX "_MetaToVideo_B_index" ON "_MetaToVideo"("B");

-- CreateIndex
CREATE INDEX "_MetaToScreenshot_B_index" ON "_MetaToScreenshot"("B");

-- CreateIndex
CREATE INDEX "_MetaToEpisode_B_index" ON "_MetaToEpisode"("B");

-- CreateIndex
CREATE INDEX "_MetaToDescription_B_index" ON "_MetaToDescription"("B");

-- CreateIndex
CREATE INDEX "_MetaToImage_B_index" ON "_MetaToImage"("B");

-- CreateIndex
CREATE INDEX "_MetaToArtwork_B_index" ON "_MetaToArtwork"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Mappings_sourceId_sourceName_key" ON "Mappings"("sourceId", "sourceName");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_id_fkey" FOREIGN KEY ("id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mappings" ADD CONSTRAINT "Mappings_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "Meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToTitle" ADD CONSTRAINT "_MetaToTitle_A_fkey" FOREIGN KEY ("A") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToTitle" ADD CONSTRAINT "_MetaToTitle_B_fkey" FOREIGN KEY ("B") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToVideo" ADD CONSTRAINT "_MetaToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToVideo" ADD CONSTRAINT "_MetaToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("url") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToScreenshot" ADD CONSTRAINT "_MetaToScreenshot_A_fkey" FOREIGN KEY ("A") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToScreenshot" ADD CONSTRAINT "_MetaToScreenshot_B_fkey" FOREIGN KEY ("B") REFERENCES "Screenshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToEpisode" ADD CONSTRAINT "_MetaToEpisode_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToEpisode" ADD CONSTRAINT "_MetaToEpisode_B_fkey" FOREIGN KEY ("B") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToDescription" ADD CONSTRAINT "_MetaToDescription_A_fkey" FOREIGN KEY ("A") REFERENCES "Description"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToDescription" ADD CONSTRAINT "_MetaToDescription_B_fkey" FOREIGN KEY ("B") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToImage" ADD CONSTRAINT "_MetaToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToImage" ADD CONSTRAINT "_MetaToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToArtwork" ADD CONSTRAINT "_MetaToArtwork_A_fkey" FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetaToArtwork" ADD CONSTRAINT "_MetaToArtwork_B_fkey" FOREIGN KEY ("B") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
