import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import Config from '../configs/config';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    protected options: ThrottlerModuleOptions,
    protected storageService: ThrottlerStorage,
    protected reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];
    if (apiKey === Config.SECURITY_PASSWORD) {
      return true;
    }

    return super.canActivate(context);
  }
}
