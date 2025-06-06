-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('OBSERVADOR_INICIANTE', 'EXPLORADOR_DE_LENTES', 'ARTISTA_DA_LUZ', 'NARRADOR_VISUAL', 'MESTRE_DA_COMPOSICAO', 'LENDARIO_DA_FOTOGRAFIA');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rank" "Rank" NOT NULL DEFAULT 'OBSERVADOR_INICIANTE',
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "tournaments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxPhotos" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
