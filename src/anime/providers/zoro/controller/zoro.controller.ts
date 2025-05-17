import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ZoroService } from '../service/zoro.service'

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
  async getZoroWatch(@Param('id') id: string, @Query('dub') dub: boolean = false) {
    return this.service.getSources(id, dub);
  }
}
