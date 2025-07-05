/*
  Warnings:

  - The `themoviedb_id` column on the `anizip_mappings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "anizip_mappings" DROP COLUMN "themoviedb_id",
ADD COLUMN     "themoviedb_id" INTEGER;
