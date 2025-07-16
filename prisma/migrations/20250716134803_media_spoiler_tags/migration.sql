/*
  Warnings:

  - You are about to drop the column `isSpoiler` on the `AnilistTagEdge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnilistTagEdge" DROP COLUMN "isSpoiler",
ADD COLUMN     "isMediaSpoiler" BOOLEAN;
