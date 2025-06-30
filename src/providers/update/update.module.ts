import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
})
export class UpdateModule {}
