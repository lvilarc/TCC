import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { PhotoModule } from './photo/photos.module';
import { PrismaService } from './prisma/prisma.service';
import { ParticipationModule } from './participation/participation.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [UsersModule, AuthModule, TournamentsModule, S3Module, PhotoModule, ParticipationModule, VoteModule],
  controllers: [AppController],
  providers: [AppService, S3Service, PrismaService],
})
export class AppModule {}
