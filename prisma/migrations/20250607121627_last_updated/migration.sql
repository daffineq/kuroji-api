/*
  Warnings:

  - The primary key for the `LastUpdated` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Exception` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entityId,type]` on the table `LastUpdated` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LastUpdated_entityId_key";

-- AlterTable
ALTER TABLE "LastUpdated" DROP CONSTRAINT "LastUpdated_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "LastUpdated_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Exception";

-- CreateIndex
CREATE UNIQUE INDEX "LastUpdated_entityId_type_key" ON "LastUpdated"("entityId", "type");
