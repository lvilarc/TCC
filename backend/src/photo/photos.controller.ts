import { Controller, Get, Param } from '@nestjs/common';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get(':userId')
  public async getUserPhotos(@Param('userId') userId: string) {
    console.log(`Fetching photos for userId: ${userId}`);
    return this.photosService.getUserPhotos(userId);
  }
}
