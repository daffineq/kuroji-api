import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AnilistIndexerService } from './anilist-indexer.service.js';
import { SecretKeyGuard } from '../../../../../shared/secret-key.guard.js';

@Controller('anime')
export class AnilistIndexerController {
  constructor(private readonly indexer: AnilistIndexerService) {}

  @Post('index')
  @UseGuards(SecretKeyGuard)
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
  @UseGuards(SecretKeyGuard)
  stopIndex() {
    this.indexer.stop();
    return {
      status: 'Indexing stopped',
    };
  }
}
