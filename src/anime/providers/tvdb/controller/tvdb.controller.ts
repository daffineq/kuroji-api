import { Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { TvdbService } from '../service/tvdb.service'

@Controller('anime')
export class TvdbController {
  constructor(private readonly service: TvdbService) {}

  @Get('info/:id/tvdb')
  async getTvdbByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTvdbByAnilist(id);
  }

  @Get('info/:id/tvdb/translations/:language')
  async getTvdbTranslation(@Param('id', ParseIntPipe) id: number, @Param('language') language: string) {
    return this.service.getTranslations(id, language);
  }

  @Get('tvdb/languages')
  async getLanguages() {
    return this.service.getLanguages();
  }

  @Put('tvdb/languages')
  async updateLanguages() {
    return this.service.updateLanguages()
  }
}
