import { Controller, Param, Post, NotFoundException } from '@nestjs/common';
import { ToolsService } from '../service/tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  // @Post('update-local/:provider')
  // updateLocal(@Param('provider') provider: string) {
  //   (async () => {
  //     switch (provider.toLowerCase()) {
  //       case 'animekai':
  //         await this.toolsService.updateAllAnimekai();
  //         break;
  //       case 'animepahe':
  //         await this.toolsService.updateAllAnimepahe();
  //         break;
  //       case 'zoro':
  //       case 'aniwatch':
  //         await this.toolsService.updateAllZoro();
  //         break;
  //       case 'all':
  //         await this.updateAllLocal();
  //         break;
  //       default:
  //         throw new NotFoundException(`Unknown provider: ${provider}`);
  //     }
  //   })().catch((err) => console.error(`Update failed for ${provider}:`, err));

  //   return { status: 'started', provider };
  // }

  // private async updateAllLocal() {
  //   await this.toolsService.updateAllAnimekai();
  //   await this.toolsService.updateAllAnimepahe();
  //   await this.toolsService.updateAllZoro();
  // }
}
