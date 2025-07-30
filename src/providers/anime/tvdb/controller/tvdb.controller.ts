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
import { Tvdb } from '../../../../generated/nestjs-dto/tvdb/entities/tvdb.entity.js';
import { TvdbArtwork } from '../../../../generated/nestjs-dto/tvdbArtwork/entities/tvdbArtwork.entity.js';
import { TvdbLanguageTranslation } from '../../../../generated/nestjs-dto/tvdbLanguageTranslation/entities/tvdbLanguageTranslation.entity.js';
import { TvdbLanguage } from '../../../../generated/nestjs-dto/tvdbLanguage/entities/tvdbLanguage.entity.js';

@ApiTags('TVDB')
@Controller('anime')
export class TvdbController {
  constructor(private readonly service: TvdbService) {}

  @Get('info/:id/tvdb')
  @ApiOperation({
    summary: 'Get anime information from TVDB',
    operationId: 'getTvdbInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Tvdb })
  async getTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, tvdbSelect);
  }

  @Post('info/:id/tvdb')
  @ApiOperation({
    summary: 'Get anime information from TVDB with custom field selection',
    operationId: 'getTvdbInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TvdbSelectDto, required: false })
  @ApiResponse({ status: 200, type: Tvdb })
  async postTvdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbSelect = tvdbSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }

  @Get('info/:id/artworks')
  @ApiOperation({
    summary: 'Get artwork information for an anime from TVDB',
    operationId: 'getTvdbArtworks',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: TvdbArtwork })
  async getArtworksByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getArtworksWithRedis(id, tvdbArtworkSelect);
  }

  @Post('info/:id/artworks')
  @ApiOperation({
    summary:
      'Get artwork information for an anime from TVDB with custom field selection',
    operationId: 'getTvdbArtworksWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: TvdbArtworkSelectDto, required: false })
  @ApiResponse({ status: 200, type: TvdbArtwork })
  async postArtworksByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbArtworkSelect = tvdbArtworkSelect,
  ) {
    return this.service.getArtworksWithRedis(id, select);
  }

  @Get('info/:id/tvdb/translations/:language')
  @ApiOperation({
    summary: 'Get TVDB translations for a specific language',
    operationId: 'getTvdbTranslations',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'language', type: String })
  @ApiResponse({ status: 200, type: TvdbLanguageTranslation })
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
      'Get TVDB translations for a specific language with custom field selection',
    operationId: 'getTvdbTranslationsWithSelect',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'language', type: String })
  @ApiBody({ type: TvdbLanguageTranslationSelectDto, required: false })
  @ApiResponse({ status: 200, type: TvdbLanguageTranslation })
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
    operationId: 'getTvdbLanguages',
  })
  @ApiResponse({ status: 200, type: TvdbLanguage })
  async getLanguages() {
    return this.service.getLanguages(tvdbLanguageSelect);
  }

  @Post('tvdb/languages')
  @ApiOperation({
    summary:
      'Get list of available languages in TVDB with custom field selection',
    operationId: 'getTvdbLanguagesWithSelect',
  })
  @ApiBody({ type: TvdbLanguageSelectDto, required: false })
  @ApiResponse({ status: 200, type: TvdbLanguage })
  async postLanguages(
    @Body('select') select: Prisma.TvdbLanguageSelect = tvdbLanguageSelect,
  ) {
    return this.service.getLanguages(select);
  }

  @Put('tvdb/languages/update')
  @ApiOperation({
    summary: 'Update the list of available TVDB languages',
    operationId: 'updateTvdbLanguages',
  })
  @ApiResponse({ status: 200, type: TvdbLanguage })
  async updateLanguages() {
    return this.service.updateLanguages(tvdbLanguageSelect);
  }

  @Post('tvdb/languages/update')
  @ApiOperation({
    summary:
      'Update the list of available TVDB languages with custom field selection',
    operationId: 'updateTvdbLanguagesWithSelect',
  })
  @ApiBody({ type: TvdbLanguageSelectDto, required: false })
  @ApiResponse({ status: 200, type: TvdbLanguage })
  async postUpdateLanguages(
    @Body('select') select: Prisma.TvdbLanguageSelect = tvdbLanguageSelect,
  ) {
    return this.service.updateLanguages(select);
  }

  @Put('info/:id/tvdb/update')
  @ApiOperation({
    summary: 'Update and get information from TVDB',
    operationId: 'updateTvdbInfo',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Tvdb })
  async updateTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, tvdbSelect);
  }

  @Post('info/:id/tvdb/update')
  @ApiOperation({
    summary: 'Update and get information from TVDB with custom field selection',
    operationId: 'updateTvdbInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: TvdbSelectDto, required: false })
  @ApiResponse({ status: 200, type: Tvdb })
  async postUpdateTvdbByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.TvdbSelect = tvdbSelect,
  ) {
    return this.service.update(id, select);
  }
}
