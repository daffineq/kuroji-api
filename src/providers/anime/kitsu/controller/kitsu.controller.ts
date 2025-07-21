import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { KitsuService } from '../service/kitsu.service.js';
import { Prisma } from '@prisma/client';
import { kitsuSelect } from '../types/types.js';

@Controller('anime')
export class KitsuController {
  constructor(private readonly kitsu: KitsuService) {}

  @Get('info/:id/kitsu')
  async getByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.getKitsuByAnilist(id, kitsuSelect);
  }

  @Post('info/:id/kitsu')
  async postByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.KitsuSelect = kitsuSelect,
  ) {
    return this.kitsu.getKitsuByAnilist(id, select);
  }

  @Put('info/:id/kitsu/update')
  async updateKitsu(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.update(id, kitsuSelect);
  }

  @Post('info/:id/kitsu/update')
  async postUpdateKitsu(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.KitsuSelect = kitsuSelect,
  ) {
    return this.kitsu.update(id, select);
  }
}
