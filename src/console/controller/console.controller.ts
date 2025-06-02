import { Controller, Get } from '@nestjs/common';
import { ConsoleInterceptor } from '../ConsoleInterceptor';

@Controller('console')
export class ConsoleController {
  constructor(private readonly logger: ConsoleInterceptor) {}

  @Get('logs')
  getLogs() {
    return this.logger.getLogs();
  }

  @Get('warns')
  getWarns() {
    return this.logger.getWarns();
  }

  @Get('errors')
  getErrors() {
    return this.logger.getErrors();
  }
}
