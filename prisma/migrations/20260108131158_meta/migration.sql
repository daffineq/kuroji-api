/*
  Warnings:

  - You are about to drop the column `original` on the `Screenshot` table. All the data in the column will be lost.
  - You are about to drop the column `x166` on the `Screenshot` table. All the data in the column will be lost.
  - You are about to drop the column `x332` on the `Screenshot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url,source]` on the table `Screenshot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `source` to the `Screenshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Screenshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screenshot" DROP COLUMN "original",
DROP COLUMN "x166",
DROP COLUMN "x332",
ADD COLUMN     "large" TEXT,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "small" TEXT,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Screenshot_url_source_key" ON "Screenshot"("url", "source");
