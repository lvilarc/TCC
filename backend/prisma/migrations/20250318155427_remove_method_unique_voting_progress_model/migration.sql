/*
  Warnings:

  - A unique constraint covering the columns `[userId,tournamentId,phase]` on the table `VotingProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VotingProgress_userId_tournamentId_method_phase_key";

-- CreateIndex
CREATE UNIQUE INDEX "VotingProgress_userId_tournamentId_phase_key" ON "VotingProgress"("userId", "tournamentId", "phase");
