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
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ZoroService } from '../service/zoro.service.js';
import { zoroFetch } from '../service/zoro.fetch.service.js';
import { Prisma } from '@prisma/client';
import { zoroSelect } from '../types/types.js';
import { ZoroSelectDto } from '../types/swagger-types.js';
import { Zoro } from '../../../../generated/nestjs-dto/zoro/entities/zoro.entity.js';
import { SourceDto } from '../../../../generated/consumet-dto/SourceDto.js';

@ApiTags('Zoro')
@Controller('anime')
export class ZoroController {
  constructor(private readonly service: ZoroService) {}

  @Get('info/:id/zoro')
  @ApiOperation({
    summary: 'Get anime information from Zoro',
    operationId: 'getZoroInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Zoro })
  async getZoroByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, zoroSelect);
  }

  @Post('info/:id/zoro')
  @ApiOperation({
    summary: 'Get anime information from Zoro with custom field selection',
    operationId: 'getZoroInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: ZoroSelectDto, required: false })
  @ApiResponse({ status: 200, type: Zoro })
  async postZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.ZoroSelect = zoroSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }

  @Get('watch/:id/zoro')
  @ApiOperation({
    summary: 'Get streaming sources from Zoro',
    operationId: 'getZoroSources',
  })
  @ApiParam({ name: 'id', type: String, description: 'Zoro episode ID' })
  @ApiQuery({ name: 'dub', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: SourceDto })
  async getZoroWatch(
    @Param('id') id: string,
    @Query('dub') dub: boolean = false,
  ) {
    return zoroFetch.getSources(id, dub);
  }

  @Put('info/:id/zoro/update')
  @ApiOperation({
    summary: 'Update and get information from Zoro',
    operationId: 'updateZoroInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: Zoro })
  async updateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, zoroSelect);
  }

  @Post('info/:id/zoro/update')
  @ApiOperation({
    summary: 'Update and get information from Zoro with custom field selection',
    operationId: 'updateZoroInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiBody({ type: ZoroSelectDto, required: false })
  @ApiResponse({ status: 200, type: Zoro })
  async postUpdateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.ZoroSelect = zoroSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
