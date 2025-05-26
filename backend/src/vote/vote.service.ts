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

  private async updatePhotoExposure(photoIds: number[], tournamentId: number, method: VotingMethod) {
    for (const photoId of photoIds) {
      await this.prisma.photoExposure.upsert({
        where: {
          photoId_tournamentId_method: {
            photoId,
            tournamentId,
            method,
          },
        },
        update: {
          viewCount: { increment: 1 },
          lastShownAt: new Date(),
        },
        create: {
          photoId,
          tournamentId,
          method,
          viewCount: 1,
          lastShownAt: new Date(),
        },
      });
    }
  }

  async startVoting(userId: number, tournamentId: number) {
    // Verifica se o torneio existe
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Torneio não encontrado');
    }

    // Calcula a fase com base na data
    // const startDate = new Date(tournament.startDate);
    // const endDate = new Date(tournament.endDate);
    // const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
    // const now = new Date();

    // let currentPhase = 1;  // Fase 1 por padrão
    // if (now >= midDate) {
    //   currentPhase = 2;  // Fase 2 se a data atual for após a data intermediária
    // }

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
          // phase: currentPhase,
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

    // Obter todas as fotos participantes do torneio
    const allParticipations = await this.prisma.participation.findMany({
      where: { tournamentId },
      select: {
        photo: {
          select: {
            id: true,
            key: true,
          },
        },
      },
    });

    // Obter estatísticas de exposição para o método atual
    const exposureStats = await this.prisma.photoExposure.findMany({
      where: {
        tournamentId,
        method: currentMethod,
        photoId: { in: allParticipations.map(p => p.photo.id) },
      },
    });

    // Criar um mapa de exposição (photoId => viewCount)
    const exposureMap = new Map<number, number>();
    exposureStats.forEach(stat => {
      exposureMap.set(stat.photoId, stat.viewCount);
    });

    // Ordenar as fotos por menor número de visualizações e mais antiga
    const sortedPhotos = allParticipations
      .map(p => ({
        photo: p.photo,
        viewCount: exposureMap.get(p.photo.id) || 0,
        lastShown: exposureStats.find(s => s.photoId === p.photo.id)?.lastShownAt || new Date(0),
      }))
      .sort((a, b) => {
        if (a.viewCount !== b.viewCount) {
          return a.viewCount - b.viewCount;
        }
        return a.lastShown.getTime() - b.lastShown.getTime();
      });

    // Selecionar as N fotos menos exibidas
    const selectedPhotos = sortedPhotos.slice(0, photoCount).map(p => p.photo);

    // Obter URLs presignadas
    const photosWithUrls = await Promise.all(
      selectedPhotos.map(async (photo) => ({
        ...photo,
        presignedUrl: await this.s3Service.generatePresignedUrl(photo.key),
      }))
    );

    return {
      completed: userProgress.completed,
      method: currentMethod,
      photos: photosWithUrls,
      // Retorna também os IDs para o frontend poder enviar depois
      photoIds: selectedPhotos.map(p => p.id),
    };
  }

  async hasUserVoted(userId: number, tournamentId: number, method: VotingMethod) {
    // Verifica o progresso de votação do usuário na fase e método atual
    const progress = await this.prisma.votingProgress.findUnique({
      // where: { userId_tournamentId_phase: { userId, tournamentId, phase } },
      where: { userId_tournamentId: { userId, tournamentId } },
    });

    // Verifica se a fase foi concluída ou se o usuário já ultrapassou esta fase com outro método
    if (progress) {
      // Se o progresso está completo ou se o método é diferente do atual, significa que o usuário não pode votar novamente
      if (progress.completed || progress.method !== method) {
        return true;
      }
    }

    // Se não houver progresso ou o usuário não completou a fase, ele pode votar
    return false;
  }


  async saveVotingProgress(userId: number, tournamentId: number, method: VotingMethod) {
    // Definir o próximo método de votação
    let nextMethod: VotingMethod | undefined;
    let completed = false;

    // Sequência de métodos para votação
    const votingMethodSequence: VotingMethod[] = [
      VotingMethod.TOP_THREE,
      VotingMethod.DUEL,
      VotingMethod.RATING,
      VotingMethod.SUPER_VOTE,
    ];

    // Encontrar o índice do método atual na sequência
    const currentMethodIndex = votingMethodSequence.indexOf(method);

    // Se o método atual for o último, marcar como concluído
    if (currentMethodIndex === votingMethodSequence.length - 1) {
      completed = true;
    } else {
      // Caso contrário, definir o próximo método
      nextMethod = votingMethodSequence[currentMethodIndex + 1];
    }

    // Preparar o objeto de dados para a atualização
    const updateData: any = {};

    // Se o próximo método existir, adicionamos ao objeto de atualização
    if (nextMethod) {
      updateData.method = nextMethod;
    }

    // Se for o último método, marcar como completado
    if (completed) {
      updateData.completed = true;
    }

    // Realizar o upsert no banco de dados
    return this.prisma.votingProgress.upsert({
      // where: { userId_tournamentId_phase: { userId, tournamentId, phase } },
      where: { userId_tournamentId: { userId, tournamentId } },
      update: updateData,
      create: { userId, tournamentId, method: nextMethod || VotingMethod.TOP_THREE },
    });
  }


  async submitVotes(userId: number, tournamentId: number, method: VotingMethod, votes: { photoId: number; voteScore: number }[], shownPhotoIds: number[]) {
    await this.updatePhotoExposure(shownPhotoIds, tournamentId, method);
    return this.prisma.photoVote.createMany({
      data: votes.map(({ photoId, voteScore }) => ({
        userId,
        tournamentId,
        method,
        photoId,
        voteScore,
      })),
      skipDuplicates: true, // Ignora votos duplicados para o mesmo userId, photoId, tournamentId e method
    });
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
