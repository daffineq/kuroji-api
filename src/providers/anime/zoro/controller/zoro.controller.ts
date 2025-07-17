import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ZoroService } from '../service/zoro.service.js';
import { zoroFetch } from '../service/zoro.fetch.service.js';

@Controller('anime')
export class ZoroController {
  constructor(private readonly service: ZoroService) {}

  // @Get('info/:id')
  // async getZoro(@Param('id') id: string) {
  //   return this.service.getZoro(id);
  // }

  @Get('info/:id/zoro')
  async getZoroByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getZoroByAnilist(id);
  }

  @Get('watch/:id/zoro')
  async getZoroWatch(
    @Param('id') id: string,
    @Query('dub') dub: boolean = false,
  ) {
    return zoroFetch.getSources(id, dub);
  }

  @Put('info/:id/zoro/update')
  async updateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force);
  }
}
