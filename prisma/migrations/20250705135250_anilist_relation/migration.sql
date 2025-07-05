/*
  Warnings:

  - The primary key for the `anizip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `anizip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `anizip_id` on the `anizip_episodes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `anizip_id` on the `anizip_images` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `anizip_id` on the `anizip_mappings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `anizip_id` on the `anizip_titles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "anizip_episodes" DROP CONSTRAINT "anizip_episodes_anizip_id_fkey";

-- DropForeignKey
ALTER TABLE "anizip_images" DROP CONSTRAINT "anizip_images_anizip_id_fkey";

-- DropForeignKey
ALTER TABLE "anizip_mappings" DROP CONSTRAINT "anizip_mappings_anizip_id_fkey";

-- DropForeignKey
ALTER TABLE "anizip_titles" DROP CONSTRAINT "anizip_titles_anizip_id_fkey";

-- AlterTable
ALTER TABLE "anizip" DROP CONSTRAINT "anizip_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "anizip_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "anizip_episodes" DROP COLUMN "anizip_id",
ADD COLUMN     "anizip_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "anizip_images" DROP COLUMN "anizip_id",
ADD COLUMN     "anizip_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "anizip_mappings" DROP COLUMN "anizip_id",
ADD COLUMN     "anizip_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "anizip_titles" DROP COLUMN "anizip_id",
ADD COLUMN     "anizip_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "anizip_episodes_anizip_id_episode_key_key" ON "anizip_episodes"("anizip_id", "episode_key");

-- CreateIndex
CREATE UNIQUE INDEX "anizip_mappings_anizip_id_key" ON "anizip_mappings"("anizip_id");

-- CreateIndex
CREATE UNIQUE INDEX "anizip_titles_anizip_id_key_key" ON "anizip_titles"("anizip_id", "key");

-- AddForeignKey
ALTER TABLE "anizip" ADD CONSTRAINT "anizip_id_fkey" FOREIGN KEY ("id") REFERENCES "Anilist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_titles" ADD CONSTRAINT "anizip_titles_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_images" ADD CONSTRAINT "anizip_images_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_episodes" ADD CONSTRAINT "anizip_episodes_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anizip_mappings" ADD CONSTRAINT "anizip_mappings_anizip_id_fkey" FOREIGN KEY ("anizip_id") REFERENCES "anizip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
