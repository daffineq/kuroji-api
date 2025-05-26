-- CreateTable
CREATE TABLE "KitsuGenres" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuGenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuCategories" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuCastings" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuCastings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuInstallments" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuInstallments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuMappings" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuMappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuReviews" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuMediaRelationships" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuMediaRelationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuEpisodes" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuEpisodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuStreamingLinks" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuStreamingLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuAnimeProductions" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuAnimeProductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuAnimeCharacters" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuAnimeCharacters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitsuAnimeStaff" (
    "id" TEXT NOT NULL,
    "selfLink" TEXT NOT NULL,
    "related" TEXT NOT NULL,
    "kitsuId" TEXT NOT NULL,

    CONSTRAINT "KitsuAnimeStaff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KitsuGenres" ADD CONSTRAINT "KitsuGenres_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuCategories" ADD CONSTRAINT "KitsuCategories_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuCastings" ADD CONSTRAINT "KitsuCastings_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuInstallments" ADD CONSTRAINT "KitsuInstallments_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuMappings" ADD CONSTRAINT "KitsuMappings_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuReviews" ADD CONSTRAINT "KitsuReviews_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuMediaRelationships" ADD CONSTRAINT "KitsuMediaRelationships_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuEpisodes" ADD CONSTRAINT "KitsuEpisodes_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuStreamingLinks" ADD CONSTRAINT "KitsuStreamingLinks_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuAnimeProductions" ADD CONSTRAINT "KitsuAnimeProductions_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuAnimeCharacters" ADD CONSTRAINT "KitsuAnimeCharacters_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitsuAnimeStaff" ADD CONSTRAINT "KitsuAnimeStaff_kitsuId_fkey" FOREIGN KEY ("kitsuId") REFERENCES "Kitsu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
