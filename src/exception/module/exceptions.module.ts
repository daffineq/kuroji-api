import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { ExceptionsController } from '../controller/exceptions.controller';

@Module({
  imports: [SharedModule],
  controllers: [ExceptionsController],
})
export class ExceptionsModule {}
