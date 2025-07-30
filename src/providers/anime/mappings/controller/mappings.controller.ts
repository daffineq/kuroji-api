import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MappingsService } from '../service/mappings.service.js';
import { AnizipDto } from '../types/AnizipDto.js';
import { Prisma } from '@prisma/client';
import { aniZipSelect } from '../types/types.js';
import { AniZipSelectDto } from '../types/swagger-types.js';
import { AniZip } from '../../../../generated/nestjs-dto/aniZip/entities/aniZip.entity.js';
import { ApiResponseAniZipDto } from '../../../../shared/responses-dto.js';

@ApiTags('Anizip')
@Controller('anizip')
export class MappingsController {
  constructor(private readonly mappings: MappingsService) {}

  @Get('mappings')
  @ApiOperation({
    summary: 'Get anime information & mappings from Anizip',
    operationId: 'getAnizipInfo',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  @ApiResponse({ status: 200, type: AniZip })
  async getMapping(@Query('anilist') anilist: number) {
    return this.mappings.getMapping(anilist, aniZipSelect);
  }

  @Post('mappings')
  @ApiOperation({
    summary:
      'Get anime information & mappings from Anizip with custom field selection',
    operationId: 'getAnizipInfoWithSelect',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  @ApiBody({ type: AniZipSelectDto, required: false })
  @ApiResponse({ status: 200, type: AniZip })
  async postMapping(
    @Query('anilist') anilist: number,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.getMapping(anilist, select);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all anime information & mappings from Anizip',
    operationId: 'getAllAnizipInfo',
  })
  @ApiQuery({ name: 'filter', required: true, type: AnizipDto })
  @ApiResponse({ status: 200, type: ApiResponseAniZipDto })
  async getMappings(@Query() filter: AnizipDto) {
    return this.mappings.getMappings(filter, aniZipSelect);
  }

  @Post()
  @ApiOperation({
    summary:
      'Get all anime information & mappings from Anizip with custom field selection',
    operationId: 'getAllAnizipInfoWithSelect',
  })
  @ApiQuery({ name: 'filter', required: true, type: AnizipDto })
  @ApiBody({ type: AniZipSelectDto, required: false })
  @ApiResponse({ status: 200, type: ApiResponseAniZipDto })
  async postMappings(
    @Query() filter: AnizipDto,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.getMappings(filter, select);
  }

  @Put('mappings/update')
  @ApiOperation({
    summary: 'Update and get anime information & mappings from Anizip',
    operationId: 'updateAnizipInfo',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  @ApiResponse({ status: 200, type: AniZip })
  async updateMapping(@Query('anilist') anilist: number) {
    return this.mappings.update(anilist, aniZipSelect);
  }

  @Post('mappings/update')
  @ApiOperation({
    summary:
      'Update and get anime information & mappings from Anizip with custom field selection',
    operationId: 'updateAnizipInfoWithSelect',
  })
  @ApiQuery({ name: 'anilist', required: true, type: Number })
  @ApiBody({ type: AniZipSelectDto, required: false })
  @ApiResponse({ status: 200, type: AniZip })
  async postUpdateMapping(
    @Query('anilist') anilist: number,
    @Body('select') select: Prisma.AniZipSelect = aniZipSelect,
  ) {
    return this.mappings.update(anilist, select);
  }
}
