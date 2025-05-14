import { Module } from '@nestjs/common';
import { ShikimoriController } from '../controller/shikimori.controller';
import { SharedModule } from '../../../../shared/shared.module'

@Module({
  imports: [SharedModule],
  controllers: [ShikimoriController],
})
export class ShikimoriModule {}
