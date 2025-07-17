import { Module } from '@nestjs/common';
import { ToolsController } from '../controller/tools.controller.js';
import { SharedModule } from '../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [ToolsController],
})
export class ToolsModule {}
