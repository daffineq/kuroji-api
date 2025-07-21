import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ShikimoriService } from '../service/shikimori.service.js';
import { Prisma } from '@prisma/client';
import { shikimoriSelect } from '../types/types.js';

@Controller('shikimori')
export class ShikimoriController {
  constructor(private readonly service: ShikimoriService) {}

  @Get('info/:id')
  async getShikimori(@Param('id') id: string) {
    return this.service.getShikimori(id, shikimoriSelect);
  }

  @Post('info/:id')
  async postShikimori(
    @Param('id') id: string,
    @Body('select') select: Prisma.ShikimoriSelect = shikimoriSelect,
  ) {
    return this.service.getShikimori(id, select);
  }

  @Put('info/:id/update')
  async updateShikimori(@Param('id') id: string) {
    return this.service.update(id, shikimoriSelect);
  }

  @Post('info/:id/update')
  async postUpdateShikimori(
    @Param('id') id: string,
    @Body('select') select: Prisma.ShikimoriSelect = shikimoriSelect,
  ) {
    return this.service.update(id, select);
  }

  @Get('franchise/:franchise')
  async getFranchise(@Param('franchise') franchise: string) {
    return this.service.getFranchise(franchise);
  }

  @Get('franchiseId/:franchise')
  async getFranchiseId(@Param('franchise') franchise: string) {
    return this.service.getFranchiseIds(franchise);
  }
}
