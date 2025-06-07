import { Controller, Param, Post, NotFoundException } from '@nestjs/common';
import { ToolsService } from '../service/tools.service';
import { sleep } from '../../../utils/utils';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post('fix/update/:provider')
  fixUpdate(@Param('provider') provider: string) {
    (async () => {
      switch (provider.toLowerCase()) {
        case 'anilist':
          await this.toolsService.fixUpdatesForAnilist();
          break;
        case 'shikimori':
          await this.toolsService.fixUpdatesForShikimori();
          break;
        case 'kitsu':
          await this.toolsService.fixUpdatesForKitsu();
          break;
        case 'animepahe':
          await this.toolsService.fixUpdatesForAnimepahe();
          break;
        case 'animekai':
          await this.toolsService.fixUpdatesForAnimekai();
          break;
        case 'zoro':
        case 'aniwatch':
          await this.toolsService.fixUpdatesForZoro();
          break;
        case 'tmdb':
          await this.toolsService.fixUpdatesForTMDB();
          break;
        case 'tvdb':
          await this.toolsService.fixUpdatesForTVDB();
          break;
        case 'all':
          await this.fixAllUpdates();
          break;
        default:
          throw new NotFoundException(`Unknown provider: ${provider}`);
      }
    })().catch((err) => console.error(`Fixing failed ${provider}:`, err));

    return { status: 'started', provider };
  }

  async fixAllUpdates() {
    const queue = [
      () => this.toolsService.fixUpdatesForAnilist(),
      () => this.toolsService.fixUpdatesForShikimori(),
      () => this.toolsService.fixUpdatesForKitsu(),
      () => this.toolsService.fixUpdatesForAnimepahe(),
      () => this.toolsService.fixUpdatesForAnimekai(),
      () => this.toolsService.fixUpdatesForZoro(),
      () => this.toolsService.fixUpdatesForTMDB(),
      () => this.toolsService.fixUpdatesForTVDB(),
    ];

    for (const task of queue) {
      await task();
      await sleep(30, false);
    }
  }
}
