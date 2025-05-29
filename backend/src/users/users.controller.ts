import { Controller, Post, Body, Get, Param, Query, UseInterceptors, UploadedFile, UseGuards, UnauthorizedException, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { SignUpRequest } from '../auth/dto/signup-request.dto';
import { User } from 'src/auth/user.decorator';
import { PhotoType, User as UserSchema } from '@prisma/client';
import { PhotosService } from 'src/photo/photos.service';
import { TournamentsService } from 'src/tournaments/tournaments.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly photosService: PhotosService,
    private readonly tournamentsService: TournamentsService
  ) { }

  // @Post()
  // async create(@Body() signUpData: SignUpRequest) {
  //   return this.usersService.createUser(signUpData);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('feed/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFeedPhoto(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserSchema | null,
  ) {
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const photo = await this.photosService.createAndUploadPhoto(
      file,
      user,
      PhotoType.FEED_PHOTO,
    );

    return photo;
  }

  @Get(':userId/tournaments')
  async getUserTournaments(@Param('userId') userId: string) {
    return this.tournamentsService.findUserParticipations(Number(userId));
  }



  @Get(':id')
  public async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/desc')
  async updateUserDescription(
    @Body() body: { desc: string },
    @User() user: UserSchema | null,
  ) {
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    return this.usersService.updateUserDescription(user.id, body.desc);
  }
}
