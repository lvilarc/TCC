import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { PhotosController } from './photos.controller';

@Module({
  imports: [],
  providers: [PhotosService, PrismaService, S3Service],
  controllers: [PhotosController],
  exports: [PhotosService],
})
export class PhotoModule {}
