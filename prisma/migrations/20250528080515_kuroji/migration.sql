-- CreateTable
CREATE TABLE "TmdbNextEpisodeToAir" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "overview" TEXT,
    "vote_average" DOUBLE PRECISION,
    "vote_count" INTEGER,
    "air_date" TEXT,
    "episode_number" INTEGER,
    "episode_type" TEXT,
    "production_code" TEXT,
    "runtime" INTEGER,
    "season_number" INTEGER,
    "show_id" INTEGER,
    "still_path" TEXT,

    CONSTRAINT "TmdbNextEpisodeToAir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TmdbLastEpisodeToAir" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "overview" TEXT,
    "vote_average" DOUBLE PRECISION,
    "vote_count" INTEGER,
    "air_date" TEXT,
    "episode_number" INTEGER,
    "episode_type" TEXT,
    "production_code" TEXT,
    "runtime" INTEGER,
    "season_number" INTEGER,
    "show_id" INTEGER,
    "still_path" TEXT,

    CONSTRAINT "TmdbLastEpisodeToAir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TmdbNextEpisodeToAir_show_id_key" ON "TmdbNextEpisodeToAir"("show_id");

-- CreateIndex
CREATE INDEX "TmdbNextEpisodeToAir_show_id_idx" ON "TmdbNextEpisodeToAir"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "TmdbLastEpisodeToAir_show_id_key" ON "TmdbLastEpisodeToAir"("show_id");

-- CreateIndex
CREATE INDEX "TmdbLastEpisodeToAir_show_id_idx" ON "TmdbLastEpisodeToAir"("show_id");

-- AddForeignKey
ALTER TABLE "TmdbNextEpisodeToAir" ADD CONSTRAINT "TmdbNextEpisodeToAir_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Tmdb"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmdbLastEpisodeToAir" ADD CONSTRAINT "TmdbLastEpisodeToAir_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Tmdb"("id") ON DELETE SET NULL ON UPDATE CASCADE;
