import { Module } from '@nestjs/common';
import { MappingsController } from '../controller/mappings.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [MappingsController],
})
export class MappingsModule {}
