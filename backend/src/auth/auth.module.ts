// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
import { JwtModule } from '@nestjs/jwt';  
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  
      signOptions: { expiresIn: '60m' },  
    }),
  ],
  providers: [AuthService, PasswordService], 
  exports: [AuthService],  
  controllers: [AuthController]
})
export class AuthModule {}
