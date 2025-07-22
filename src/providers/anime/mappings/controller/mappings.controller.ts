import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiOperation } from '@nestjs/swagger';
import { MappingsService } from '../service/mappings.service.js';
import { AnizipDto } from '../types/AnizipDto.js';
import { Prisma } from '@prisma/client';
import { aniZipSelect } from '../types/types.js';
import { AniZipSelectDto } from '../types/swagger-types.js';

@ApiTags('Anizip')
@Controller('anizip')
export class MappingsController {
  constructor(private readonly mappings: MappingsService) {}

  @Get('mappings')
  @ApiOperation({
    summary: 'Get anime information & mappings from Anizip',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  async getMapping(@Query('anilist') anilist: number) {
    return this.mappings.getMapping(anilist, aniZipSelect);
  }

  @Post('mappings')
  @ApiOperation({
    summary:
      'Get anime information & mappings from Anizip with selected fields',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  @ApiBody({ type: AniZipSelectDto, required: false })
  async postMapping(
    @Query('anilist') anilist: number,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.getMapping(anilist, select);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get anime information & mappings from Anizip with selected fields',
  })
  @ApiQuery({ name: 'filter', required: true, type: AnizipDto })
  async getMappings(@Query() filter: AnizipDto) {
    return this.mappings.getMappings(filter, aniZipSelect);
  }

  @Post()
  @ApiOperation({
    summary:
      'Get anime information & mappings from Anizip with selected fields',
  })
  @ApiQuery({ name: 'filter', required: true, type: AnizipDto })
  @ApiBody({ type: AniZipSelectDto, required: false })
  async postMappings(
    @Query() filter: AnizipDto,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.getMappings(filter, select);
  }

  @Put('mappings/update')
  @ApiOperation({
    summary: 'Update and get anime information & mappings from Anizip',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  async updateMapping(@Query('anilist') anilist: number) {
    return this.mappings.update(anilist, aniZipSelect);
  }

  @Post('mappings/update')
  @ApiOperation({
    summary:
      'Update and get anime information & mappings from Anizip with selected fields',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  @ApiBody({ type: AniZipSelectDto, required: false })
  async postUpdateMapping(
    @Query('anilist') anilist: number,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.update(anilist, select);
  }
}
