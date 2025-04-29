import { Injectable } from '@nestjs/common';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParticipationService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createParticipationDto: CreateParticipationDto, user: User, photoId: number) {
    // Cria a participação com o photoId gerado pelo PhotoService
    const participation = await this.prisma.participation.create({
      data: {
        ...createParticipationDto,
        photoId: photoId,  // Atribui o ID da foto à participação
        userId: user.id,  // Define o userId do usuário autenticado
      },
    });

    return participation;
  }

  findAll() {
    return `This action returns all participation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participation`;
  }

  update(id: number, updateParticipationDto: UpdateParticipationDto) {
    return `This action updates a #${id} participation`;
  }

  remove(id: number) {
    return `This action removes a #${id} participation`;
  }
}
