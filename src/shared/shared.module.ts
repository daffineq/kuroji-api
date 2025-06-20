import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnilistService } from '../providers/anime/anilist/service/anilist.service';
import { AnilistHelper } from '../providers/anime/anilist/utils/anilist-helper';
import { AnimekaiService } from '../providers/anime/animekai/service/animekai.service';
import { AnimepaheService } from '../providers/anime/animepahe/service/animepahe.service';
import { ShikimoriService } from '../providers/anime/shikimori/service/shikimori.service';
import { ShikimoriHelper } from '../providers/anime/shikimori/utils/shikimori-helper';
import { TmdbService } from '../providers/anime/tmdb/service/tmdb.service';
import { TmdbHelper } from '../providers/anime/tmdb/utils/tmdb-helper';
import { TvdbService } from '../providers/anime/tvdb/service/tvdb.service';
import { TvdbHelper } from '../providers/anime/tvdb/utils/tvdb-helper';
import { TvdbTokenService } from '../providers/anime/tvdb/service/token/tvdb.token.service';
import { UpdateService } from '../providers/update/update.service';
import { ZoroService } from '../providers/anime/zoro/service/zoro.service';
import { StreamService } from '../providers/anime/stream/service/stream.service';
import { AnilistIndexerService } from '../providers/anime/anilist/service/anilist-indexer/anilist-indexer.service';
import { AnilistAddService } from '../providers/anime/anilist/service/helper/anilist.add.service';
import { AnilistFilterService } from '../providers/anime/anilist/service/helper/anilist.filter.service';
import { AnilistFetchService } from '../providers/anime/anilist/service/helper/anilist.fetch.service';
import { AnilistScheduleService } from '../providers/anime/anilist/service/helper/anilist.schedule.service';
import { ShikimoriHelperModule } from '../providers/anime/shikimori/module/shikimori-helper.module';
import { Redis } from './redis.module';
import { AnilistSearchService } from '../providers/anime/anilist/service/helper/anilist.search.service';
import { AnilistUtilService } from '../providers/anime/anilist/service/helper/anilist.util.service';
import { KitsuService } from '../providers/anime/kitsu/service/kitsu.service';
import { KitsuHelper } from '../providers/anime/kitsu/util/kitsu-helper';
import { AppLockService } from './app.lock.service';
import { AnilistRandomService } from '../providers/anime/anilist/service/helper/anilist.random.service';
import { TmdbSeasonService } from '../providers/anime/tmdb/service/tmdb.season.service';
import { TmdbEpisodeService } from '../providers/anime/tmdb/service/tmdb.episode.service';

@Module({
  imports: [ShikimoriHelperModule, Redis],
  providers: [
    PrismaService,
    AnilistService,
    AnilistAddService,
    AnilistFilterService,
    AnilistFetchService,
    AnilistScheduleService,
    AnilistIndexerService,
    AnilistSearchService,
    AnilistRandomService,
    AnilistUtilService,
    ShikimoriService,
    AnilistHelper,
    ShikimoriHelper,
    AnimekaiService,
    ZoroService,
    AnimepaheService,
    TmdbService,
    TmdbSeasonService,
    TmdbEpisodeService,
    TmdbHelper,
    TvdbService,
    TvdbTokenService,
    TvdbHelper,
    KitsuService,
    KitsuHelper,
    UpdateService,
    StreamService,
    AppLockService,
  ],
  exports: [
    PrismaService,
    AnilistService,
    AnilistAddService,
    AnilistFilterService,
    AnilistFetchService,
    AnilistScheduleService,
    AnilistIndexerService,
    AnilistSearchService,
    AnilistRandomService,
    AnilistUtilService,
    ShikimoriService,
    AnilistHelper,
    ShikimoriHelper,
    AnimekaiService,
    AnimepaheService,
    TmdbService,
    TmdbSeasonService,
    TmdbEpisodeService,
    TmdbHelper,
    TvdbService,
    TvdbTokenService,
    TvdbHelper,
    KitsuService,
    KitsuHelper,
    UpdateService,
    StreamService,
    AppLockService,
  ],
})
export class SharedModule {}
