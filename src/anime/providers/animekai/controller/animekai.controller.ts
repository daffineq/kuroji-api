import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AnimekaiService } from '../service/animekai.service'

@Controller('anime')
export class AnimekaiController {
  constructor(private readonly service: AnimekaiService) {}

  @Get('info/:id/animekai')
  async getAnimekaiByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnimekaiByAnilist(id);
  }

  @Get('watch/:id')
  async getSources(@Param('id') id: string, @Query('dub') dub: boolean = false) {
    return this.service.getSources(id, dub);
  }
}
