import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma.service.js';

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
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];
    if (apiKey && typeof apiKey === 'string') {
      const existing = await this.prisma.apiKey.findUnique({
        where: { key: apiKey },
      });

      if (existing) {
        await this.prisma.apiKeyUsage.create({
          data: {
            apiKeyId: existing.id,
            endpoint: request.url,
            method: request.method,
            ip: request.ip,
          },
        });

        return true;
      }
    }

    return super.canActivate(context);
  }
}
