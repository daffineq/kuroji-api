import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import Config from '../configs/Config';

@Module({
  imports: [
    RedisModule.forRoot({
      options: {
        username: Config.REDIS_USERNAME ?? '',
        host: Config.REDIS_HOST ?? 'localhost',
        port: Config.REDIS_PORT ?? 6379,
        password: Config.REDIS_PASSWORD ?? '',
      },
      type: 'single',
    }),
  ],
})
export class Redis {}
