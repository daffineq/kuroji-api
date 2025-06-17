import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Config from '../configs/config';
@Injectable()
export class SecretKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];
    if (!apiKey || apiKey !== Config.SECURITY_PASSWORD) {
      throw new UnauthorizedException('Dame da yo! Unauthorized 😠🔒');
    }

    return true;
  }
}
