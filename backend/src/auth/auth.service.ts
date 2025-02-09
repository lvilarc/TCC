import { Injectable } from '@nestjs/common';
import { SignUpRequest } from './dto/signup-request.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password/password.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '@prisma/client';
import { LoginRequest } from './dto/login-request.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
    ) { }

    async generateToken(user: User) {
        const payload: JwtPayload = {
            username: user.username,
            sub: user.id,
            name: user.name
        };
        return this.jwtService.sign(payload);
    }

    async validateToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token); 
            const user = await this.usersService.findUserById(decoded.sub); 
            return user; 
        } catch (error) {
            throw new Error('Token inválido ou expirado'); 
        }
    }

    async signUp(signUpData: SignUpRequest) {
        const hashedPassword = await this.passwordService.hashPassword(signUpData.password);
        const user = await this.usersService.createUser({
            ...signUpData,
            password: hashedPassword,
        });

        const token = await this.generateToken(user)

        return {
            token
        };
    }

    async login(loginData: LoginRequest) {
        const user = await this.usersService.findUserByEmail(loginData.email)
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const isPasswordValid = await this.passwordService.comparePasswords(
            loginData.password,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            throw new Error('Senha inválida');
        }
        const token = await this.generateToken(user)

        return {
            token
        };
    }
}
