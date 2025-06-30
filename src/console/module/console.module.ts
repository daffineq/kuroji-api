import { Module } from '@nestjs/common';
import { ConsoleInterceptor } from '../ConsoleInterceptor.js';
import { ConsoleController } from '../controller/console.controller.js';

@Module({
  providers: [ConsoleInterceptor],
  exports: [ConsoleInterceptor],
  controllers: [ConsoleController],
})
export class ConsoleModule {}
