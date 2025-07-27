import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma.service.js';
import { API_KEY_TYPE } from './api-key.decorator.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('Missing or invalid API key');
    }

    const key = await this.prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!key) {
      throw new UnauthorizedException('Invalid API key');
    }

    const requiredType = this.reflector.get<string>(
      API_KEY_TYPE,
      context.getHandler(),
    );

    if (requiredType && key.type !== requiredType) {
      throw new UnauthorizedException(
        `API key must be of type "${requiredType}"`,
      );
    }

    return true;
  }
}
