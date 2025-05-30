import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tournament, User } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { S3Service } from 'src/s3/s3.service';
import { TournamentFilter } from './enums/tournament-filter.enum';



@Injectable()
export class TournamentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) { }

  async create(createTournamentDto: CreateTournamentDto, user: User, bannerId: number) {
    const startDate = new Date(createTournamentDto.startDate); // Converter para Date
    const endDate = new Date(createTournamentDto.endDate); // Converter para Date
    return await this.prisma.tournament.create({
      data: {
        title: createTournamentDto.title,
        description: createTournamentDto.description,
        startDate: startDate.toISOString(),  // Formatar corretamente para ISO 8601
        endDate: endDate.toISOString(),
        // maxPhotos: createTournamentDto.maxPhotos,
        createdBy: user.id,
        bannerId: bannerId
      },
    });
  }

  async findAll(filter?: TournamentFilter, userId?: number) {
    const tournaments = await this.prisma.tournament.findMany({
      include: {
        banner: true,  // Incluir o banner relacionado ao torneio
      }
    });

    const currentDate = new Date(); // Data atual

    // Filtro que depende do parâmetro `filter`
    let filteredTournaments = tournaments;

    if (filter === TournamentFilter.MY_PARTICIPATIONS && userId) {
      // Buscar as participações do usuário
      const participations = await this.prisma.participation.findMany({
        where: { userId },
        include: { tournament: true }
      });

      // Filtrar os torneios que o usuário está participando
      filteredTournaments = tournaments.filter(tournament =>
        participations.some(p => p.tournamentId === tournament.id)
      );
    } else if (filter === TournamentFilter.UPCOMING) {
      const eightDaysFromNow = new Date(currentDate.getTime() + 8 * 24 * 60 * 60 * 1000); // 8 dias a partir de hoje
      filteredTournaments = tournaments.filter(tournament => {
        const startDate = new Date(tournament.startDate);
        return startDate > currentDate && startDate >= eightDaysFromNow; // Torneios que começam dentro de 8 dias
      });
    } else if (filter === TournamentFilter.ALL) {
      // Todos os torneios, sem filtragem
      filteredTournaments = tournaments;
    } else if (filter === TournamentFilter.OPEN) { // Filtro para "Aberto" - fase 2
      filteredTournaments = tournaments.filter(tournament => {
        const startDate = new Date(tournament.startDate);
        const preSubmissionDate = new Date(
          startDate.getTime() - 8 * 24 * 60 * 60 * 1000,
        ); // 8 dias antes do início
        return currentDate >= preSubmissionDate && currentDate < startDate;
      });
    } else if (filter === TournamentFilter.VOTING) {
      filteredTournaments = tournaments.filter(tournament => {
        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);
        // const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2); // Metade do período
        // return (currentDate >= startDate && currentDate < midDate) || (currentDate >= midDate && currentDate < endDate);
        return (currentDate >= startDate) && (currentDate <= endDate);
      });
    } else if (filter === TournamentFilter.CLOSED) {
      filteredTournaments = tournaments.filter(tournament => currentDate >= new Date(tournament.endDate));
    }

    // Usando Promise.all para esperar pelas URLs presigned
    return Promise.all(
      filteredTournaments.map(async (tournament) => {
        let phase: number;

        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);
        const preSubmissionDate = new Date(
          startDate.getTime() - 8 * 24 * 60 * 60 * 1000,
        ); // 8 dias antes do início
        // const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2); // Metade do período

        if (currentDate < preSubmissionDate) {
          phase = 1; // 'Início em breve';
        } else if (currentDate >= preSubmissionDate && currentDate < startDate) {
          phase = 2; // 'Aberto';
        } else if (currentDate >= startDate && currentDate < endDate) {
          phase = 3; // 'Votação';
          // } else if (currentDate >= midDate && currentDate < endDate) {
          // phase = 4; // 'Votação 2/2';
        } else {
          phase = 4; // 'Encerrado';
        }

        // Encontrando a chave da foto associada ao torneio
        const photoKey = tournament.banner?.key; // Ajuste isso de acordo com a estrutura do seu modelo

        // Gerar a URL da foto com a chave
        let bannerUrl: string | null = null;
        if (photoKey) {
          bannerUrl = await this.s3Service.generatePresignedUrl(photoKey);
        }

        return {
          ...tournament,
          phase, // Fase calculada
          // midDate,
          bannerUrl, // URL do banner
        };
      })
    );
  }




  async findTournamentById(id: string) {
    try {
      const tournament = await this.prisma.tournament.findUnique({
        where: { id: Number(id) },
        include: {
          banner: true,
          participations: {  // Incluir as participações com foto e usuário
            include: {
              photo: {
                include: {
                  user: true  // Incluir o dono da foto
                }
              }
            }
          }
        }
      });

      if (!tournament) {
        return null; // Retorna null se não encontrar o torneio
      }

      const currentDate = new Date(); // Data atual

      let phase: number;

      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);
      const preSubmissionDate = new Date(
        startDate.getTime() - 8 * 24 * 60 * 60 * 1000,
      ); // 8 dias antes do início
      // const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2); // Metade do período

      if (currentDate < preSubmissionDate) {
        phase = 1; // 'Início em breve';
      } else if (currentDate >= preSubmissionDate && currentDate < startDate) {
        phase = 2; // 'Aberto';
      } else if (currentDate >= startDate && currentDate < endDate) {
        phase = 3; // 'Votação';
        // } else if (currentDate >= midDate && currentDate < endDate) {
        // phase = 4; // 'Votação 2/2';
      } else {
        phase = 4; // 'Encerrado';
      }

      // Encontrando a chave da foto associada ao torneio
      const photoKey = tournament.banner?.key; // Ajuste isso de acordo com a estrutura do seu modelo

      // Gerar a URL da foto com a chave
      let bannerUrl: string | null = null;
      if (photoKey) {
        bannerUrl = await this.s3Service.generatePresignedUrl(photoKey);
      }

      // Se o torneio estiver encerrado, calcular as fotos vencedoras
      let winners: any | null = null;
      if (phase === 4) {
        // Agrupar votos por foto e calcular pontuação total
        const photoVotes = await this.prisma.photoVote.groupBy({
          by: ['photoId'],
          where: {
            tournamentId: tournament.id
          },
          _sum: {
            voteScore: true
          },
          orderBy: {
            _sum: {
              voteScore: 'desc'
            }
          }
        });

        // Mapear para incluir informações completas das fotos
        winners = await Promise.all(photoVotes.map(async (vote) => {
          const participation = tournament.participations.find(p => p.photoId === vote.photoId);
          if (!participation) return null;

          const photo = participation.photo;
          const user = photo.user;

          return {
            photoId: photo.id,
            // photoTitle: photo.title,
            // location: photo.location,
            // likes: photo.likes,
            photoUrl: await this.s3Service.generatePresignedUrl(photo.key),
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              // photographerCategory: user.photographerCategory
            },
            totalScore: vote._sum.voteScore
          };
        }));

        // Remover possíveis nulls e limitar se necessário
        winners = winners.filter(Boolean);
      }

      return {
        ...tournament,
        phase, // Fase calculada
        // midDate,
        preSubmissionDate,
        bannerUrl, // URL do banner
        winners: phase === 4 ? winners : undefined
      };
    } catch (error) {
      throw new Error('Erro ao buscar torneio');
    }
  }

  async findUserParticipations(userId: number) {
    // 1. Buscar todas as participações do usuário com informações do torneio
    const participations = await this.prisma.participation.findMany({
      where: { userId },
      include: {
        tournament: {
          include: {
            banner: true
          }
        },
        photo: true
      },
      orderBy: {
        tournament: {
          endDate: 'desc' // Ordenar por torneios mais recentes primeiro
        }
      }
    });

    // 2. Para cada participação, calcular pontos e posição
    const participationsWithStats = await Promise.all(
      participations.map(async (participation) => {
        // Calcular pontos totais da foto no torneio
        const photoVotes = await this.prisma.photoVote.aggregate({
          where: {
            tournamentId: participation.tournamentId,
            photoId: participation.photoId
          },
          _sum: {
            voteScore: true
          }
        });

        const totalPoints = photoVotes._sum.voteScore || 0;

        // Calcular a posição da foto no torneio
        const allPhotosInTournament = await this.prisma.photoVote.groupBy({
          by: ['photoId'],
          where: {
            tournamentId: participation.tournamentId
          },
          _sum: {
            voteScore: true
          },
          orderBy: {
            _sum: {
              voteScore: 'desc'
            }
          }
        });

        const position = allPhotosInTournament.findIndex(
          (photo) => photo.photoId === participation.photoId
        ) + 1; // +1 porque o índice começa em 0

        // Gerar URL do banner e da foto
        const bannerUrl = participation.tournament.banner
          ? await this.s3Service.generatePresignedUrl(participation.tournament.banner.key)
          : null;

        const photoUrl = participation.photo
          ? await this.s3Service.generatePresignedUrl(participation.photo.key)
          : null;

        // Determinar fase do torneio
        const currentDate = new Date();
        const startDate = new Date(participation.tournament.startDate);
        const endDate = new Date(participation.tournament.endDate);
        const preSubmissionDate = new Date(
          startDate.getTime() - 8 * 24 * 60 * 60 * 1000,
        );

        let phase: number;
        if (currentDate < preSubmissionDate) {
          phase = 1; // 'Início em breve';
        } else if (currentDate >= preSubmissionDate && currentDate < startDate) {
          phase = 2; // 'Aberto';
        } else if (currentDate >= startDate && currentDate < endDate) {
          phase = 3; // 'Votação';
        } else {
          phase = 4; // 'Encerrado';
        }

        return {
          ...participation.tournament,
          phase,
          bannerUrl,
          participation: {
            photoId: participation.photoId,
            photoTitle: participation.title,
            photoUrl,
            points: totalPoints,
            position
          }
        };
      })
    );

    return participationsWithStats;
  }


  update(id: number, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: number) {
    return `This action removes a #${id} tournament`;
  }
}
