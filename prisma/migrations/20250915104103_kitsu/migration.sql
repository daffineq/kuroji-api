/*
  Warnings:

  - You are about to drop the column `anilistId` on the `Kitsu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Shikimori` table. All the data in the column will be lost.
  - You are about to drop the column `nextEpisodeAt` on the `Shikimori` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shikimori` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `Tmdb` table. All the data in the column will be lost.
  - You are about to drop the `BasicIdShik` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuDimension` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuImageDimensions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShikimoriChronology` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idAl]` on the table `Kitsu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Kitsu" DROP CONSTRAINT "Kitsu_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuDimension" DROP CONSTRAINT "KitsuDimension_largeDimensionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuDimension" DROP CONSTRAINT "KitsuDimension_mediumDimensionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuDimension" DROP CONSTRAINT "KitsuDimension_smallDimensionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuDimension" DROP CONSTRAINT "KitsuDimension_tinyDimensionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuImageDimensions" DROP CONSTRAINT "KitsuImageDimensions_coverImageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuImageDimensions" DROP CONSTRAINT "KitsuImageDimensions_posterImageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShikimoriChronology" DROP CONSTRAINT "_ShikimoriChronology_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShikimoriChronology" DROP CONSTRAINT "_ShikimoriChronology_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."anizip" DROP CONSTRAINT "anizip_id_fkey";

-- DropIndex
DROP INDEX "public"."Kitsu_anilistId_key";

-- AlterTable
ALTER TABLE "public"."Kitsu" DROP COLUMN "anilistId",
ADD COLUMN     "idAl" INTEGER;

-- AlterTable
ALTER TABLE "public"."Shikimori" DROP COLUMN "createdAt",
DROP COLUMN "nextEpisodeAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Tmdb" DROP COLUMN "media_type";

-- DropTable
DROP TABLE "public"."BasicIdShik";

-- DropTable
DROP TABLE "public"."KitsuDimension";

-- DropTable
DROP TABLE "public"."KitsuImageDimensions";

-- DropTable
DROP TABLE "public"."_ShikimoriChronology";

-- CreateTable
CREATE TABLE "public"."Mappings" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mapping" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "mappingsId" INTEGER NOT NULL,

    CONSTRAINT "Mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mapping_sourceId_sourceName_key" ON "public"."Mapping"("sourceId", "sourceName");

-- CreateIndex
CREATE UNIQUE INDEX "Kitsu_idAl_key" ON "public"."Kitsu"("idAl");

-- AddForeignKey
ALTER TABLE "public"."Kitsu" ADD CONSTRAINT "Kitsu_idAl_fkey" FOREIGN KEY ("idAl") REFERENCES "public"."Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mappings" ADD CONSTRAINT "Mappings_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mapping" ADD CONSTRAINT "Mapping_mappingsId_fkey" FOREIGN KEY ("mappingsId") REFERENCES "public"."Mappings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
