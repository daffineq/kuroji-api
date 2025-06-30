/*
  Warnings:

  - You are about to drop the column `latest` on the `Anilist` table. All the data in the column will be lost.
  - You are about to drop the column `anilistId` on the `AnilistTag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnilistTag" DROP CONSTRAINT "AnilistTag_anilistId_fkey";

-- AlterTable
ALTER TABLE "Anilist" DROP COLUMN "latest";

-- AlterTable
ALTER TABLE "AnilistTag" DROP COLUMN "anilistId";

-- CreateTable
CREATE TABLE "AnilistLatestEpisode" (
    "id" INTEGER NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnilistLatestEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnilistNextEpisode" (
    "id" INTEGER NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnilistNextEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnilistTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnilistTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnilistLatestEpisode_anilistId_key" ON "AnilistLatestEpisode"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "AnilistNextEpisode_anilistId_key" ON "AnilistNextEpisode"("anilistId");

-- CreateIndex
CREATE INDEX "_AnilistTags_B_index" ON "_AnilistTags"("B");

-- AddForeignKey
ALTER TABLE "AnilistLatestEpisode" ADD CONSTRAINT "AnilistLatestEpisode_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistNextEpisode" ADD CONSTRAINT "AnilistNextEpisode_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnilistTags" ADD CONSTRAINT "_AnilistTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Anilist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnilistTags" ADD CONSTRAINT "_AnilistTags_B_fkey" FOREIGN KEY ("B") REFERENCES "AnilistTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
