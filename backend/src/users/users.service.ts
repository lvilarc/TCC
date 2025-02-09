import { Injectable } from '@nestjs/common';
import { SignUpRequest } from '../auth/dto/signup-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

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

  async findUserById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
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
}
