import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ToolsController } from '../controller/tools.controller';
import { ToolsService } from '../service/tools.service';

@Module({
  providers: [PrismaService, ToolsService],
  controllers: [ToolsController],
})
export class ToolsModule {}
