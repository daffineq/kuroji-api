import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module.js';
import { UpdateController } from './update.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [UpdateController],
})
export class UpdateModule {}
