// src/auth/auth.controller.ts

import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequest } from './dto/signup-request.dto';
import { LoginRequest } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() signUpData: SignUpRequest) {
    return this.authService.signUp(signUpData);
  }

  @Post('login')
  async login(@Body() loginData: LoginRequest) {
    return this.authService.login(loginData);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Headers('authorization') authorization: string) {
    try {
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new Error('Token não fornecido ou formato incorreto');
      }
      const token = authorization.split(' ')[1];
      const user = await this.authService.validateToken(token);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, message: error.message };
    }
  }
}
