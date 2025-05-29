import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PhotosService } from 'src/photo/photos.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [AuthModule],
  controllers: [TournamentsController],
  providers: [TournamentsService, PrismaService, PhotosService, S3Service],
  exports: [TournamentsService]
})
export class TournamentsModule {}
