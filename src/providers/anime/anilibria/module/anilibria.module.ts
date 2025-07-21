import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module.js';
import { AnilibriaController } from '../controller/anilibria.controller.js';

@Module({
  imports: [SharedModule],
  controllers: [AnilibriaController],
})
export class AnilibriaModule {}
