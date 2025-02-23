import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tournament, User } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { S3Service } from 'src/s3/s3.service';

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

  async findAll() {
    const tournaments = await this.prisma.tournament.findMany({
      include: {
        banner: true,  // Incluir o banner relacionado ao torneio
      }
    });
    const currentDate = new Date(); // Data atual

    // Usando Promise.all para esperar pelas URLs presigned
    return Promise.all(
      tournaments.map(async (tournament) => {
        let phase: number;

        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);
        const preSubmissionDate = new Date(
          startDate.getTime() - 8 * 24 * 60 * 60 * 1000,
        ); // 8 dias antes do início
        const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2); // Metade do período

        if (currentDate < preSubmissionDate) {
          phase = 1; // 'Início em breve';
        } else if (currentDate >= preSubmissionDate && currentDate < startDate) {
          phase = 2; // 'Aberto';
        } else if (currentDate >= startDate && currentDate < midDate) {
          phase = 3; // 'Votação 1/2';
        } else if (currentDate >= midDate && currentDate < endDate) {
          phase = 4; // 'Votação 2/2';
        } else {
          phase = 5; // 'Encerrado';
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
          midDate,
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
          banner: true,  // Incluir o banner relacionado ao torneio
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
      const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2); // Metade do período
  
      if (currentDate < preSubmissionDate) {
        phase = 1; // 'Início em breve';
      } else if (currentDate >= preSubmissionDate && currentDate < startDate) {
        phase = 2; // 'Aberto';
      } else if (currentDate >= startDate && currentDate < midDate) {
        phase = 3; // 'Votação 1/2';
      } else if (currentDate >= midDate && currentDate < endDate) {
        phase = 4; // 'Votação 2/2';
      } else {
        phase = 5; // 'Encerrado';
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
        midDate,
        bannerUrl, // URL do banner
      };
    } catch (error) {
      throw new Error('Erro ao buscar torneio');
    }
  }
  

  update(id: number, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: number) {
    return `This action removes a #${id} tournament`;
  }
}
