import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service.js';
import { AuthRequest, CreateUserPayload } from '../types/types.js';
import { JwtAuthGuard } from '../../decorators/auth/jwt-auth.guards.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: CreateUserPayload) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return this.auth.getProfile(req.user.userId);
  }
}
