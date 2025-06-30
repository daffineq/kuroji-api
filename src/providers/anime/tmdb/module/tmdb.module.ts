import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module.js';
import { TmdbController } from '../controller/tmdb.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [TmdbController],
})
export class TmdbModule {}
