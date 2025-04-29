import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpRequest } from '../auth/dto/signup-request.dto';
import { PhotoType } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(@Body() signUpData: SignUpRequest) {
  //   return this.usersService.createUser(signUpData);
  // }
  @Get(':userId/photos')
  public async getUserPhotos(
    @Param('userId') userId: string,
    @Query('type') type: PhotoType,
  ) {
    console.log(`Fetching photos for userId: ${userId}, type: ${type}`);
    return this.usersService.getUserPhotos(type, userId);
  }

  @Get(':id')
  public async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
