import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/auth/password/password.service';

@Module({
  providers: [UsersService, PrismaService, PasswordService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
