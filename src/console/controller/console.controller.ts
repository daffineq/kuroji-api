import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { ConsoleInterceptor } from '../ConsoleInterceptor.js';
import Config from '../../configs/config.js';
import { ApiKeyGuard } from '../../shared/api-key.guard.js';

@ApiSecurity('x-api-key')
@ApiTags('Console')
@Controller('console')
export class ConsoleController {
  constructor(private readonly logger: ConsoleInterceptor) {}

  @Get('all')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Get all console logs',
    description: 'Get all kind of console logs like logs, warns and errors.',
  })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  getAll(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getAll(order, page, perPage);
  }

  @Get('logs')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Get logs from console' })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  getLogs(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getLogs(order, page, perPage);
  }

  @Get('warns')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Get warnings from console' })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  getWarns(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getWarns(order, page, perPage);
  }

  @Get('errors')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Get errors from console' })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  getErrors(
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.logger.getErrors(order, page, perPage);
  }
}
