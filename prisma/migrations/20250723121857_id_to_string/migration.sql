/*
  Warnings:

  - The primary key for the `AnilibriaSponsor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AnilibriaSponsor" DROP CONSTRAINT "AnilibriaSponsor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AnilibriaSponsor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AnilibriaSponsor_id_seq";
