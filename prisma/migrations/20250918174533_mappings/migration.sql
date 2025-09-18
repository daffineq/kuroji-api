/*
  Warnings:

  - You are about to drop the column `image` on the `Episode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Episode" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "public"."EpisodeThumbnail" (
    "id" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "EpisodeThumbnail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeThumbnail_episodeId_key" ON "public"."EpisodeThumbnail"("episodeId");

-- AddForeignKey
ALTER TABLE "public"."EpisodeThumbnail" ADD CONSTRAINT "EpisodeThumbnail_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "public"."Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
