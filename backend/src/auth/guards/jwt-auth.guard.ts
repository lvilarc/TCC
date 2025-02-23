import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector, private readonly prisma: PrismaService,) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.user = null;
      return true;
      // throw new UnauthorizedException('Token não encontrado.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;
      const user = await this.prisma.user.findUnique({  // Faz a consulta ao banco de dados
        where: { id: userId },
      });
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }
      request.user = user; // Adiciona o usuário ao request
      return true;
    } catch (error) {
      request.user = null;
      return true;
      // throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
