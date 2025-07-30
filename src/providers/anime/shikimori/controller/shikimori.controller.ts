import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ShikimoriService } from '../service/shikimori.service.js';
import { Prisma } from '@prisma/client';
import { shikimoriSelect } from '../types/types.js';
import { ShikimoriSelectDto } from '../types/swagger-types.js';
import { Shikimori } from '../../../../generated/nestjs-dto/shikimori/entities/shikimori.entity.js';

@ApiTags('Shikimori')
@Controller('shikimori')
export class ShikimoriController {
  constructor(private readonly service: ShikimoriService) {}

  @Get('info/:id')
  @ApiOperation({
    summary: 'Get anime information from Shikimori',
    operationId: 'getShikimoriInfo',
  })
  @ApiResponse({ status: 200, type: Shikimori })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  async getShikimori(@Param('id') id: string) {
    return this.service.getInfo(id, shikimoriSelect);
  }

  @Post('info/:id')
  @ApiOperation({
    summary: 'Get anime information from Shikimori with custom field selection',
    operationId: 'getShikimoriInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  @ApiBody({ type: ShikimoriSelectDto, required: false })
  @ApiResponse({ status: 200, type: Shikimori })
  async postShikimori(
    @Param('id') id: string,
    @Body('select') select: Prisma.ShikimoriSelect = shikimoriSelect,
  ) {
    return this.service.getInfo(id, select);
  }

  @Put('info/:id/update')
  @ApiOperation({
    summary: 'Update and get anime information from Shikimori',
    operationId: 'updateShikimoriInfo',
  })
  @ApiResponse({ status: 200, type: Shikimori })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  async updateShikimori(@Param('id') id: string) {
    return this.service.update(id, shikimoriSelect);
  }

  @Post('info/:id/update')
  @ApiOperation({
    summary:
      'Update and get anime information from Shikimori with custom field selection',
    operationId: 'updateShikimoriInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: String, description: 'MAL ID' })
  @ApiBody({ type: ShikimoriSelectDto, required: false })
  @ApiResponse({ status: 200, type: Shikimori })
  async postUpdateShikimori(
    @Param('id') id: string,
    @Body('select') select: Prisma.ShikimoriSelect = shikimoriSelect,
  ) {
    return this.service.update(id, select);
  }

  @Get('franchise/:franchise')
  @ApiOperation({
    summary: 'Get franchise information from Shikimori',
    operationId: 'getShikimoriFranchise',
  })
  @ApiParam({ name: 'franchise', type: String, description: 'Franchise Name' })
  @ApiResponse({ status: 200, type: Shikimori, isArray: true })
  async getFranchise(@Param('franchise') franchise: string) {
    return this.service.getFranchise(franchise);
  }

  @Get('franchiseId/:franchise')
  @ApiOperation({
    summary: 'Get list of IDs in a franchise',
    operationId: 'getShikimoriFranchiseById',
  })
  @ApiParam({ name: 'franchise', type: String, description: 'Franchise Name' })
  @ApiResponse({ status: 200, type: Shikimori, isArray: true })
  async getFranchiseId(@Param('franchise') franchise: string) {
    return this.service.getFranchiseIds(franchise);
  }
}
