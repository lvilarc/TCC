-- CreateEnum
CREATE TYPE "VotingMethod" AS ENUM ('TOP_THREE', 'DUEL', 'RATING', 'SUPER_VOTE');

-- CreateTable
CREATE TABLE "VotingProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "method" "VotingMethod" NOT NULL,
    "phase" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VotingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoVote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "method" "VotingMethod" NOT NULL,
    "voteScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VotingProgress_userId_tournamentId_method_phase_key" ON "VotingProgress"("userId", "tournamentId", "method", "phase");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoVote_userId_photoId_tournamentId_method_key" ON "PhotoVote"("userId", "photoId", "tournamentId", "method");

-- AddForeignKey
ALTER TABLE "VotingProgress" ADD CONSTRAINT "VotingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingProgress" ADD CONSTRAINT "VotingProgress_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoVote" ADD CONSTRAINT "PhotoVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoVote" ADD CONSTRAINT "PhotoVote_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoVote" ADD CONSTRAINT "PhotoVote_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
