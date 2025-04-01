-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "title" TEXT;
