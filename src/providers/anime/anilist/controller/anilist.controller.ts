import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AnilistService } from '../service/anilist.service.js';
import { StreamService } from '../../stream/service/stream.service.js';
import { FilterDto } from '../filter/FilterDto.js';
import { AnilistAddService } from '../service/helper/anilist.add.service.js';
import { AnilistScheduleService } from '../service/helper/anilist.schedule.service.js';
import { AnilistSearchService } from '../service/helper/anilist.search.service.js';
import { Provider } from '../../stream/types/types.js';
import Config from '../../../../configs/config.js';
import { AnilistRandomService } from '../service/helper/anilist.random.service.js';
import { basicSelect, fullSelect, RandomDto } from '../types/types.js';
import { TagFilterDto } from '../filter/TagFilterDto.js';
import { Prisma } from '@prisma/client';

@Controller('anime')
export class AnilistController {
  constructor(
    private readonly service: AnilistService,
    private readonly add: AnilistAddService,
    private readonly search: AnilistSearchService,
    private readonly schedule: AnilistScheduleService,
    private readonly stream: StreamService,
    private readonly random: AnilistRandomService,
  ) {}

  @Get('info/:id')
  async getAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnilist(id, fullSelect);
  }

  @Post('info/:id')
  async postAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.service.getAnilist(id, select);
  }

  @Get('info/:id/recommendations')
  async getRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
  ) {
    return this.add.getRecommendations(id, filter, basicSelect);
  }

  @Post('info/:id/recommendations')
  async postRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.add.getRecommendations(id, filter, select);
  }

  @Get('info/:id/characters')
  async getCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.add.getCharacters(id);
  }

  @Get('info/:id/chronology')
  async getChronology(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
  ) {
    return this.add.getChronology(id, filter, basicSelect);
  }

  @Post('info/:id/chronology')
  async postChronology(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.add.getChronology(id, filter, select);
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
    return this.search.getAnilists(filter, basicSelect);
  }

  @Post('filter')
  async postFilterAnilist(
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.search.getAnilists(filter, select);
  }

  @Post('filter/batch')
  async getBatch(
    @Body('filters') filters: Record<string, any>,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ): Promise<any> {
    return this.search.getAnilistsBatched(filters, select);
  }

  @Get('search/:q')
  async searchAnilist(
    @Param('q') q: string,
    @Query('franchises') franchises: number = 3,
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.search.searchAnilist(q, franchises, page, perPage);
  }

  @Post('search/:q')
  async postSearchAnilist(
    @Param('q') q: string,
    @Query('franchises') franchises: number = 3,
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
    @Body('select') select: Prisma.AnilistSelect,
  ) {
    return this.search.searchAnilist(q, franchises, page, perPage, select);
  }

  @Get('schedule')
  async getSchedule() {
    return this.schedule.getSchedule();
  }

  @Get('random')
  async getRandom(@Query() query: RandomDto) {
    return this.random.getRandom(query);
  }

  @Post('random')
  async postRandom(
    @Query() query: RandomDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.random.getRandom(query, select);
  }

  @Get('franchise/:franchise')
  async getFranchise(
    @Param('franchise') franchise: string,
    @Query() filter: FilterDto,
  ) {
    return this.search.getFranchise(franchise, filter);
  }

  @Post('franchise/:franchise')
  async postFranchise(
    @Param('franchise') franchise: string,
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.search.getFranchise(franchise, filter, select);
  }

  @Get('genres')
  async getGenres() {
    return this.add.getAllGenres();
  }

  @Get('tags')
  async getTags(@Query() filter: TagFilterDto) {
    return this.search.getTags(filter);
  }

  @Put('info/:id/update')
  async updateAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id);
  }

  @Post('info/:id/update')
  async postUpdateAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.service.update(id, select);
  }
}
