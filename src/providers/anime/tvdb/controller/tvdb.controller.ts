import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TvdbService } from '../service/tvdb.service.js';
import { Prisma } from '@prisma/client';
import { tvdbSelect } from '../types/types.js';

@Controller('anime')
export class TvdbController {
  constructor(private readonly service: TvdbService) {}

  @Get('info/:id/tvdb')
  async getTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTvdbByAnilist(id, tvdbSelect);
  }

  @Post('info/:id/tvdb')
  async postTvdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbSelect = tvdbSelect,
  ) {
    return this.service.getTvdbByAnilist(id, select);
  }

  @Get('info/:id/artworks')
  async getArtworksByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getArtworksWithRedis(id);
  }

  @Get('info/:id/tvdb/translations/:language')
  async getTvdbTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('language') language: string,
  ) {
    return this.service.getTranslations(id, language);
  }

  @Get('tvdb/languages')
  async getLanguages() {
    return this.service.getLanguages();
  }

  @Put('tvdb/languages')
  async updateLanguages() {
    return this.service.updateLanguages();
  }

  @Put('info/:id/tvdb/update')
  async updateTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, tvdbSelect);
  }

  @Post('info/:id/tvdb/update')
  async postUpdateTvdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbSelect = tvdbSelect,
  ) {
    return this.service.update(id, select);
  }
}
