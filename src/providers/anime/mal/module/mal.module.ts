import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module.js';
import { MalController } from '../controller/mal.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [MalController],
})
export class MalModule {}
