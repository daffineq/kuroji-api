import { Module } from '@nestjs/common';
import { ShikimoriController } from '../controller/shikimori.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [ShikimoriController],
})
export class ShikimoriModule {}
