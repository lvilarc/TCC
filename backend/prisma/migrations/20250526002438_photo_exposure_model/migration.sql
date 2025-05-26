/*
  Warnings:

  - You are about to drop the column `phase` on the `VotingProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,tournamentId]` on the table `VotingProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VotingProgress_userId_tournamentId_phase_key";

-- AlterTable
ALTER TABLE "VotingProgress" DROP COLUMN "phase";

-- CreateTable
CREATE TABLE "PhotoExposure" (
    "id" SERIAL NOT NULL,
    "photoId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "method" "VotingMethod" NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastShownAt" TIMESTAMP(3),

    CONSTRAINT "PhotoExposure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhotoExposure_photoId_tournamentId_method_key" ON "PhotoExposure"("photoId", "tournamentId", "method");

-- CreateIndex
CREATE UNIQUE INDEX "VotingProgress_userId_tournamentId_key" ON "VotingProgress"("userId", "tournamentId");

-- AddForeignKey
ALTER TABLE "PhotoExposure" ADD CONSTRAINT "PhotoExposure_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoExposure" ADD CONSTRAINT "PhotoExposure_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
