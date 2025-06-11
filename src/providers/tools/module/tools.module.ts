import { Module } from '@nestjs/common';
import { ToolsController } from '../controller/tools.controller';
import { ToolsService } from '../service/tools.service';
import { AnimekaiService } from '../../anime/animekai/service/animekai.service';
import { AnimepaheService } from '../../anime/animepahe/service/animepahe.service';
import { ZoroService } from '../../anime/zoro/service/zoro.service';
import { PrismaService } from '../../../prisma.service';

@Module({
  providers: [
    ToolsService,
    AnimekaiService,
    ZoroService,
    AnimepaheService,
    PrismaService,
  ],
  controllers: [ToolsController],
})
export class ToolsModule {}
