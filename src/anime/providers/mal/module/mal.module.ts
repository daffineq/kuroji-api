import { Module } from '@nestjs/common';
import { SharedModule } from '../../../../shared/shared.module'
import { MalController } from '../controller/mal.controller'

@Module({
  imports: [SharedModule],
  controllers: [MalController]
})
export class MalModule {}
