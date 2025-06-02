import { Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { KitsuService } from '../service/kitsu.service';

@Controller('anime')
export class KitsuController {
  constructor(private readonly kitsu: KitsuService) {}

  @Put('info/:id/kitsu/update')
  async updateAnimepaheByAnilist(@Param('id', ParseIntPipe) id: number) {
    const data = await this.kitsu.getKitsuByAnilist(id);
    return this.kitsu.updateKitsu(data.id);
  }
}
