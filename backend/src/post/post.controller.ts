import { Controller, Get, UseInterceptors, Post, UploadedFiles, UseGuards, Body, UnauthorizedException } from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PhotoType, User as UserSchema } from '@prisma/client';
import { User } from 'src/auth/user.decorator';
import { PhotosService } from 'src/photo/photos.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly photosService: PhotosService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserSchema | null,
  ) {
    if (!user) {
      throw new UnauthorizedException('Sem autorização.');
    }

    const photoIds: number[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const photo = await this.photosService.createAndUploadPhoto(
          file,
          user,
          PhotoType.COMMUNITY_POST,
        );
        photoIds.push(photo.id);
      }
    }

    return this.postService.create(createPostDto, user, photoIds);
  }

  @Get()
  async findAll() {
    return this.postService.findAll();
  }
}
