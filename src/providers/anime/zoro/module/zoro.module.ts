import { Module } from '@nestjs/common';
import { ZoroService } from '../service/zoro.service.js';
import { ZoroController } from '../controller/zoro.controller.js';
import { SharedModule } from '../../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [ZoroController],
  providers: [ZoroService],
})
export class ZoroModule {}
