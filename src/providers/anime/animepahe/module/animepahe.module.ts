import { Module } from '@nestjs/common';
import { AnimepaheController } from '../controller/animepahe.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [AnimepaheController],
})
export class AnimepaheModule {}
