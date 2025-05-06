-- AlterEnum
ALTER TYPE "PhotoType" ADD VALUE 'COMMUNITY_POST';

-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "postId" INTEGER;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
