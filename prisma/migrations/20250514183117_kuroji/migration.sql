-- CreateTable
CREATE TABLE "AnilistJikanEpisode" (
    "id" SERIAL NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "malId" INTEGER,
    "url" TEXT,
    "title" TEXT,
    "episode" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "AnilistJikanEpisode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnilistJikanEpisode" ADD CONSTRAINT "AnilistJikanEpisode_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
