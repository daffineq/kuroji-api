/*
  Warnings:

  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Poster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToBanner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MappingsToPoster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_MappingsToBanner" DROP CONSTRAINT "_MappingsToBanner_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_MappingsToBanner" DROP CONSTRAINT "_MappingsToBanner_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_MappingsToPoster" DROP CONSTRAINT "_MappingsToPoster_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_MappingsToPoster" DROP CONSTRAINT "_MappingsToPoster_B_fkey";

-- DropTable
DROP TABLE "public"."Banner";

-- DropTable
DROP TABLE "public"."Poster";

-- DropTable
DROP TABLE "public"."_MappingsToBanner";

-- DropTable
DROP TABLE "public"."_MappingsToPoster";

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToImage" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MappingsToImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_type_source_key" ON "public"."Image"("url", "type", "source");

-- CreateIndex
CREATE INDEX "_MappingsToImage_B_index" ON "public"."_MappingsToImage"("B");

-- AddForeignKey
ALTER TABLE "public"."_MappingsToImage" ADD CONSTRAINT "_MappingsToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToImage" ADD CONSTRAINT "_MappingsToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
