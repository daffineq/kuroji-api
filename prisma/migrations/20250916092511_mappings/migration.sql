-- DropForeignKey
ALTER TABLE "public"."Mappings" DROP CONSTRAINT "Mappings_id_fkey";

-- CreateTable
CREATE TABLE "public"."Episode" (
    "id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "overview" TEXT,
    "image" TEXT,
    "runtime" INTEGER,
    "date" TEXT,
    "mappingsId" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Anime" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER,
    "idMal" INTEGER,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Episode" ADD CONSTRAINT "Episode_mappingsId_fkey" FOREIGN KEY ("mappingsId") REFERENCES "public"."Mappings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
