import { Module } from '@nestjs/common';
import { ToolsController } from '../controller/tools.controller.js';
import { ToolsService } from '../service/tools.service.js';
import { AnimekaiService } from '../../anime/animekai/service/animekai.service.js';
import { AnimepaheService } from '../../anime/animepahe/service/animepahe.service.js';
import { ZoroService } from '../../anime/zoro/service/zoro.service.js';
import { PrismaService } from '../../../prisma.service.js';
import { SharedModule } from '../../../shared/shared.module.js';

@Module({
  providers: [
    ToolsService,
    AnimekaiService,
    ZoroService,
    AnimepaheService,
    PrismaService,
  ],
  imports: [SharedModule],
  controllers: [ToolsController],
})
export class ToolsModule {}
