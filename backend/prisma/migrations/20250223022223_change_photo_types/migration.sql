/*
  Warnings:

  - The values [PROFILE,BANNER,TOURNAMENT] on the enum `PhotoType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId,tournamentId]` on the table `participations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PhotoType_new" AS ENUM ('PROFILE_AVATAR', 'PROFILE_PHOTO', 'TOURNAMENT_BANNER', 'TOURNAMENT_PARTICIPATION', 'OTHER');
ALTER TABLE "photos" ALTER COLUMN "type" TYPE "PhotoType_new" USING ("type"::text::"PhotoType_new");
ALTER TYPE "PhotoType" RENAME TO "PhotoType_old";
ALTER TYPE "PhotoType_new" RENAME TO "PhotoType";
DROP TYPE "PhotoType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "participations_userId_tournamentId_key" ON "participations"("userId", "tournamentId");
