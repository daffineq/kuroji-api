/*
  Warnings:

  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuAnimeCharacters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuAnimeProductions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuAnimeStaff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuCastings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuCategories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuEpisodes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuGenres` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuInstallments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuMappings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuMediaRelationships` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuReviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kitsuId]` on the table `KitsuStreamingLinks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KitsuAnimeCharacters_kitsuId_key" ON "KitsuAnimeCharacters"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuAnimeProductions_kitsuId_key" ON "KitsuAnimeProductions"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuAnimeStaff_kitsuId_key" ON "KitsuAnimeStaff"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuCastings_kitsuId_key" ON "KitsuCastings"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuCategories_kitsuId_key" ON "KitsuCategories"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuEpisodes_kitsuId_key" ON "KitsuEpisodes"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuGenres_kitsuId_key" ON "KitsuGenres"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuInstallments_kitsuId_key" ON "KitsuInstallments"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuMappings_kitsuId_key" ON "KitsuMappings"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuMediaRelationships_kitsuId_key" ON "KitsuMediaRelationships"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuReviews_kitsuId_key" ON "KitsuReviews"("kitsuId");

-- CreateIndex
CREATE UNIQUE INDEX "KitsuStreamingLinks_kitsuId_key" ON "KitsuStreamingLinks"("kitsuId");
