import { Injectable } from '@nestjs/common';
import { SignUpRequest } from '../auth/dto/signup-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Photo, PhotoType, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(signUpData: SignUpRequest) {
    const user = await this.prisma.user.create({
      data: {
        name: signUpData.name,
        username: signUpData.username,
        email: signUpData.email,
        passwordHash: signUpData.password,
      },
    });
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new Error('Erro ao buscar o usuário');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new Error('Erro ao buscar o usuário');
    }
  }

  async getUserPhotos(type: PhotoType, userId: string): Promise<Photo[]> {
    try {
      const photos = await this.prisma.photo.findMany({
        where: { type, userId: Number(userId) },
      });
      return photos || []; // Retorna um array vazio se não houver fotos
    } catch (error) {
      throw new Error('Erro ao buscar fotos');
    }
  }
}
