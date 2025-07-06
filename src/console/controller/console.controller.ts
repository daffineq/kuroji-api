import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConsoleInterceptor } from '../ConsoleInterceptor.js';
import Config from '../../configs/config.js';
import { SecretKeyGuard } from '../../shared/secret-key.guard.js';

@Controller('console')
export class ConsoleController {
  constructor(private readonly logger: ConsoleInterceptor) {}

  @Get('all')
  @UseGuards(SecretKeyGuard)
  getAll(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getAll(order, page, perPage);
  }

  @Get('logs')
  @UseGuards(SecretKeyGuard)
  getLogs(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getLogs(order, page, perPage);
  }

  @Get('warns')
  @UseGuards(SecretKeyGuard)
  getWarns(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getWarns(order, page, perPage);
  }

  @Get('errors')
  @UseGuards(SecretKeyGuard)
  getErrors(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getErrors(order, page, perPage);
  }
}
