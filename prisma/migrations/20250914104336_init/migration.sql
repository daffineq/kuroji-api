/*
  Warnings:

  - You are about to drop the `BasicIdAni` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnilistRecs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AnilistRecs" DROP CONSTRAINT "_AnilistRecs_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnilistRecs" DROP CONSTRAINT "_AnilistRecs_B_fkey";

-- DropTable
DROP TABLE "public"."BasicIdAni";

-- DropTable
DROP TABLE "public"."_AnilistRecs";
