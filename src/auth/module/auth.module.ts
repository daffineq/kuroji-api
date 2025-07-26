import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controller/auth.controller.js';
import { AuthService } from '../service/auth.service.js';
import { JwtStrategy } from '../strategy/jwt.strategy.js';
import Config from '../../configs/config.js';
import { PrismaService } from '../../prisma.service.js';
import { ApiKeyController } from '../controller/api.key.controller.js';
import { ApiKeyService } from '../service/api.key.service.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: Config.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController, ApiKeyController],
  providers: [AuthService, ApiKeyService, JwtStrategy, PrismaService],
})
export class AuthModule {}
