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
import { ZoroService } from '../service/zoro.service.js';
import { zoroFetch } from '../service/zoro.fetch.service.js';
import { Prisma } from '@prisma/client';
import { zoroSelect } from '../types/types.js';

@Controller('anime')
export class ZoroController {
  constructor(private readonly service: ZoroService) {}

  @Get('info/:id/zoro')
  async getZoroByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getZoroByAnilist(id, zoroSelect);
  }

  @Post('info/:id/zoro')
  async postZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.ZoroSelect = zoroSelect,
  ) {
    return this.service.getZoroByAnilist(id, select);
  }

  @Get('watch/:id/zoro')
  async getZoroWatch(
    @Param('id') id: string,
    @Query('dub') dub: boolean = false,
  ) {
    return zoroFetch.getSources(id, dub);
  }

  @Put('info/:id/zoro/update')
  async updateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, zoroSelect);
  }

  @Post('info/:id/zoro/update')
  async postUpdateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.ZoroSelect = zoroSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
