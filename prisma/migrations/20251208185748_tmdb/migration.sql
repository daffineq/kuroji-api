/*
  Warnings:

  - You are about to drop the column `language` on the `Artwork` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parent_id,related_id,order]` on the table `Chronology` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Chronology_parent_id_related_id_key";

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "language",
ADD COLUMN     "iso_639_1" TEXT;

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "season_number" INTEGER,
ADD COLUMN     "tmdb_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Chronology_parent_id_related_id_order_key" ON "Chronology"("parent_id", "related_id", "order");
