import { Module } from '@nestjs/common';
import { AnimepaheController } from '../controller/animepahe.controller'
import { SharedModule } from '../../../../shared/shared.module'

@Module({
  imports: [SharedModule],
  controllers: [AnimepaheController],
})
export class AnimepaheModule {}
