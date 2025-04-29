import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PhotoService } from 'src/photo/photo.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [AuthModule],
  controllers: [TournamentsController],
  providers: [TournamentsService, PrismaService, PhotoService, S3Service],
})
export class TournamentsModule {}
