import { Module } from '@nestjs/common';
import { AnilistController } from '../controller/anilist.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';
import { AnilistIndexerController } from '../service/anilist-indexer/anilist-indexer.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [AnilistController, AnilistIndexerController],
})
export class AnilistModule {}
