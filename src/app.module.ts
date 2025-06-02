import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnilistModule } from './anime/providers/anilist/module/anilist.module';
import { AnimekaiModule } from './anime/providers/animekai/module/animekai.module';
import { AnimepaheModule } from './anime/providers/animepahe/module/animepahe.module';
import { ShikimoriModule } from './anime/providers/shikimori/module/shikimori.module';
import { TmdbModule } from './anime/providers/tmdb/module/tmdb.module';
import { TvdbModule } from './anime/providers/tvdb/module/tvdb.module';
import { ZoroModule } from './anime/providers/zoro/module/zoro.module';
import { UpdateModule } from './update/update.module';
import { ExceptionsModule } from './exception/module/exceptions.module';
import { ConsoleModule } from './console/module/console.module';
import { Redis } from './shared/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Config from './configs/Config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ShikimoriModule,
    AnilistModule,
    ZoroModule,
    AnimepaheModule,
    AnimekaiModule,
    TmdbModule,
    TvdbModule,
    UpdateModule,
    ExceptionsModule,
    ConsoleModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: Config.RATE_LIMIT,
          ttl: Config.RATE_LIMIT_TTL,
        },
      ],
    }),
    Redis,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
