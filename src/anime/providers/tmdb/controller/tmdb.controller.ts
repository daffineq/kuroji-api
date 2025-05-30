import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TmdbService } from '../service/tmdb.service';

@Controller('anime')
export class TmdbController {
  constructor(private readonly service: TmdbService) {}

  @Get('info/:id/tmdb')
  async getTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTmdbByAnilist(id);
  }

  @Get('info/:id/tmdb/season')
  async getTmdbSeasonByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTmdbSeasonByAnilist(id);
  }

  @Get('info/:id/tmdb/update')
  async updateTmdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    const data = await this.getTmdbByAnilist(id);
    return this.service.update(data.id);
  }
}
