import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpRequest } from '../auth/dto/signup-request.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    // @Post()
    // async create(@Body() signUpData: SignUpRequest) {
    //   return this.usersService.createUser(signUpData);
    // }
  }
