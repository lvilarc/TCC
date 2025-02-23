/*
  Warnings:

  - Changed the type of `type` on the `photos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('PROFILE', 'BANNER', 'TOURNAMENT', 'OTHER');

-- AlterTable
ALTER TABLE "photos" DROP COLUMN "type",
ADD COLUMN     "type" "PhotoType" NOT NULL;
