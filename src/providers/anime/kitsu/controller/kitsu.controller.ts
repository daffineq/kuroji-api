import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { KitsuService } from '../service/kitsu.service.js';
import { Prisma } from '@prisma/client';
import { kitsuSelect } from '../types/types.js';
import { KitsuSelectDto } from '../types/swagger-types.js';
import { Kitsu } from '../../../../generated/nestjs-dto/kitsu/entities/kitsu.entity.js';

@ApiTags('Kitsu')
@Controller('anime')
export class KitsuController {
  constructor(private readonly kitsu: KitsuService) {}

  @Get('info/:id/kitsu')
  @ApiOperation({
    summary: 'Get anime information from Kitsu',
    operationId: 'getKitsuInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Kitsu })
  async getByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.getInfoByAnilist(id, kitsuSelect);
  }

  @Post('info/:id/kitsu')
  @ApiOperation({
    summary: 'Get anime information from Kitsu with custom field selection',
    operationId: 'getKitsuInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: KitsuSelectDto, required: false })
  @ApiResponse({ status: 200, type: Kitsu })
  async postByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.KitsuSelect = kitsuSelect,
  ) {
    return this.kitsu.getInfoByAnilist(id, select);
  }

  @Put('info/:id/kitsu/update')
  @ApiOperation({
    summary: 'Update and get anime information from Kitsu',
    operationId: 'updateKitsuInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Kitsu })
  async updateKitsu(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.update(id, kitsuSelect);
  }

  @Post('info/:id/kitsu/update')
  @ApiOperation({
    summary:
      'Update and get anime information from Kitsu with custom field selection',
    operationId: 'updateKitsuInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: KitsuSelectDto, required: false })
  @ApiResponse({ status: 200, type: Kitsu })
  async postUpdateKitsu(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.KitsuSelect = kitsuSelect,
  ) {
    return this.kitsu.update(id, select);
  }
}
