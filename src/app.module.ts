import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnilistModule } from './providers/anime/anilist/module/anilist.module';
import { AnimekaiModule } from './providers/anime/animekai/module/animekai.module';
import { AnimepaheModule } from './providers/anime/animepahe/module/animepahe.module';
import { ShikimoriModule } from './providers/anime/shikimori/module/shikimori.module';
import { TmdbModule } from './providers/anime/tmdb/module/tmdb.module';
import { TvdbModule } from './providers/anime/tvdb/module/tvdb.module';
import { ZoroModule } from './providers/anime/zoro/module/zoro.module';
import { UpdateModule } from './providers/update/update.module';
import { ConsoleModule } from './console/module/console.module';
import { Redis } from './shared/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Config from './configs/Config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { KitsuModule } from './providers/anime/kitsu/module/kitsu.module';
import { ToolsModule } from './providers/tools/module/tools.module';

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
    KitsuModule,
    UpdateModule,
    ToolsModule,
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
