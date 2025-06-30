import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module.js';
import { TvdbController } from '../controller/tvdb.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [TvdbController],
})
export class TvdbModule {}
