/*
  Warnings:

  - Added the required column `key` to the `photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "key" TEXT NOT NULL;
