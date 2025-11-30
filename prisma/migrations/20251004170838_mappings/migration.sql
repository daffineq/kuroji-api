-- AlterTable
ALTER TABLE "public"."Mappings" ADD COLUMN     "franchise" TEXT,
ADD COLUMN     "rating" TEXT;

-- CreateTable
CREATE TABLE "public"."Description" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MappingsToDescription" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MappingsToDescription_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Description_description_source_language_key" ON "public"."Description"("description", "source", "language");

-- CreateIndex
CREATE INDEX "_MappingsToDescription_B_index" ON "public"."_MappingsToDescription"("B");

-- AddForeignKey
ALTER TABLE "public"."_MappingsToDescription" ADD CONSTRAINT "_MappingsToDescription_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Description"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MappingsToDescription" ADD CONSTRAINT "_MappingsToDescription_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
