import { Controller, Get, Query } from '@nestjs/common';
import { MappingsService } from '../service/mappings.service.js';

@Controller('anizip')
export class MappingsController {
  constructor(private readonly mappings: MappingsService) {}

  @Get('mappings')
  async getMappings(@Query('anilist') anilist: number) {
    return this.mappings.getMapping(anilist);
  }
}
