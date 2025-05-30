/*
  Warnings:

  - You are about to drop the column `location` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photos" DROP COLUMN "location",
DROP COLUMN "title";
