import { Module } from '@nestjs/common';
import { ZoroService } from '../service/zoro.service';
import { ZoroHelper } from '../utils/zoro-helper'
import { ZoroController } from '../controller/zoro.controller'
import { SharedModule } from '../../../../shared/shared.module'

@Module({
  imports: [SharedModule],
  controllers: [ZoroController],
  providers: [ZoroService, ZoroHelper],
})
export class ZoroModule {}
