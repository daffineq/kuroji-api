import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module.js';
import { AnimekaiController } from '../controller/animekai.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [AnimekaiController],
})
export class AnimekaiModule {}
