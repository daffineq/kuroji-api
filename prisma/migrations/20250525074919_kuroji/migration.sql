/*
  Warnings:

  - The `updatedAt` column on the `AnimeKai` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `Animepahe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `Zoro` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AnimeKai" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" INTEGER;

-- AlterTable
ALTER TABLE "Animepahe" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" INTEGER;

-- AlterTable
ALTER TABLE "Zoro" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" INTEGER;
