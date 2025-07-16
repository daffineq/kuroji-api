/*
  Warnings:

  - You are about to drop the column `isSpoiler` on the `AnilistTag` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `AnilistTag` table. All the data in the column will be lost.
  - You are about to drop the `_AnilistTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AnilistTags" DROP CONSTRAINT "_AnilistTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnilistTags" DROP CONSTRAINT "_AnilistTags_B_fkey";

-- AlterTable
ALTER TABLE "AnilistTag" DROP COLUMN "isSpoiler",
DROP COLUMN "rank";

-- DropTable
DROP TABLE "_AnilistTags";

-- CreateTable
CREATE TABLE "AnilistTagEdge" (
    "id" SERIAL NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "tagId" INTEGER,
    "rank" INTEGER,
    "isSpoiler" BOOLEAN,

    CONSTRAINT "AnilistTagEdge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnilistTagEdge" ADD CONSTRAINT "AnilistTagEdge_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnilistTagEdge" ADD CONSTRAINT "AnilistTagEdge_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "AnilistTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
