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
import { AnimekaiService } from '../service/animekai.service.js';
import { animekaiFetch } from '../service/animekai.fetch.service.js';
import { Prisma } from '@prisma/client';
import { animeKaiSelect } from '../types/types.js';
import { AnimekaiSelectDto } from '../types/swagger-types.js';
import { AnimeKai } from '../../../../generated/nestjs-dto/animeKai/entities/animeKai.entity.js';
import { SourceDto } from '../../../../generated/consumet-dto/SourceDto.js';

@ApiTags('Animekai')
@Controller('anime')
export class AnimekaiController {
  constructor(private readonly service: AnimekaiService) {}

  @Get('info/:id/animekai')
  @ApiOperation({
    summary: 'Get anime information from Animekai',
    operationId: 'getAnimekaiInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: AnimeKai })
  async getAnimekaiByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, animeKaiSelect);
  }

  @Post('info/:id/animekai')
  @ApiOperation({
    summary: 'Get anime information from Animekai with custom field selection',
    operationId: 'getAnimekaiInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: AnimekaiSelectDto, required: false })
  @ApiResponse({ status: 200, type: AnimeKai })
  async postAnimekaiByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnimeKaiSelect = animeKaiSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }

  @Get('watch/:id/animekai')
  @ApiOperation({
    summary: 'Get streaming sources from Animekai',
    operationId: 'getAnimekaiSources',
  })
  @ApiParam({ name: 'id', type: String, description: 'Animekai episode ID' })
  @ApiQuery({ name: 'dub', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: SourceDto })
  async getSources(
    @Param('id') id: string,
    @Query('dub') dub: boolean = false,
  ) {
    return animekaiFetch.getSources(id, dub);
  }

  @Put('info/:id/animekai/update')
  @ApiOperation({
    summary: 'Update and get information from Animekai',
    operationId: 'updateAnimekaiInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: AnimeKai })
  async updateAnimekaiByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, animeKaiSelect);
  }

  @Post('info/:id/animekai/update')
  @ApiOperation({
    summary:
      'Update and get information from Animekai with custom field selection',
    operationId: 'updateAnimekaiInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiBody({ type: AnimekaiSelectDto, required: false })
  @ApiResponse({ status: 200, type: AnimeKai })
  async postUpdateAnimekaiByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.AnimeKaiSelect = animeKaiSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
