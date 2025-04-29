import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpRequest } from '../auth/dto/signup-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(@Body() signUpData: SignUpRequest) {
  //   return this.usersService.createUser(signUpData);
  // }
  @Get(':id')
  public async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
