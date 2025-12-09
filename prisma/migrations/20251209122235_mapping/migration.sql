/*
  Warnings:

  - You are about to drop the `Mappings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mappings" DROP CONSTRAINT "Mappings_meta_id_fkey";

-- DropTable
DROP TABLE "Mappings";

-- CreateTable
CREATE TABLE "Mapping" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "meta_id" INTEGER NOT NULL,

    CONSTRAINT "Mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mapping_source_id_source_name_key" ON "Mapping"("source_id", "source_name");

-- AddForeignKey
ALTER TABLE "Mapping" ADD CONSTRAINT "Mapping_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "Meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
