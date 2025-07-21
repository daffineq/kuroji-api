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
import { AnimekaiService } from '../service/animekai.service.js';
import { animekaiFetch } from '../service/animekai.fetch.service.js';
import { Prisma } from '@prisma/client';
import { animeKaiSelect } from '../types/types.js';

@Controller('anime')
export class AnimekaiController {
  constructor(private readonly service: AnimekaiService) {}

  @Get('info/:id/animekai')
  async getAnimekaiByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnimekaiByAnilist(id, animeKaiSelect);
  }

  @Post('info/:id/animekai')
  async postAnimekaiByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.AnimeKaiSelect = animeKaiSelect,
  ) {
    return this.service.getAnimekaiByAnilist(id, select);
  }

  @Get('watch/:id/animekai')
  async getSources(
    @Param('id') id: string,
    @Query('dub') dub: boolean = false,
  ) {
    return animekaiFetch.getSources(id, dub);
  }

  @Put('info/:id/animekai/update')
  async updateAnimekaiByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, animeKaiSelect);
  }

  @Post('info/:id/animekai/update')
  async postUpdateAnimekaiByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.AnimeKaiSelect = animeKaiSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
