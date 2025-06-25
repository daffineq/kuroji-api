/*
  Warnings:

  - You are about to drop the `AnilistTagLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnilistTagLink" DROP CONSTRAINT "AnilistTagLink_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "AnilistTagLink" DROP CONSTRAINT "AnilistTagLink_tagId_fkey";

-- DropTable
DROP TABLE "AnilistTagLink";

-- CreateTable
CREATE TABLE "_AnilistTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnilistTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnilistTags_B_index" ON "_AnilistTags"("B");

-- AddForeignKey
ALTER TABLE "_AnilistTags" ADD CONSTRAINT "_AnilistTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Anilist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnilistTags" ADD CONSTRAINT "_AnilistTags_B_fkey" FOREIGN KEY ("B") REFERENCES "AnilistTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
