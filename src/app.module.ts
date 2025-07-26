import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AnilistModule } from './providers/anime/anilist/module/anilist.module.js';
import { AnimekaiModule } from './providers/anime/animekai/module/animekai.module.js';
import { AnimepaheModule } from './providers/anime/animepahe/module/animepahe.module.js';
import { ShikimoriModule } from './providers/anime/shikimori/module/shikimori.module.js';
import { TmdbModule } from './providers/anime/tmdb/module/tmdb.module.js';
import { TvdbModule } from './providers/anime/tvdb/module/tvdb.module.js';
import { ZoroModule } from './providers/anime/zoro/module/zoro.module.js';
import { UpdateModule } from './providers/update/update.module.js';
import { ConsoleModule } from './console/module/console.module.js';
import { Redis } from './shared/redis.module.js';
import { ThrottlerModule } from '@nestjs/throttler';
import Config from './configs/config.js';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { KitsuModule } from './providers/anime/kitsu/module/kitsu.module.js';
import { ToolsModule } from './providers/tools/module/tools.module.js';
import { CustomThrottlerGuard } from './shared/throttler.guard.js';
import { MappingsModule } from './providers/anime/mappings/module/mappings.module.js';
import { AnilibriaModule } from './providers/anime/anilibria/module/anilibria.module.js';
import { AuthModule } from './auth/module/auth.module.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ShikimoriModule,
    AnilistModule,
    AnilibriaModule,
    ZoroModule,
    AnimepaheModule,
    AnimekaiModule,
    TmdbModule,
    TvdbModule,
    KitsuModule,
    UpdateModule,
    ToolsModule,
    ConsoleModule,
    MappingsModule,
    AuthModule,
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
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
