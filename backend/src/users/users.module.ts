import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/auth/password/password.service';
import { AuthModule } from 'src/auth/auth.module';
import { PhotoModule } from 'src/photo/photos.module';
import { TournamentsModule } from 'src/tournaments/tournaments.module';

@Module({
  imports: [forwardRef(() => AuthModule), PhotoModule, TournamentsModule],
  providers: [UsersService, PrismaService, PasswordService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
