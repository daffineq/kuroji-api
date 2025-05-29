/*
  Warnings:

  - The primary key for the `LastUpdated` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LastUpdated` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entityId]` on the table `LastUpdated` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LastUpdated" DROP CONSTRAINT "LastUpdated_pkey",
DROP COLUMN "id",
ADD COLUMN     "updatedAt" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "LastUpdated_pkey" PRIMARY KEY ("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "LastUpdated_entityId_key" ON "LastUpdated"("entityId");
