import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service.js';
import {
  AuthRequest,
  CreateUserPayload,
  GiveRole,
  Login,
} from '../types/types.js';
import { JwtAuthGuard } from '../../decorators/auth/jwt-auth.guards.js';
import { UserRole } from '@prisma/client';
import { Roles } from '../../decorators/auth/roles.decorator.js';
import { RolesGuard } from '../../decorators/auth/roles.guard.js';
import { RequireToken } from '../../decorators/auth/jwt-auth.decorator.js';
import { ApiBody, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserPayloadDto,
  GiveRoleDto,
  LoginDto,
} from '../types/swagger-types.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserPayloadDto, required: true })
  register(@Body() body: CreateUserPayload) {
    return this.auth.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Get JWT token for user' })
  @ApiBody({ type: LoginDto, required: true })
  login(@Body() body: Login) {
    return this.auth.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @RequireToken()
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token (e.g. `Bearer <your_token_here>`)',
      required: true,
    },
  ])
  getProfile(@Req() req: AuthRequest) {
    return this.auth.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('give-role')
  @ApiOperation({ summary: 'Give a role to a user' })
  @ApiBody({ type: GiveRoleDto, required: true })
  @ApiHeaders([
    {
      name: 'Authorization',
      description:
        'Bearer token (e.g. `Bearer <your_token_here>`), not required if admin api key provided',
      required: false,
    },
  ])
  async giveRole(@Body() body: GiveRole) {
    return this.auth.giveRole(body.userId, body.role);
  }
}
