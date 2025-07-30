import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TmdbService } from '../service/tmdb.service.js';
import { TmdbSeasonService } from '../service/tmdb.season.service.js';
import { TmdbEpisodeService } from '../service/tmdb.episode.service.js';
import { Prisma } from '@prisma/client';
import { tmdbSelect } from '../types/types.js';
import { TmdbSelectDto } from '../types/swagger-types.js';
import { Tmdb } from '../../../../generated/nestjs-dto/tmdb/entities/tmdb.entity.js';
import { TmdbSeason } from '../../../../generated/nestjs-dto/tmdbSeason/entities/tmdbSeason.entity.js';
import { TmdbSeasonEpisode } from '../../../../generated/nestjs-dto/tmdbSeasonEpisode/entities/tmdbSeasonEpisode.entity.js';

@ApiTags('TMDB')
@Controller('anime')
export class TmdbController {
  constructor(
    private readonly service: TmdbService,
    private readonly season: TmdbSeasonService,
    private readonly episode: TmdbEpisodeService,
  ) {}

  @Get('info/:id/tmdb')
  @ApiOperation({
    summary: 'Get anime information from TMDB',
    operationId: 'getTmdbInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Tmdb })
  async getTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, tmdbSelect);
  }

  @Post('info/:id/tmdb')
  @ApiOperation({
    summary: 'Get anime information from TMDB with custom field selection',
    operationId: 'getTmdbInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TmdbSelectDto, required: false })
  @ApiResponse({ status: 200, type: Tmdb })
  async postTmdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TmdbSelect = tmdbSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }

  @Get('info/:id/tmdb/season')
  @ApiOperation({
    summary: 'Get season information for an anime from TMDB',
    operationId: 'getTmdbSeasonInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: TmdbSeason })
  async getTmdbSeasonByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.season.getTmdbSeasonByAnilist(id);
  }

  @Get('info/:id/tmdb/season/:ep')
  @ApiOperation({
    summary: 'Get episode information for a specific episode from TMDB',
    operationId: 'getTmdbEpisodeInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiParam({ name: 'ep', type: Number, description: 'Episode Number' })
  @ApiResponse({ status: 200, type: TmdbSeasonEpisode })
  async getTmdbSeasonEpisodeByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Param('ep', ParseIntPipe) ep: number,
  ) {
    return this.episode.getEpisodeDetailsByAnilist(id, ep);
  }

  @Put('info/:id/tmdb/update')
  @ApiOperation({
    summary: 'Update and get anime information from TMDB',
    operationId: 'updateTmdbInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Tmdb })
  async updateTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, tmdbSelect);
  }

  @Post('info/:id/tmdb/update')
  @ApiOperation({
    summary:
      'Update and get anime information from TMDB with custom field selection',
    operationId: 'updateTmdbInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TmdbSelectDto, required: false })
  @ApiResponse({ status: 200, type: Tmdb })
  async postUpdateTmdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TmdbSelect = tmdbSelect,
  ) {
    return this.service.update(id, select);
  }
}
