-- CreateTable
CREATE TABLE "AnilistIndexerState" (
    "id" TEXT NOT NULL DEFAULT 'anime',
    "lastFetchedPage" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnilistIndexerState_pkey" PRIMARY KEY ("id")
);
