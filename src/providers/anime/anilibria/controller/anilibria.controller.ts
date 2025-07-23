import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AnilibriaService } from '../service/anilibria.service.js';
import { anilibriaSelect } from '../types/types.js';
import { Prisma } from '@prisma/client';

@ApiTags('Anilibra')
@Controller('anime')
export class AnilibriaController {
  constructor(private readonly service: AnilibriaService) {}

  @Get('info/:id/anilibria')
  @ApiOperation({
    summary: 'Get anime information from Anilibria',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getAnilibriaByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInfoByAnilist(id, anilibriaSelect);
  }

  @Post('info/:id/anilibria')
  @ApiOperation({
    summary: 'Get anime information from Anilibria with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async postAnilibriaByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnilibriaSelect,
  ) {
    return this.service.getInfoByAnilist(id, select);
  }
}
