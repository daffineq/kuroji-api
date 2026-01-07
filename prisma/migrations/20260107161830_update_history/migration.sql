/*
  Warnings:

  - You are about to drop the column `last_error` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the column `retries` on the `UpdateQueue` table. All the data in the column will be lost.
  - You are about to drop the `UpdateHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "UpdateQueue" DROP COLUMN "last_error",
DROP COLUMN "retries";

-- DropTable
DROP TABLE "UpdateHistory";
