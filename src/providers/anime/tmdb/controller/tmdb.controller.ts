import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBody, ApiOperation } from '@nestjs/swagger';
import { TmdbService } from '../service/tmdb.service.js';
import e from 'express'; // TODO: Remove this as it's not used.
import { TmdbSeasonService } from '../service/tmdb.season.service.js';
import { TmdbEpisodeService } from '../service/tmdb.episode.service.js';
import { Prisma } from '@prisma/client';
import { tmdbSelect } from '../types/types.js';
import { TmdbSelectDto } from '../types/swagger-types.js';

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
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTmdbByAnilist(id, tmdbSelect);
  }

  @Post('info/:id/tmdb')
  @ApiOperation({
    summary: 'Get anime information from TMDB with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TmdbSelectDto, required: false })
  async postTmdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TmdbSelect = tmdbSelect,
  ) {
    return this.service.getTmdbByAnilist(id, select);
  }

  @Get('info/:id/tmdb/season')
  @ApiOperation({
    summary: 'Get season information for an anime from TMDB',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getTmdbSeasonByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.season.getTmdbSeasonByAnilist(id);
  }

  @Get('info/:id/tmdb/season/:ep')
  @ApiOperation({
    summary: 'Get episode information for a specific episode from TMDB',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiParam({ name: 'ep', type: Number, description: 'Episode Number' })
  async getTmdbSeasonEpisodeByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Param('ep', ParseIntPipe) ep: number,
  ) {
    return this.episode.getEpisodeDetailsByAnilist(id, ep);
  }

  @Put('info/:id/tmdb/update')
  @ApiOperation({
    summary: 'Update and get anime information from TMDB',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async updateTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, tmdbSelect);
  }

  @Post('info/:id/tmdb/update')
  @ApiOperation({
    summary: 'Update and get anime information from TMDB with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TmdbSelectDto, required: false })
  async postUpdateTmdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TmdbSelect = tmdbSelect,
  ) {
    return this.service.update(id, select);
  }
}
