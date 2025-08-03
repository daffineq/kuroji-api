import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AnilibriaService } from '../service/anilibria.service.js';
import { anilibriaSelect } from '../types/types.js';
import { Prisma } from '@prisma/client';
import { Anilibria } from '../../../../generated/nestjs-dto/anilibria/entities/anilibria.entity.js';

@ApiTags('Anilibra')
@Controller('anime')
export class AnilibriaController {
  constructor(private readonly service: AnilibriaService) {}

  @Get('info/:id/anilibria')
  @ApiOperation({
    summary: 'Get anime information from Anilibria',
    operationId: 'getAnilibraInfo',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Anilibria })
  async getAnilibriaByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, anilibriaSelect);
  }

  @Post('info/:id/anilibria')
  @ApiOperation({
    summary: 'Get anime information from Anilibria with custom field selection',
    operationId: 'getAnilibraInfoWithSelect',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiResponse({ status: 200, type: Anilibria })
  async postAnilibriaByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnilibriaSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }
}
