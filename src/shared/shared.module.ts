import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CustomHttpService } from '../http/http.service';
import { PrismaService } from '../prisma.service';
import { AnilistService } from '../anime/providers/anilist/service/anilist.service';
import { AnilistHelper } from '../anime/providers/anilist/utils/anilist-helper';
import { AnimekaiService } from '../anime/providers/animekai/service/animekai.service';
import { AnimeKaiHelper } from '../anime/providers/animekai/utils/animekai-helper';
import { AnimepaheService } from '../anime/providers/animepahe/service/animepahe.service';
import { AnimePaheHelper } from '../anime/providers/animepahe/utils/animepahe-helper';
import { ShikimoriService } from '../anime/providers/shikimori/service/shikimori.service';
import { ShikimoriHelper } from '../anime/providers/shikimori/utils/shikimori-helper';
import { TmdbService } from '../anime/providers/tmdb/service/tmdb.service'
import { TmdbHelper } from '../anime/providers/tmdb/utils/tmdb-helper'
import { TvdbService } from '../anime/providers/tvdb/service/tvdb.service'
import { TvdbHelper } from '../anime/providers/tvdb/utils/tvdb-helper'
import { TvdbTokenService } from '../anime/providers/tvdb/service/token/tvdb.token.service'
import { UpdateService } from '../update/update.service'
import { ZoroService } from '../anime/providers/zoro/service/zoro.service'
import { ZoroHelper } from '../anime/providers/zoro/utils/zoro-helper'
import { StreamService } from '../anime/providers/stream/service/stream.service'
import { AnilistIndexerService } from '../anime/providers/anilist/service/anilist-indexer/anilist-indexer.service'
import { AnilistAddService } from '../anime/providers/anilist/service/helper/anilist.add.service'
import { AnilistFilterService } from '../anime/providers/anilist/service/helper/anilist.filter.service'
import { AnilistFetchService } from '../anime/providers/anilist/service/helper/anilist.fetch.service'
import { ExceptionsService } from '../exception/service/exceptions.service'
import { AnilistScheduleService } from '../anime/providers/anilist/service/helper/anilist.schedule.service'
import { ShikimoriHelperModule } from '../anime/providers/shikimori/module/shikimori-helper.module'
import { Redis } from './redis.module'
import { AnilistSearchService } from '../anime/providers/anilist/service/helper/anilist.search.service'
import { AnilistUtilService } from '../anime/providers/anilist/service/helper/anilist.util.service'

@Module({
  imports: [
    HttpModule,
    ShikimoriHelperModule,
    Redis
  ],
  providers: [
    PrismaService,
    CustomHttpService,
    AnilistService,
    AnilistAddService,
    AnilistFilterService,
    AnilistFetchService,
    AnilistScheduleService,
    AnilistIndexerService,
    AnilistSearchService,
    AnilistUtilService,
    ShikimoriService,
    AnilistHelper,
    ShikimoriHelper,
    AnimekaiService,
    AnimeKaiHelper,
    ZoroService,
    ZoroHelper,
    AnimepaheService,
    AnimePaheHelper,
    TmdbService,
    TmdbHelper,
    TvdbService,
    TvdbTokenService,
    TvdbHelper,
    UpdateService,
    StreamService,
    ExceptionsService
  ],
  exports: [
    PrismaService,
    CustomHttpService,
    AnilistService,
    AnilistAddService,
    AnilistFilterService,
    AnilistFetchService,
    AnilistScheduleService,
    AnilistIndexerService,
    AnilistSearchService,
    AnilistUtilService,
    ShikimoriService,
    AnilistHelper,
    ShikimoriHelper,
    AnimekaiService,
    AnimeKaiHelper,
    AnimepaheService,
    AnimePaheHelper,
    TmdbService,
    TmdbHelper,
    TvdbService,
    TvdbTokenService,
    TvdbHelper,
    UpdateService,
    StreamService,
    ExceptionsService
  ],
})
export class SharedModule {}
