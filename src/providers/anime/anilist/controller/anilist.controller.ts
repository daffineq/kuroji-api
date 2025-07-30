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
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
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
import { AnilistSelectDto, BatchFilterDto } from '../types/swagger-types.js';
import { Anilist } from '../../../../generated/nestjs-dto/anilist/entities/anilist.entity.js';
import { AnilistCharacter } from '../../../../generated/nestjs-dto/anilistCharacter/entities/anilistCharacter.entity.js';
import {
  SearchResponseDto,
  ScheduleDto,
  FranchiseResponseDto,
} from '../types/types-dto.js';
import { SourceDto } from '../../../../generated/consumet-dto/SourceDto.js';
import {
  EpisodeDto,
  EpisodeDetailsDto,
  ProviderInfoDto,
} from '../../stream/types/types-dto.js';
import {
  ApiResponseAnilistDto,
  ApiResponseAnilisArraytDto,
  ApiResponseAnilistTagDto,
} from '../../../../shared/responses-dto.js';
import { AnilistTag } from '../../../../generated/nestjs-dto/anilistTag/entities/anilistTag.entity.js';

@ApiTags('Anilist')
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
  @ApiOperation({
    summary: 'Get anime information from Anilist',
    operationId: 'getInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Anilist })
  async getAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnilist(id, fullSelect);
  }

  @Post('info/:id')
  @ApiOperation({
    summary: 'Get anime information from Anilist with custom field selection',
    operationId: 'getInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: Anilist })
  async postAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.service.getAnilist(id, select);
  }

  @Get('info/:id/recommendations')
  @ApiOperation({
    summary: 'Get anime recommendations from Anilist',
    operationId: 'getRecommendations',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiResponse({ status: 200, type: ApiResponseAnilistDto })
  async getRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
  ) {
    return this.add.getRecommendations(id, filter, basicSelect);
  }

  @Post('info/:id/recommendations')
  @ApiOperation({
    summary:
      'Get anime recommendations from Anilist with custom field selection',
    operationId: 'getRecommendationsWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: ApiResponseAnilistDto })
  async postRecommendations(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.add.getRecommendations(id, filter, select);
  }

  @Get('info/:id/characters')
  @ApiOperation({
    summary: 'Get characters from an anime',
    operationId: 'getCharacters',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: AnilistCharacter, isArray: true })
  async getCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.add.getCharacters(id);
  }

  @Get('info/:id/chronology')
  @ApiOperation({
    summary: 'Get chronological order of related anime',
    operationId: 'getChronology',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiResponse({ status: 200, type: ApiResponseAnilistDto })
  async getChronology(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
  ) {
    return this.add.getChronology(id, filter, basicSelect);
  }

  @Post('info/:id/chronology')
  @ApiOperation({
    summary:
      'Get chronological order of related anime with custom field selection',
    operationId: 'getChronologyWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: ApiResponseAnilistDto })
  async postChronology(
    @Param('id', ParseIntPipe) id: number,
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.add.getChronology(id, filter, select);
  }

  @Get('info/:id/episodes')
  @ApiOperation({
    summary: 'Get episode list for an anime',
    operationId: 'getEpisodes',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: EpisodeDto, isArray: true })
  async getEpisodes(@Param('id', ParseIntPipe) id: number) {
    return this.stream.getEpisodes(id);
  }

  @Get('info/:id/providers/:number')
  @ApiOperation({
    summary: 'Get available streaming providers for a specific episode',
    operationId: 'getProviders',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiParam({ name: 'number', type: Number, description: 'Episode Number' })
  @ApiResponse({ status: 200, type: ProviderInfoDto, isArray: true })
  async getProvidersSingle(
    @Param('id', ParseIntPipe) id: number,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.stream.getProvidersSingle(id, number);
  }

  @Get('info/:id/episodes/:number')
  @ApiOperation({
    summary: 'Get details of a specific episode',
    operationId: 'getDetailedEpisodes',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiParam({ name: 'number', type: Number, description: 'Episode Number' })
  @ApiResponse({ status: 200, type: EpisodeDetailsDto })
  async getEpisode(
    @Param('id', ParseIntPipe) id: number,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.stream.getEpisode(id, number);
  }

  @Get('watch/:id/episodes/:number')
  @ApiOperation({
    summary: 'Get streaming sources for a specific episode',
    description:
      'Get streaming sources for a specific episode. The default value is "zoro".',
    operationId: 'getEpisodeSource',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiParam({ name: 'number', type: Number, description: 'Episode Number' })
  @ApiQuery({ name: 'provider', required: false, type: String })
  @ApiQuery({ name: 'dub', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: SourceDto })
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
  @ApiOperation({
    summary: 'Filter anime list based on various criteria',
    operationId: 'getFilteredAnime',
  })
  //
  //@ApiQuery({ name: 'filter', required: false, type: FilterDto })
  @ApiResponse({ status: 200, type: ApiResponseAnilisArraytDto })
  async filterAnilist(@Query() filter: FilterDto) {
    return this.search.getAnilists(filter, basicSelect);
  }

  @Post('filter')
  @ApiOperation({
    summary:
      'Filter anime list based on various criteria with custom field selection',
    operationId: 'getFilteredAnimeWithSelect',
  })
  //@ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: ApiResponseAnilisArraytDto })
  async postFilterAnilist(
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.search.getAnilists(filter, select);
  }

  @Post('filter/batch')
  @ApiOperation({
    summary:
      'Filter anime list based on various criteria with custom field selection',
    operationId: 'getBatchFilteredAnime',
  })
  @ApiBody({ type: BatchFilterDto, required: true })
  @ApiResponse({ status: 200, type: ApiResponseAnilisArraytDto })
  async getBatch(
    @Body('filters') filters: Record<string, any>,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ): Promise<any> {
    return this.search.getAnilistsBatched(filters, select);
  }

  @Get('search/:q')
  @ApiOperation({
    summary: 'Search for anime by query string',
    operationId: 'searchAnime',
  })
  @ApiParam({ name: 'q', type: String, description: 'Search query' })
  @ApiQuery({ name: 'franchises', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({ status: 200, type: SearchResponseDto<Array<Anilist>> })
  async searchAnilist(
    @Param('q') q: string,
    @Query('franchises') franchises: number = 3,
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.search.searchAnilist(q, franchises, page, perPage, basicSelect);
  }

  @Post('search/:q')
  @ApiOperation({
    summary: 'Search for anime by query string with custom field selection',
    operationId: 'searchAnimeWithSelect',
  })
  @ApiParam({ name: 'q', type: String, description: 'Search query' })
  @ApiQuery({ name: 'franchises', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiBody({ type: AnilistSelectDto, required: true })
  @ApiResponse({ status: 200, type: SearchResponseDto<Array<Anilist>> })
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
  @ApiOperation({
    summary: 'Get currently airing anime schedule',
    operationId: 'getAnimeSchedule',
  })
  @ApiResponse({ status: 200, type: ScheduleDto })
  async getSchedule() {
    return this.schedule.getSchedule();
  }

  @Get('random')
  @ApiOperation({
    summary: 'Get random anime based on specified criteria',
    operationId: 'getRandomAnime',
  })
  @ApiQuery({ name: 'query', required: true, type: RandomDto })
  @ApiResponse({ status: 200, type: Anilist })
  async getRandom(@Query() query: RandomDto) {
    return this.random.getRandom(query, basicSelect);
  }

  @Post('random')
  @ApiOperation({
    summary:
      'Get random anime based on specified criteria with custom field selection',
    operationId: 'getRandomAnimeWithSelect',
  })
  @ApiQuery({ name: 'query', required: true, type: RandomDto })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: Anilist })
  async postRandom(
    @Query() query: RandomDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.random.getRandom(query, select);
  }

  @Get('franchise/:franchise')
  @ApiOperation({
    summary: 'Get information about an anime franchise',
    operationId: 'getFranchiseInfo',
  })
  @ApiParam({ name: 'franchise', type: String, description: 'Franchise name' })
  @ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiResponse({ status: 200, type: FranchiseResponseDto<Anilist> })
  async getFranchise(
    @Param('franchise') franchise: string,
    @Query() filter: FilterDto,
  ) {
    return this.search.getFranchise(franchise, filter, basicSelect);
  }

  @Post('franchise/:franchise')
  @ApiOperation({
    summary:
      'Get information about an anime franchise with custom field selection',
    operationId: 'getFranchiseInfoWithSelect',
  })
  @ApiParam({ name: 'franchise', type: String, description: 'Franchise name' })
  @ApiQuery({ name: 'filter', required: true, type: FilterDto })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: FranchiseResponseDto<Anilist> })
  async postFranchise(
    @Param('franchise') franchise: string,
    @Query() filter: FilterDto,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.search.getFranchise(franchise, filter, select);
  }

  @Get('genres')
  @ApiOperation({
    summary: 'Get a list of all available anime genres',
    operationId: 'getGenres',
  })
  @ApiResponse({ status: 200, type: String, isArray: true })
  async getGenres() {
    return this.add.getAllGenres();
  }

  @Get('tags')
  @ApiOperation({
    summary: 'Get a list of all available anime tags',
    operationId: 'getTags',
  })
  @ApiQuery({ name: 'filter', required: true, type: TagFilterDto })
  @ApiResponse({ status: 200, type: ApiResponseAnilistTagDto })
  async getTags(@Query() filter: TagFilterDto) {
    return this.search.getTags(filter);
  }

  @Put('info/:id/update')
  @ApiOperation({
    summary: 'Update and get anime information',
    operationId: 'updateAnilist',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Anilist })
  async updateAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, basicSelect);
  }

  @Post('info/:id/update')
  @ApiOperation({
    summary: 'Update and get anime information with custom field selection',
    operationId: 'updateAnilistWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: AnilistSelectDto, required: false })
  @ApiResponse({ status: 200, type: Anilist })
  async postUpdateAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnilistSelect = basicSelect,
  ) {
    return this.service.update(id, select);
  }
}
