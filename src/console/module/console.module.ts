import { Module } from '@nestjs/common';
import { ConsoleInterceptor } from '../ConsoleInterceptor.js';
import { ConsoleController } from '../controller/console.controller.js';
import { PrismaService } from '../../prisma.service.js';

@Module({
  providers: [ConsoleInterceptor, PrismaService],
  exports: [ConsoleInterceptor],
  controllers: [ConsoleController],
})
export class ConsoleModule {}
