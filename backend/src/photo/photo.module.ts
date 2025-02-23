import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { S3Module } from 'src/s3/s3.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [],  
  providers: [PhotoService, PrismaService, S3Service],  
  controllers: [],  
  exports: [PhotoService]
})
export class PhotoModule {}
