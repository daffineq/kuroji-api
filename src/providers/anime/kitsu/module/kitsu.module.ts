import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module';
import { KitsuController } from '../controller/kitsu.controller';

@Module({
  imports: [SharedModule],
  controllers: [KitsuController],
})
export class KitsuModule {}
