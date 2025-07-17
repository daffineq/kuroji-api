import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { AnimekaiService } from '../service/animekai.service.js';
import { animekaiFetch } from '../service/animekai.fetch.service.js';

@Controller('anime')
export class AnimekaiController {
  constructor(private readonly service: AnimekaiService) {}

  @Get('info/:id/animekai')
  async getAnimekaiByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnimekaiByAnilist(id);
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
    return this.service.update(id, force);
  }
}
