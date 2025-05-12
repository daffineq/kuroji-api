import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnilistModule } from './providers/anilist/module/anilist.module';
import { AnimekaiModule } from './providers/animekai/module/animekai.module';
import { AnimepaheModule } from './providers/animepahe/module/animepahe.module';
import { ShikimoriModule } from './providers/shikimori/module/shikimori.module';
import { TmdbModule } from './providers/tmdb/module/tmdb.module';
import { TvdbModule } from './providers/tvdb/module/tvdb.module';
import { ZoroModule } from './providers/zoro/module/zoro.module';
import { UpdateModule } from './update/update.module';
import { ExceptionsModule } from './exception/module/exceptions.module'
import { ConsoleModule } from './console/module/console.module'
import { Redis } from './shared/redis.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import Config from './configs/Config'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
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
    Redis
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
