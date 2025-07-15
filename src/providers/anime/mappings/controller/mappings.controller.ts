import { Controller, Get, Put, Query } from '@nestjs/common';
import { MappingsService } from '../service/mappings.service.js';
import { AnizipDto } from '../types/AnizipDto.js';

@Controller('anizip')
export class MappingsController {
  constructor(private readonly mappings: MappingsService) {}

  @Get('mappings')
  async getMapping(@Query('anilist') anilist: number) {
    return this.mappings.getMapping(anilist);
  }

  @Get()
  async getMappings(@Query() filter: AnizipDto) {
    return this.mappings.getMappings(filter);
  }

  @Put('mappings/update')
  async updateMapping(@Query('anilist') anilist: number) {
    return this.mappings.update(anilist);
  }
}
