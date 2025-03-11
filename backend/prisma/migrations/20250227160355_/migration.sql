-- AlterEnum
ALTER TYPE "PhotoType" ADD VALUE 'COVER_PHOTO';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "coverPhotoUrl" TEXT,
ADD COLUMN     "photographerCategory" TEXT NOT NULL DEFAULT 'Entusiasta',
ADD COLUMN     "profilePicUrl" TEXT;
