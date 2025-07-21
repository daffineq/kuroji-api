import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TmdbService } from '../service/tmdb.service.js';
import e from 'express';
import { TmdbSeasonService } from '../service/tmdb.season.service.js';
import { TmdbEpisodeService } from '../service/tmdb.episode.service.js';
import { Prisma } from '@prisma/client';
import { tmdbSelect } from '../types/types.js';

@Controller('anime')
export class TmdbController {
  constructor(
    private readonly service: TmdbService,
    private readonly season: TmdbSeasonService,
    private readonly episode: TmdbEpisodeService,
  ) {}

  @Get('info/:id/tmdb')
  async getTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTmdbByAnilist(id, tmdbSelect);
  }

  @Post('info/:id/tmdb')
  async postTmdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TmdbSelect = tmdbSelect,
  ) {
    return this.service.getTmdbByAnilist(id, select);
  }

  @Get('info/:id/tmdb/season')
  async getTmdbSeasonByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.season.getTmdbSeasonByAnilist(id);
  }

  @Get('info/:id/tmdb/season/:ep')
  async getTmdbSeasonEpisodeByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Param('ep', ParseIntPipe) ep: number,
  ) {
    return this.episode.getEpisodeDetailsByAnilist(id, ep);
  }

  @Put('info/:id/tmdb/update')
  async updateTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, tmdbSelect);
  }

  @Post('info/:id/tmdb/update')
  async postUpdateTmdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TmdbSelect = tmdbSelect,
  ) {
    return this.service.update(id, select);
  }
}
