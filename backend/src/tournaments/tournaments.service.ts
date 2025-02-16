import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTournamentDto: CreateTournamentDto, user: User) {
    return await this.prisma.tournament.create({
      data: {
        title: createTournamentDto.title,
        description: createTournamentDto.description,
        startDate: createTournamentDto.startDate,
        endDate: createTournamentDto.endDate,
        maxPhotos: createTournamentDto.maxPhotos,
        createdBy: user.id,
      },
    });
  }

  async findAll() {
    const tournaments = await this.prisma.tournament.findMany();
    const currentDate = new Date(); // Data atual

    return tournaments.map(tournament => {
      let phase: number;

      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);
      const preSubmissionDate = new Date(startDate.getTime() - 8 * 24 * 60 * 60 * 1000); // 8 dias antes do início
      const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2); // Metade do período

      if (currentDate < preSubmissionDate) {
        phase = 1 // 'Início em breve';
      } else if (currentDate >= preSubmissionDate && currentDate < startDate) {
        phase = 2 // 'Aberto';
      } else if (currentDate >= startDate && currentDate < midDate) {
        phase = 3 // 'Votação 1/2';
      } else if (currentDate >= midDate && currentDate < endDate) {
        phase = 4 // 'Votação 2/2';
      } else {
        phase = 5 //'Encerrado';
      }

      return {
        ...tournament,
        phase, // Fase calculada
        midDate,
      };
    });
  }




  findOne(id: number) {
    return `This action returns a #${id} tournament`;
  }

  update(id: number, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: number) {
    return `This action removes a #${id} tournament`;
  }
}
