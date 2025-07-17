import { Module } from '@nestjs/common';
import { MalController } from '../controller/mal.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [MalController],
})
export class MalModule {}
