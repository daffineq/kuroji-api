import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Config from '../configs/config.js';
@Injectable()
export class SecretKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing api key');
    }

    if (apiKey !== Config.SECURITY_PASSWORD) {
      throw new UnauthorizedException('Incorrect api key');
    }

    return true;
  }
}
