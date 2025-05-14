import { Module } from '@nestjs/common';
import { AnilistController } from '../controller/anilist.controller';
import { SharedModule } from '../../../../shared/shared.module'

@Module({
  imports: [SharedModule],
  controllers: [AnilistController],
})
export class AnilistModule {}
