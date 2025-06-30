-- CreateTable
CREATE TABLE "AnilistLastEpisode" (
    "id" INTEGER NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnilistLastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnilistLastEpisode_anilistId_key" ON "AnilistLastEpisode"("anilistId");

-- AddForeignKey
ALTER TABLE "AnilistLastEpisode" ADD CONSTRAINT "AnilistLastEpisode_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
