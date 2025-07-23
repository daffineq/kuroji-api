import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ShikimoriService } from '../service/shikimori.service.js';
import { Prisma } from '@prisma/client';
import { shikimoriSelect } from '../types/types.js';
import { ShikimoriSelectDto } from '../types/swagger-types.js';

@ApiTags('Shikimori')
@Controller('shikimori')
export class ShikimoriController {
  constructor(private readonly service: ShikimoriService) {}

  @Get('info/:id')
  @ApiOperation({
    summary: 'Get anime information from Shikimori',
  })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  async getShikimori(@Param('id') id: string) {
    return this.service.getInfo(id, shikimoriSelect);
  }

  @Post('info/:id')
  @ApiOperation({
    summary: 'Get anime information from Shikimori with selected fields',
  })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  @ApiBody({ type: ShikimoriSelectDto, required: false })
  async postShikimori(
    @Param('id') id: string,
    @Body('select') select: Prisma.ShikimoriSelect = shikimoriSelect,
  ) {
    return this.service.getInfo(id, select);
  }

  @Put('info/:id/update')
  @ApiOperation({
    summary: 'Update and get anime information from Shikimori',
  })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  async updateShikimori(@Param('id') id: string) {
    return this.service.update(id, shikimoriSelect);
  }

  @Post('info/:id/update')
  @ApiOperation({
    summary:
      'Update and get anime information from Shikimori with selected fields',
  })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  @ApiBody({ type: ShikimoriSelectDto, required: false })
  async postUpdateShikimori(
    @Param('id') id: string,
    @Body('select') select: Prisma.ShikimoriSelect = shikimoriSelect,
  ) {
    return this.service.update(id, select);
  }

  @Get('franchise/:franchise')
  @ApiOperation({
    summary: 'Get franchise information from Shikimori',
  })
  @ApiParam({ name: 'franchise', type: String, description: 'Franchise Name' })
  async getFranchise(@Param('franchise') franchise: string) {
    return this.service.getFranchise(franchise);
  }

  @Get('franchiseId/:franchise')
  @ApiOperation({
    summary: 'Get list of IDs in a franchise',
  })
  @ApiParam({ name: 'franchise', type: String, description: 'Franchise Name' })
  async getFranchiseId(@Param('franchise') franchise: string) {
    return this.service.getFranchiseIds(franchise);
  }
}
