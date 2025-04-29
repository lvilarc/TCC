import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PhotosService } from 'src/photo/photos.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [AuthModule],
  controllers: [ParticipationController],
  providers: [ParticipationService, PrismaService, PhotosService, S3Service],
})
export class ParticipationModule { }
