import { Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { AnimepaheService } from '../service/animepahe.service';

@Controller('anime')
export class AnimepaheController {
  constructor(private readonly service: AnimepaheService) {}

  @Get('info/:id/animepahe')
  async getAnimepaheByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnimepaheByAnilist(id);
  }

  @Get('watch/:id/animepahe')
  async getSources(@Param('id') id: string) {
    return this.service.getSources(id);
  }

  @Put('info/:id/animepahe/update')
  async updateAnimepaheByAnilist(@Param('id', ParseIntPipe) id: number) {
    const data = await this.getAnimepaheByAnilist(id);
    return this.service.update(data.id);
  }
}
