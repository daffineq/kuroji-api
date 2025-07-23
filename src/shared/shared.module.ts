import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { AnilistService } from '../providers/anime/anilist/service/anilist.service.js';
import { AnilistHelper } from '../providers/anime/anilist/utils/anilist-helper.js';
import { AnimekaiService } from '../providers/anime/animekai/service/animekai.service.js';
import { AnimepaheService } from '../providers/anime/animepahe/service/animepahe.service.js';
import { ShikimoriService } from '../providers/anime/shikimori/service/shikimori.service.js';
import { ShikimoriHelper } from '../providers/anime/shikimori/utils/shikimori-helper.js';
import { TmdbService } from '../providers/anime/tmdb/service/tmdb.service.js';
import { TmdbHelper } from '../providers/anime/tmdb/utils/tmdb-helper.js';
import { TvdbService } from '../providers/anime/tvdb/service/tvdb.service.js';
import { TvdbHelper } from '../providers/anime/tvdb/utils/tvdb-helper.js';
import { TvdbTokenService } from '../providers/anime/tvdb/service/token/tvdb.token.service.js';
import { UpdateService } from '../providers/update/update.service.js';
import { ZoroService } from '../providers/anime/zoro/service/zoro.service.js';
import { StreamService } from '../providers/anime/stream/service/stream.service.js';
import { AnilistIndexerService } from '../providers/anime/anilist/service/anilist-indexer/anilist-indexer.service.js';
import { AnilistAddService } from '../providers/anime/anilist/service/helper/anilist.add.service.js';
import { AnilistFilterService } from '../providers/anime/anilist/service/helper/anilist.filter.service.js';
import { AnilistFetchService } from '../providers/anime/anilist/service/helper/anilist.fetch.service.js';
import { AnilistScheduleService } from '../providers/anime/anilist/service/helper/anilist.schedule.service.js';
import { Redis } from './redis.module.js';
import { AnilistSearchService } from '../providers/anime/anilist/service/helper/anilist.search.service.js';
import { AnilistUtilService } from '../providers/anime/anilist/service/helper/anilist.util.service.js';
import { KitsuService } from '../providers/anime/kitsu/service/kitsu.service.js';
import { KitsuHelper } from '../providers/anime/kitsu/util/kitsu-helper.js';
import { AppLockService } from './app.lock.service.js';
import { AnilistRandomService } from '../providers/anime/anilist/service/helper/anilist.random.service.js';
import { TmdbSeasonService } from '../providers/anime/tmdb/service/tmdb.season.service.js';
import { TmdbEpisodeService } from '../providers/anime/tmdb/service/tmdb.episode.service.js';
import { UpdateRequestsService } from '../providers/update/update.requests.service.js';
import { AnilistSaveService } from '../providers/anime/anilist/service/helper/anilist.save.service.js';
import { MappingsService } from '../providers/anime/mappings/service/mappings.service.js';
import { TvdbFetchService } from '../providers/anime/tvdb/service/tvdb.fetch.service.js';
import { MalService } from '../providers/anime/mal/service/mal.service.js';
import { ToolsService } from '../providers/tools/service/tools.service.js';
import { AnilibriaService } from '../providers/anime/anilibria/service/anilibria.service.js';

@Module({
  imports: [Redis],
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
    AnilistSaveService,
    AnilibriaService,
    ShikimoriService,
    AnilistHelper,
    ShikimoriHelper,
    MalService,
    AnimekaiService,
    ZoroService,
    AnimepaheService,
    TmdbService,
    TmdbSeasonService,
    TmdbEpisodeService,
    TmdbHelper,
    TvdbService,
    TvdbTokenService,
    TvdbFetchService,
    TvdbHelper,
    KitsuService,
    KitsuHelper,
    UpdateService,
    UpdateRequestsService,
    StreamService,
    MappingsService,
    ToolsService,
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
    AnilistSaveService,
    AnilibriaService,
    ShikimoriService,
    AnilistHelper,
    ShikimoriHelper,
    MalService,
    AnimekaiService,
    AnimepaheService,
    TmdbService,
    TmdbSeasonService,
    TmdbEpisodeService,
    TmdbHelper,
    TvdbService,
    TvdbTokenService,
    TvdbFetchService,
    TvdbHelper,
    KitsuService,
    KitsuHelper,
    UpdateService,
    UpdateRequestsService,
    StreamService,
    MappingsService,
    ToolsService,
    AppLockService,
  ],
})
export class SharedModule {}
