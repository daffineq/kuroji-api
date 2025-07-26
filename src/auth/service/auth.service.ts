import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service.js';
import { CreateUserPayload, JwtPayload, userSelect } from '../types/types.js';
import { getUserData, comparePasswords } from '../utils/auth-helper.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(user: CreateUserPayload) {
    const existing = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existing) throw new Error('User with that email already exists');

    return this.prisma.user.create({
      data: await getUserData(user),
      select: userSelect,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
  }
}
