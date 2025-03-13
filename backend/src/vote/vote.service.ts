import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VotingMethod } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class VoteService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) { }

  async startVoting(userId: number, tournamentId: number) {
    // Verifica se o torneio existe
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Torneio não encontrado');
    }

    // Calcula a fase com base na data
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
    const now = new Date();

    let currentPhase = 1;  // Fase 1 por padrão
    if (now >= midDate) {
      currentPhase = 2;  // Fase 2 se a data atual for após a data intermediária
    }

    // Obtém o progresso do usuário no torneio
    let userProgress = await this.prisma.votingProgress.findFirst({
      where: { userId, tournamentId },
    });

    // Se não existir progresso, cria um novo
    if (!userProgress) {
      userProgress = await this.prisma.votingProgress.create({
        data: {
          userId,
          tournamentId,
          method: VotingMethod.TOP_THREE,
          phase: currentPhase, // HARDCODED: PRECISAMOS SABER QUAL A FASE DO TOURNAMENT ESTÁ
          completed: false,
        },
      });
    }

    // const currentPhase = userProgress.phase;
    const currentMethod = userProgress.method;

    const methodPhotoCount = {
      [VotingMethod.TOP_THREE]: 10,   // Escolher 3 entre 10
      [VotingMethod.DUEL]: 2,         // Batalha entre 2 fotos
      [VotingMethod.RATING]: 1,       // Avaliação de 1 foto
      [VotingMethod.SUPER_VOTE]: 30,  // Escolher 1 entre 30-40 fotos
    };

    const photoCount = methodPhotoCount[currentMethod];

    // Busca fotos para votação
    const photos = await this.prisma.photo.findMany({
      where: { tournament: { id: tournamentId } },
      select: { id: true, key: true },
      take: photoCount,
    });

    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        presignedUrl: await this.s3Service.generatePresignedUrl(photo.key),
      }))
    );

    return {
      method: currentMethod,
      phaseProgress: currentPhase,
      photos: photosWithUrls,
    };
  }

  // create(createVoteDto: CreateVoteDto) {
  //   return 'This action adds a new vote';
  // }

  // findAll() {
  //   return `This action returns all vote`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} vote`;
  // }

  // update(id: number, updateVoteDto: UpdateVoteDto) {
  //   return `This action updates a #${id} vote`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} vote`;
  // }
}
