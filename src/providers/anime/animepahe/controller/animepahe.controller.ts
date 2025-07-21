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
import { AnimepaheService } from '../service/animepahe.service.js';
import { animepaheFetch } from '../service/animepahe.fetch.service.js';
import { Prisma } from '@prisma/client';
import { animepaheSelect } from '../types/types.js';

@Controller('anime')
export class AnimepaheController {
  constructor(private readonly service: AnimepaheService) {}

  @Get('info/:id/animepahe')
  async getAnimepaheByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnimepaheByAnilist(id, animepaheSelect);
  }

  @Post('info/:id/animepahe')
  async postAnimepaheByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnimepaheSelect = animepaheSelect,
  ) {
    return this.service.getAnimepaheByAnilist(id, select);
  }

  @Get('watch/:id/animepahe')
  async getSources(@Param('id') id: string) {
    return animepaheFetch.getSources(id);
  }

  @Put('info/:id/animepahe/update')
  async updateAnimepaheByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, animepaheSelect);
  }

  @Post('info/:id/animepahe/update')
  async postUpdateAnimepaheByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.AnimepaheSelect = animepaheSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
