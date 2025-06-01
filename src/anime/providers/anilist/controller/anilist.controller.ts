import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { AnilistService } from '../service/anilist.service';
import { AnilistIndexerService } from '../service/anilist-indexer/anilist-indexer.service';
import { StreamService } from '../../stream/service/stream.service';
import { FilterDto } from '../filter/FilterDto';
import { AnilistAddService } from '../service/helper/anilist.add.service';
import { AnilistScheduleService } from '../service/helper/anilist.schedule.service';
import Dimens from '../../../../configs/Dimens';
import { AnilistSearchService } from '../service/helper/anilist.search.service';
import { AnilistRecommendationService } from '../service/helper/anilist.recommendation.service'
import { LastUpdateResponse, UpdateService } from '../../../../update/update.service'
import { UpdateType } from '../../../../update/UpdateType'
import { Provider } from '../../stream/model/types'

@Controller('anime')
export class AnilistController {
  constructor(
    private readonly service: AnilistService,
    private readonly add: AnilistAddService,
    private readonly search: AnilistSearchService,
    private readonly schedule: AnilistScheduleService,
    private readonly recommendation: AnilistRecommendationService,
    private readonly stream: StreamService,
    private readonly indexer: AnilistIndexerService,
    private readonly update: UpdateService,
  ) {}

  @Get('info/:id')
  async getAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnilist(id);
  }

  @Get('info/:id/recommendations')
  async getRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
  ) {
    return this.add.getRecommendations(id, filter);
  }

  @Get('info/:id/custom/recommendations')
  async getCustomRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage') perPage: number = Dimens.PER_PAGE,
    @Query('page') page: number = 1,
  ) {
    return this.recommendation.getRecommendations(id, page, perPage);
  }

  @Get('info/:id/characters')
  async getCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage') perPage: number = Dimens.PER_PAGE,
    @Query('page') page: number = 1,
  ) {
    return this.add.getCharacters(id, perPage, page);
  }

  @Get('info/:id/chronology')
  async getChronology(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
  ) {
    return this.add.getChronology(id, filter);
  }

  @Get('info/:id/episodes')
  async getEpisodes(@Param('id', ParseIntPipe) id: number) {
    return this.stream.getEpisodes(id);
  }

  @Get('info/:id/providers/:number')
  async getProvidersSingle(
    @Param('id', ParseIntPipe) id: number,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.stream.getProvidersSingle(id, number);
  }

  @Get('info/:id/episodes/:number')
  async getEpisode(
    @Param('id', ParseIntPipe) id: number,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.stream.getEpisode(id, number);
  }

  @Get('watch/:id/episodes/:number')
  async getSources(
    @Param('id', ParseIntPipe) id: number,
    @Param('number', ParseIntPipe) number: number,
    @Query('provider') provider: string = Provider.zoro,
    @Query('dub') dub: boolean = false,
  ) {
    const providerEnum =
      Provider[provider.toLowerCase() as keyof typeof Provider] ||
      Provider.zoro;

    return this.stream.getSources(providerEnum, number, id, dub);
  }

  @Get('filter')
  async filterAnilist(@Query() filter: FilterDto) {
    return this.search.getAnilists(filter);
  }

  @Get('search/:q')
  async searchAnilist(@Param('q') q: string) {
    return this.search.searchAnilist(q);
  }

  @Get('schedule')
  async getSchedule() {
    return this.schedule.getSchedule();
  }

  @Get('random')
  async getRandom() {
    return this.add.getRandom();
  }

  @Get('franchise/:franchise')
  async getFranchise(
    @Param('franchise') franchise: string,
    @Query() filter: FilterDto,
  ) {
    return this.add.getFranchise(franchise, filter);
  }

  @Get('genres')
  async getGenres() {
    return this.add.getAllGenres();
  }

  @Get('tags')
  async getTags(
    @Query('perPage') perPage: number = Dimens.PER_PAGE,
    @Query('page') page: number = 1,
  ) {
    return this.add.getAllTags(page, perPage);
  }

  @Get('updates')
  async getLastUpdates(
    @Query('entityId') entityId?: string,
    @Query('externalId') externalId?: string,
    @Query('type') type: string = UpdateType.ANILIST,
    @Query('perPage') perPage: number = Dimens.PER_PAGE,
    @Query('page') page: number = 1,
  ): Promise<LastUpdateResponse[]>{
    const parsedExternalId = externalId ? parseInt(externalId) : undefined;
    const updateType = UpdateType[type.toUpperCase() as keyof typeof UpdateType] || UpdateType.ANILIST;
    
    return this.update.getLastUpdates(
      entityId, 
      parsedExternalId, 
      updateType,
      page,
      perPage
    );
  }

  @Put('info/:id/update')
  async updateAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id)
  }

  @Put('index')
  index(
    @Query('delay') delay: number = 10,
    @Query('range') range: number = 25,
  ) {
    this.indexer
      .index(delay, range)
      .catch((err) => console.error('Indexer failed:', err)); // just in case it blows up

    return {
      status: 'Indexing started',
    };
  }

  @Put('index/stop')
  async stopIndex() {
    this.indexer.stop();
    return {
      status: 'Indexing stopped',
    };
  }

  @Put('update')
  async updateDb(
    @Query('annotateAtId') annotateAtId: string,
  ) {
    this.update
      .update(annotateAtId)
      .catch((err) => console.error('Update failed:', err)); // just in case it blows up

    return {
      status: 'Update started',
    };
  }
}
