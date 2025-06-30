import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module.js';
import { KitsuController } from '../controller/kitsu.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [KitsuController],
})
export class KitsuModule {}
