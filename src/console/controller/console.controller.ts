import { Controller, Get, Query } from '@nestjs/common';
import { ConsoleInterceptor } from '../ConsoleInterceptor';
import Config from '../../configs/config';

@Controller('console')
export class ConsoleController {
  constructor(private readonly logger: ConsoleInterceptor) {}

  @Get('all')
  getAll(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getAll(order, page, perPage);
  }

  @Get('logs')
  getLogs(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getLogs(order, page, perPage);
  }

  @Get('warns')
  getWarns(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getWarns(order, page, perPage);
  }

  @Get('errors')
  getErrors(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getErrors(order, page, perPage);
  }
}
