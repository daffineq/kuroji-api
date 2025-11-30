/*
  Warnings:

  - You are about to drop the `AnilistIndexerState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."AnilistIndexerState";

-- CreateTable
CREATE TABLE "public"."IndexerState" (
    "id" TEXT NOT NULL DEFAULT 'anime',
    "lastFetchedPage" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexerState_pkey" PRIMARY KEY ("id")
);
