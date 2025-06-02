import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module';
import { TvdbController } from '../controller/tvdb.controller';

@Module({
  imports: [SharedModule],
  controllers: [TvdbController],
})
export class TvdbModule {}
