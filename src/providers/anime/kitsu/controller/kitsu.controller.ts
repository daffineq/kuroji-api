import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBody, ApiOperation } from '@nestjs/swagger';
import { KitsuService } from '../service/kitsu.service.js';
import { Prisma } from '@prisma/client';
import { kitsuSelect } from '../types/types.js';
import { KitsuSelectDto } from '../types/swagger-types.js';

@ApiTags('Kitsu')
@Controller('anime')
export class KitsuController {
  constructor(private readonly kitsu: KitsuService) {}

  @Get('info/:id/kitsu')
  @ApiOperation({
    summary: 'Get anime information from Kitsu',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.getKitsuByAnilist(id, kitsuSelect);
  }

  @Post('info/:id/kitsu')
  @ApiOperation({
    summary: 'Get anime information from Kitsu with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: KitsuSelectDto, required: false })
  async postByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.KitsuSelect = kitsuSelect,
  ) {
    return this.kitsu.getKitsuByAnilist(id, select);
  }

  @Put('info/:id/kitsu/update')
  @ApiOperation({
    summary: 'Update and get anime information from Kitsu',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async updateKitsu(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.update(id, kitsuSelect);
  }

  @Post('info/:id/kitsu/update')
  @ApiOperation({
    summary: 'Update and get anime information from Kitsu with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: KitsuSelectDto, required: false })
  async postUpdateKitsu(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.KitsuSelect = kitsuSelect,
  ) {
    return this.kitsu.update(id, select);
  }
}
