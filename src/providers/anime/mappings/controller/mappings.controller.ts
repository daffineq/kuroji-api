import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { MappingsService } from '../service/mappings.service.js';
import { AnizipDto } from '../types/AnizipDto.js';
import { Prisma } from '@prisma/client';
import { aniZipSelect } from '../types/types.js';

@Controller('anizip')
export class MappingsController {
  constructor(private readonly mappings: MappingsService) {}

  @Get('mappings')
  async getMapping(@Query('anilist') anilist: number) {
    return this.mappings.getMapping(anilist, aniZipSelect);
  }

  @Post('mappings')
  async postMapping(
    @Query('anilist') anilist: number,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.getMapping(anilist, select);
  }

  @Get()
  async getMappings(@Query() filter: AnizipDto) {
    return this.mappings.getMappings(filter, aniZipSelect);
  }

  @Post()
  async postMappings(
    @Query() filter: AnizipDto,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.getMappings(filter, select);
  }

  @Put('mappings/update')
  async updateMapping(@Query('anilist') anilist: number) {
    return this.mappings.update(anilist, aniZipSelect);
  }

  @Post('mappings/update')
  async postUpdateMapping(
    @Query('anilist') anilist: number,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.update(anilist, select);
  }
}
