/*
  Warnings:

  - A unique constraint covering the columns `[bannerId]` on the table `tournaments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bannerId` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "bannerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_bannerId_key" ON "tournaments"("bannerId");

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
