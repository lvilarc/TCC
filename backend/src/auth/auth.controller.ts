// src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequest } from './dto/signup-request.dto';
import { LoginRequest } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpData: SignUpRequest) {
    return this.authService.signUp(signUpData);
  }

  @Post('login')
  async login(@Body() loginData: LoginRequest) {
    return this.authService.login(loginData);
  }
}
