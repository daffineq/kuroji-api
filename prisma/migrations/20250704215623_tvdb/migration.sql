/*
  Warnings:

  - You are about to drop the column `airsTime` on the `Tvdb` table. All the data in the column will be lost.
  - You are about to drop the `TvdbAirDays` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TvdbAirDays" DROP CONSTRAINT "TvdbAirDays_tvdbId_fkey";

-- AlterTable
ALTER TABLE "Tvdb" DROP COLUMN "airsTime";

-- DropTable
DROP TABLE "TvdbAirDays";
