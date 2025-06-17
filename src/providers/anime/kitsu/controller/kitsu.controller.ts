import { Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { KitsuService } from '../service/kitsu.service';

@Controller('anime')
export class KitsuController {
  constructor(private readonly kitsu: KitsuService) {}

  @Get('info/:id/kitsu')
  async getByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.getKitsuByAnilist(id);
  }

  @Put('info/:id/kitsu/update')
  async updateKitsu(@Param('id', ParseIntPipe) id: number) {
    return this.kitsu.updateByAnilist(id);
  }
}
