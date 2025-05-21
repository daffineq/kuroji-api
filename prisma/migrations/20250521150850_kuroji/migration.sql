-- CreateTable
CREATE TABLE "Kitsu" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "self_link" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "slug" TEXT,
    "synopsis" TEXT,
    "cover_image_top_offset" INTEGER,
    "canonical_title" TEXT,
    "abbreviated_titles" TEXT[],
    "average_rating" TEXT,
    "rating_frequencies" JSONB,
    "user_count" INTEGER,
    "favorites_count" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "popularity_rank" INTEGER,
    "rating_rank" INTEGER,
    "age_rating" TEXT,
    "age_rating_guide" TEXT,
    "subtype" TEXT,
    "status" TEXT,
    "tba" TEXT,
    "episode_count" INTEGER,
    "episode_length" INTEGER,
    "youtube_video_id" TEXT,
    "show_type" TEXT,
    "nsfw" BOOLEAN NOT NULL DEFAULT false,
    "anilistId" INTEGER,

    CONSTRAINT "Kitsu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuTitle" (
    "id" TEXT NOT NULL,
    "en" TEXT,
    "en_jp" TEXT,
    "ja_jp" TEXT,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuPosterImage" (
    "id" TEXT NOT NULL,
    "tiny" TEXT,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,
    "original" TEXT,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuPosterImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuCoverImage" (
    "id" TEXT NOT NULL,
    "tiny" TEXT,
    "small" TEXT,
    "large" TEXT,
    "original" TEXT,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuCoverImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuImageDimensions" (
    "id" TEXT NOT NULL,
    "posterImageId" TEXT,
    "coverImageId" TEXT,

    CONSTRAINT "KitsuImageDimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuDimension" (
    "id" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "tinyDimensionId" TEXT,
    "smallDimensionId" TEXT,
    "mediumDimensionId" TEXT,
    "largeDimensionId" TEXT,

    CONSTRAINT "KitsuDimension_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kitsu_anilistId_key" ON "Kitsu"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuTitle_kitsuId_key" ON "KitsuTitle"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuPosterImage_kitsuId_key" ON "KitsuPosterImage"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuCoverImage_kitsuId_key" ON "KitsuCoverImage"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuImageDimensions_posterImageId_key" ON "KitsuImageDimensions"("posterImageId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuImageDimensions_coverImageId_key" ON "KitsuImageDimensions"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuDimension_tinyDimensionId_key" ON "KitsuDimension"("tinyDimensionId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuDimension_smallDimensionId_key" ON "KitsuDimension"("smallDimensionId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuDimension_mediumDimensionId_key" ON "KitsuDimension"("mediumDimensionId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuDimension_largeDimensionId_key" ON "KitsuDimension"("largeDimensionId");

-- AddForeignKey
ALTER TABLE "Kitsu" ADD CONSTRAINT "Kitsu_anilistId_fkey" FOREIGN KEY ("anilistId") REFERENCES "Anilist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuTitle" ADD CONSTRAINT "KitsuTitle_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuPosterImage" ADD CONSTRAINT "KitsuPosterImage_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuCoverImage" ADD CONSTRAINT "KitsuCoverImage_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuImageDimensions" ADD CONSTRAINT "KitsuImageDimensions_posterImageId_fkey" FOREIGN KEY ("posterImageId") REFERENCES "KitsuPosterImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuImageDimensions" ADD CONSTRAINT "KitsuImageDimensions_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "KitsuCoverImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuDimension" ADD CONSTRAINT "KitsuDimension_tinyDimensionId_fkey" FOREIGN KEY ("tinyDimensionId") REFERENCES "KitsuImageDimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuDimension" ADD CONSTRAINT "KitsuDimension_smallDimensionId_fkey" FOREIGN KEY ("smallDimensionId") REFERENCES "KitsuImageDimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuDimension" ADD CONSTRAINT "KitsuDimension_mediumDimensionId_fkey" FOREIGN KEY ("mediumDimensionId") REFERENCES "KitsuImageDimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuDimension" ADD CONSTRAINT "KitsuDimension_largeDimensionId_fkey" FOREIGN KEY ("largeDimensionId") REFERENCES "KitsuImageDimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
