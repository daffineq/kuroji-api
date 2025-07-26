import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { AnilistIndexerService } from './anilist-indexer.service.js';
import { ApiKeyGuard } from '../../../../../shared/api-key.guard.js';

@ApiSecurity('x-api-key')
@ApiTags('Indexer')
@Controller('anime')
export class AnilistIndexerController {
  constructor(private readonly indexer: AnilistIndexerService) {}

  @Post('index')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Start the anime indexing process',
  })
  @ApiQuery({ name: 'delay', type: Number, required: false })
  @ApiQuery({ name: 'range', type: Number, required: false })
  index(
    @Query('delay') delay: number = 10,
    @Query('range') range: number = 25,
  ) {
    this.indexer
      .index(delay, range)
      .catch((err) => console.error('Indexer failed:', err)); // just in case it blows up

    return {
      status: 'Indexing started',
    };
  }

  @Post('index/stop')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Stop the anime indexing process',
  })
  stopIndex() {
    this.indexer.stop();
    return {
      status: 'Indexing stopped',
    };
  }
}
