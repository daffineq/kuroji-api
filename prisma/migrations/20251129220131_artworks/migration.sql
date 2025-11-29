/*
  Warnings:

  - The primary key for the `Artwork` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `includesText` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Artwork` table. All the data in the column will be lost.
  - The primary key for the `_MetaToArtwork` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[url,type,source]` on the table `Artwork` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `source` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `Artwork` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_MetaToArtwork" DROP CONSTRAINT "_MetaToArtwork_A_fkey";

-- AlterTable
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_pkey",
DROP COLUMN "includesText",
DROP COLUMN "score",
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ADD CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_MetaToArtwork" DROP CONSTRAINT "_MetaToArtwork_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_MetaToArtwork_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_url_type_source_key" ON "Artwork"("url", "type", "source");

-- AddForeignKey
ALTER TABLE "_MetaToArtwork" ADD CONSTRAINT "_MetaToArtwork_A_fkey" FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
