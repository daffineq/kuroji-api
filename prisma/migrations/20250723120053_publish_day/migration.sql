/*
  Warnings:

  - You are about to drop the column `publishDay` on the `Anilibria` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Anilibria" DROP COLUMN "publishDay";

-- CreateTable
CREATE TABLE "AnilibriaPublishDay" (
    "id" SERIAL NOT NULL,
    "anilibriaId" INTEGER NOT NULL,
    "value" INTEGER,
    "description" TEXT,

    CONSTRAINT "AnilibriaPublishDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnilibriaPublishDay_anilibriaId_key" ON "AnilibriaPublishDay"("anilibriaId");

-- AddForeignKey
ALTER TABLE "AnilibriaPublishDay" ADD CONSTRAINT "AnilibriaPublishDay_anilibriaId_fkey" FOREIGN KEY ("anilibriaId") REFERENCES "Anilibria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
