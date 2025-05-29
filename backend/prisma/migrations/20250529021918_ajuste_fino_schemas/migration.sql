/*
  Warnings:

  - You are about to drop the column `likes` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `photographerCategory` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "likes",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "level",
DROP COLUMN "photographerCategory",
DROP COLUMN "rank",
DROP COLUMN "xp",
ADD COLUMN     "desc" TEXT;

-- DropEnum
DROP TYPE "Rank";
