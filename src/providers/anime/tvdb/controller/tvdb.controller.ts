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
import {
  tvdbArtworkSelect,
  tvdbLanguageSelect,
  tvdbLanguageTranslationSelect,
  tvdbSelect,
} from '../types/types.js';
import {
  TvdbArtworkSelectDto,
  TvdbLanguageSelectDto,
  TvdbLanguageTranslationSelectDto,
  TvdbSelectDto,
} from '../types/swagger-types.js';

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
    return this.service.getInfoByAnilist(id, tvdbSelect);
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
    return this.service.getInfoByAnilist(id, select);
  }

  @Get('info/:id/artworks')
  @ApiOperation({
    summary: 'Get artwork information for an anime from TVDB',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getArtworksByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getArtworksWithRedis(id, tvdbArtworkSelect);
  }

  @Post('info/:id/artworks')
  @ApiOperation({
    summary:
      'Get artwork information for an anime from TVDB with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TvdbArtworkSelectDto, required: false })
  async postArtworksByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbArtworkSelect = tvdbArtworkSelect,
  ) {
    return this.service.getArtworksWithRedis(id, select);
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
    return this.service.getTranslations(
      id,
      language,
      tvdbLanguageTranslationSelect,
    );
  }

  @Post('info/:id/tvdb/translations/:language')
  @ApiOperation({
    summary:
      'Get TVDB translations for a specific language with selected fields',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'language', type: String })
  @ApiBody({ type: TvdbLanguageTranslationSelectDto, required: false })
  async postTvdbTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('language') language: string,
    @Body('select')
    select: Prisma.TvdbLanguageTranslationSelect = tvdbLanguageTranslationSelect,
  ) {
    return this.service.getTranslations(id, language, select);
  }

  @Get('tvdb/languages')
  @ApiOperation({
    summary: 'Get list of available languages in TVDB',
  })
  async getLanguages() {
    return this.service.getLanguages(tvdbLanguageSelect);
  }

  @Post('tvdb/languages')
  @ApiOperation({
    summary: 'Get list of available languages in TVDB with selected fields',
  })
  @ApiBody({ type: TvdbLanguageSelectDto, required: false })
  async postLanguages(
    @Body('select') select: Prisma.TvdbLanguageSelect = tvdbLanguageSelect,
  ) {
    return this.service.getLanguages(select);
  }

  @Put('tvdb/languages/update')
  @ApiOperation({
    summary: 'Update the list of available TVDB languages',
  })
  async updateLanguages() {
    return this.service.updateLanguages(tvdbLanguageSelect);
  }

  @Post('tvdb/languages/update')
  @ApiOperation({
    summary: 'Update the list of available TVDB languages with selected fields',
  })
  @ApiBody({ type: TvdbLanguageSelectDto, required: false })
  async postUpdateLanguages(
    @Body('select') select: Prisma.TvdbLanguageSelect = tvdbLanguageSelect,
  ) {
    return this.service.updateLanguages(select);
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
