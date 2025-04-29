/*
  Warnings:

  - The values [PROFILE_PHOTO] on the enum `PhotoType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PhotoType_new" AS ENUM ('PROFILE_AVATAR', 'COVER_PHOTO', 'FEED_PHOTO', 'TOURNAMENT_BANNER', 'TOURNAMENT_PARTICIPATION', 'OTHER');
ALTER TABLE "photos" ALTER COLUMN "type" TYPE "PhotoType_new" USING ("type"::text::"PhotoType_new");
ALTER TYPE "PhotoType" RENAME TO "PhotoType_old";
ALTER TYPE "PhotoType_new" RENAME TO "PhotoType";
DROP TYPE "PhotoType_old";
COMMIT;
