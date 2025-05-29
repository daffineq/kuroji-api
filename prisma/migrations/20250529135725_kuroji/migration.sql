/*
  Warnings:

  - The `updatedAt` column on the `LastUpdated` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `AnimeKai` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Animepahe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Zoro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnimeKai" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Animepahe" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "LastUpdated" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Zoro" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
