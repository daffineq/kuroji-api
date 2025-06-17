import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnilistService } from '../service/anilist.service';
import { AnilistIndexerService } from '../service/anilist-indexer/anilist-indexer.service';
import { StreamService } from '../../stream/service/stream.service';
import { FilterDto } from '../filter/FilterDto';
import { AnilistAddService } from '../service/helper/anilist.add.service';
import { AnilistScheduleService } from '../service/helper/anilist.schedule.service';
import { AnilistSearchService } from '../service/helper/anilist.search.service';
import { UpdateService } from '../../../update/update.service';
import { Provider } from '../../stream/types/types';
import Config from '../../../../configs/config';
import { AnilistRandomService } from '../service/helper/anilist.random.service';
import { RandomDto } from '../types/types';
import { SecretKeyGuard } from '../../../../shared/secret-key.guard';

@Controller('anime')
export class AnilistController {
  constructor(
    private readonly service: AnilistService,
    private readonly add: AnilistAddService,
    private readonly search: AnilistSearchService,
    private readonly schedule: AnilistScheduleService,
    private readonly stream: StreamService,
    private readonly indexer: AnilistIndexerService,
    private readonly random: AnilistRandomService,
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

  @Get('info/:id/characters')
  async getCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
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

  @Post('filter/batch')
  async getBatch(@Body() filters: Record<string, any>): Promise<any> {
    return this.search.getAnilistsBatched(filters);
  }

  @Get('search/:q')
  async searchAnilist(
    @Param('q') q: string,
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.search.searchAnilist(q, page, perPage);
  }

  @Get('schedule')
  async getSchedule() {
    return this.schedule.getSchedule();
  }

  @Get('random')
  async getRandom(@Query() query: RandomDto) {
    return this.random.getRandom(query);
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
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.add.getAllTags(page, perPage);
  }

  @Put('info/:id/update')
  async updateAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id);
  }

  @Put('update')
  @UseGuards(SecretKeyGuard)
  updateDb() {
    this.update.update().catch((err) => console.error('Update failed:', err)); // just in case it blows up

    return {
      status: 'Update started',
    };
  }

  @Put('update/recalculate')
  @UseGuards(SecretKeyGuard)
  recalculateDb() {
    this.update
      .recalculateTemperatures()
      .catch((err) => console.error('Recalculation failed:', err)); // just in case it blows up

    return {
      status: 'Recalculation started',
    };
  }

  @Put('update/stop')
  @UseGuards(SecretKeyGuard)
  stopUpdate() {
    this.update.stop();
    return {
      status: 'Update stopped',
    };
  }

  @Post('index')
  @UseGuards(SecretKeyGuard)
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

  @Post('index/stop')
  @UseGuards(SecretKeyGuard)
  stopIndex() {
    this.indexer.stop();
    return {
      status: 'Indexing stopped',
    };
  }
}
