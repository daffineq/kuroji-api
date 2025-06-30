import { Module } from '@nestjs/common';
import { AnilistController } from '../controller/anilist.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [AnilistController],
})
export class AnilistModule {}
