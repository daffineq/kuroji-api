-- AlterTable
ALTER TABLE "anizip_episodes" ALTER COLUMN "episode_key" DROP NOT NULL,
ALTER COLUMN "episode_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "anizip_images" ALTER COLUMN "cover_type" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "anizip_titles" ALTER COLUMN "name" DROP NOT NULL;
