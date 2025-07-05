-- CreateTable
CREATE TABLE "anizip" (
    "id" TEXT NOT NULL,
    "episode_count" INTEGER NOT NULL,
    "special_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anizip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anizip_titles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "anizip_id" TEXT NOT NULL,

    CONSTRAINT "anizip_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anizip_images" (
    "id" TEXT NOT NULL,
    "cover_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "anizip_id" TEXT NOT NULL,

    CONSTRAINT "anizip_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anizip_episodes" (
    "id" TEXT NOT NULL,
    "episode_key" TEXT NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "season_number" INTEGER,
    "absolute_episode_number" INTEGER,
    "tvdb_show_id" INTEGER,
    "tvdb_id" INTEGER,
    "air_date" TEXT,
    "air_date_utc" TEXT,
    "airdate" TEXT,
    "runtime" INTEGER,
    "length" INTEGER,
    "overview" TEXT,
    "image" TEXT,
    "rating" TEXT,
    "episode" TEXT,
    "anidb_eid" INTEGER,
    "anizip_id" TEXT NOT NULL,

    CONSTRAINT "anizip_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anizip_episode_titles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT,
    "episode_id" TEXT NOT NULL,

    CONSTRAINT "anizip_episode_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anizip_mappings" (
    "id" TEXT NOT NULL,
    "animeplanet_id" TEXT,
    "kitsu_id" INTEGER,
    "mal_id" INTEGER,
    "type" TEXT,
    "anilist_id" INTEGER,
    "anisearch_id" INTEGER,
    "anidb_id" INTEGER,
    "notifymoe_id" TEXT,
    "livechart_id" INTEGER,
    "thetvdb_id" INTEGER,
    "imdb_id" TEXT,
    "themoviedb_id" TEXT,
    "anizip_id" TEXT NOT NULL,

    CONSTRAINT "anizip_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anizip_titles_anizip_id_key_key" ON "anizip_titles"("anizip_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "anizip_episodes_anizip_id_episode_key_key" ON "anizip_episodes"("anizip_id", "episode_key");

-- CreateIndex
CREATE UNIQUE INDEX "anizip_episode_titles_episode_id_key_key" ON "anizip_episode_titles"("episode_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "anizip_mappings_anizip_id_key" ON "anizip_mappings"("anizip_id");

-- AddForeignKey
ALTER TABLE "anizip_titles" ADD CONSTRAINT "anizip_titles_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_images" ADD CONSTRAINT "anizip_images_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_episodes" ADD CONSTRAINT "anizip_episodes_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_episode_titles" ADD CONSTRAINT "anizip_episode_titles_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "anizip_episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_mappings" ADD CONSTRAINT "anizip_mappings_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
