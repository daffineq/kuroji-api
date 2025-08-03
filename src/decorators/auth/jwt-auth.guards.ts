import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import Config from '../../configs/config.js';
import { REQUIRE_TOKEN } from './jwt-auth.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    const requiresToken = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_TOKEN,
      [context.getHandler(), context.getClass()],
    );

    if (apiKey && typeof apiKey === 'string') {
      if (apiKey === Config.ADMIN_KEY && !requiresToken) {
        return true;
      }
    }

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Requires valid token or admin api key')
      );
    }

    return user;
  }
}
