import { Module } from '@nestjs/common';
import { ConsoleInterceptor } from '../ConsoleInterceptor';
import { ConsoleController } from '../controller/console.controller';

@Module({
  providers: [ConsoleInterceptor],
  exports: [ConsoleInterceptor],
  controllers: [ConsoleController],
})
export class ConsoleModule {}
