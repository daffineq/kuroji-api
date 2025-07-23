/*
  Warnings:

  - You are about to drop the `AnilibriaMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaMemberEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaMemberRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaMemberUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnilibriaMemberEdge" DROP CONSTRAINT "AnilibriaMemberEdge_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "AnilibriaMemberEdge" DROP CONSTRAINT "AnilibriaMemberEdge_memberId_fkey";

-- DropForeignKey
ALTER TABLE "AnilibriaMemberRole" DROP CONSTRAINT "AnilibriaMemberRole_memberId_fkey";

-- DropForeignKey
ALTER TABLE "AnilibriaMemberUser" DROP CONSTRAINT "AnilibriaMemberUser_memberId_fkey";

-- DropTable
DROP TABLE "AnilibriaMember";

-- DropTable
DROP TABLE "AnilibriaMemberEdge";

-- DropTable
DROP TABLE "AnilibriaMemberRole";

-- DropTable
DROP TABLE "AnilibriaMemberUser";
