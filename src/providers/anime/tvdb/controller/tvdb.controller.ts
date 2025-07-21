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
import { TvdbService } from '../service/tvdb.service.js';
import { Prisma } from '@prisma/client';
import { tvdbSelect } from '../types/types.js';
import { TvdbSelectDto } from '../types/swagger-types.js';

@ApiTags('TVDB')
@Controller('anime')
export class TvdbController {
  constructor(private readonly service: TvdbService) {}

  @Get('info/:id/tvdb')
  @ApiOperation({
    summary: 'Get anime information from TVDB',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTvdbByAnilist(id, tvdbSelect);
  }

  @Post('info/:id/tvdb')
  @ApiOperation({
    summary: 'Get anime information from TVDB with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TvdbSelectDto, required: false })
  async postTvdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbSelect = tvdbSelect,
  ) {
    return this.service.getTvdbByAnilist(id, select);
  }

  @Get('info/:id/artworks')
  @ApiOperation({
    summary: 'Get artwork information for an anime from TVDB',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getArtworksByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getArtworksWithRedis(id);
  }

  @Get('info/:id/tvdb/translations/:language')
  @ApiOperation({
    summary: 'Get TVDB translations for a specific language',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'language', type: String })
  async getTvdbTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('language') language: string,
  ) {
    return this.service.getTranslations(id, language);
  }

  @Get('tvdb/languages')
  @ApiOperation({
    summary: 'Get list of available languages in TVDB',
  })
  async getLanguages() {
    return this.service.getLanguages();
  }

  @Put('tvdb/languages')
  @ApiOperation({
    summary: 'Update the list of available TVDB languages',
  })
  async updateLanguages() {
    return this.service.updateLanguages();
  }

  @Put('info/:id/tvdb/update')
  @ApiOperation({
    summary: 'Update and get information from TVDB',
  })
  @ApiParam({ name: 'id', type: Number })
  async updateTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, tvdbSelect);
  }

  @Post('info/:id/tvdb/update')
  @ApiOperation({
    summary: 'Update and get information from TVDB with selected fields',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: TvdbSelectDto, required: false })
  async postUpdateTvdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbSelect = tvdbSelect,
  ) {
    return this.service.update(id, select);
  }
}
