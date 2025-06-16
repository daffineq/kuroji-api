/*
  Warnings:

  - You are about to drop the `Temperature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Temperature";

-- CreateTable
CREATE TABLE "UpdateTemperature" (
    "id" SERIAL NOT NULL,
    "temperature" TEXT NOT NULL,

    CONSTRAINT "UpdateTemperature_pkey" PRIMARY KEY ("id")
);
