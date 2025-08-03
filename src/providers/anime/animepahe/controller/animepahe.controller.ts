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
import { AnimepaheService } from '../service/animepahe.service.js';
import { animepaheFetch } from '../service/animepahe.fetch.service.js';
import { Prisma } from '@prisma/client';
import { animepaheSelect } from '../types/types.js';
import { AnimepaheSelectDto } from '../types/swagger-types.js';
import { Animepahe } from '../../../../generated/nestjs-dto/animepahe/entities/animepahe.entity.js';
import { SourceDto } from '../../../../generated/consumet-dto/SourceDto.js';

@ApiTags('Animepahe')
@Controller('anime')
export class AnimepaheController {
  constructor(private readonly service: AnimepaheService) {}

  @Get('info/:id/animepahe')
  @ApiOperation({
    summary: 'Get anime information from Animepahe',
    operationId: 'getAnimepaheInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Animepahe })
  async getAnimepaheByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, animepaheSelect);
  }

  @Post('info/:id/animepahe')
  @ApiOperation({
    summary: 'Get anime information from Animepahe with custom field selection',
    operationId: 'getAnimepaheInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: AnimepaheSelectDto, required: false })
  @ApiResponse({ status: 200, type: Animepahe })
  async postAnimepaheByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnimepaheSelect = animepaheSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }

  @Get('watch/:id/animepahe')
  @ApiOperation({
    summary: 'Get streaming sources from Animepahe',
    operationId: 'getAnimepaheSources',
  })
  @ApiParam({ name: 'id', type: String, description: 'Anime episode ID' })
  @ApiResponse({ status: 200, type: SourceDto })
  async getSources(@Param('id') id: string) {
    return animepaheFetch.getSources(id);
  }

  @Put('info/:id/animepahe/update')
  @ApiOperation({
    summary: 'Update and get anime information from Animepahe',
    operationId: 'updateAnimepaheInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: Animepahe })
  async updateAnimepaheByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, animepaheSelect);
  }

  @Post('info/:id/animepahe/update')
  @ApiOperation({
    summary:
      'Update and get anime information from Animepahe with custom field selection',
    operationId: 'updateAnimepaheInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiBody({ type: AnimepaheSelectDto, required: false })
  @ApiResponse({ status: 200, type: Animepahe })
  async postUpdateAnimepaheByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.AnimepaheSelect = animepaheSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
