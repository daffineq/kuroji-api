/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[url,source]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Video` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `source` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MetaToVideo" DROP CONSTRAINT "_MetaToVideo_B_fkey";

-- AlterTable
ALTER TABLE "Meta" ADD COLUMN     "broadcast" TEXT,
ADD COLUMN     "moreinfo" TEXT;

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_source_key" ON "Video"("url", "source");

-- AddForeignKey
ALTER TABLE "_MetaToVideo" ADD CONSTRAINT "_MetaToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
