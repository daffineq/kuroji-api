/*
  Warnings:

  - You are about to drop the column `type` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `whatFor` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `providers` on the `UpdateHistory` table. All the data in the column will be lost.
  - You are about to drop the `ApiKeyRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApiKeyRequest" DROP CONSTRAINT "ApiKeyRequest_userId_fkey";

-- AlterTable
ALTER TABLE "public"."ApiKey" DROP COLUMN "type",
DROP COLUMN "userId",
DROP COLUMN "whatFor";

-- AlterTable
ALTER TABLE "public"."UpdateHistory" DROP COLUMN "providers";

-- DropTable
DROP TABLE "public"."ApiKeyRequest";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."ApiKeyRequestStatus";

-- DropEnum
DROP TYPE "public"."ApiKeyType";

-- DropEnum
DROP TYPE "public"."UserRole";
