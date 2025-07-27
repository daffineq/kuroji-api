import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { IGNORE_THROTTLER_KEY } from './ignore-throttler.decorator.js';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    protected options: ThrottlerModuleOptions,
    protected storageService: ThrottlerStorage,
    protected reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {
    super(options, storageService, reflector);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIgnored = this.reflector.getAllAndOverride<boolean>(
      IGNORE_THROTTLER_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey && typeof apiKey === 'string') {
      const existing = await this.prisma.apiKey.findUnique({
        where: { key: apiKey },
      });

      if (existing && existing.active) {
        await this.prisma.apiKeyUsage.create({
          data: {
            apiKeyId: existing.id,
            endpoint: request.url,
            method: request.method,
            origin: request.headers['origin'],
            userAgent: request.headers['user-agent'],
            ip: request.ip,
          },
        });

        return true;
      }
    }

    if (isIgnored) {
      return true;
    }

    return super.canActivate(context);
  }
}
