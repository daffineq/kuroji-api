import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service.js';
import { sleep } from '../../../utils/utils.js';
import { IAnimeInfo } from '@consumet/extensions';
import { AnimekaiService } from '../../anime/animekai/service/animekai.service.js';
import { AnimepaheService } from '../../anime/animepahe/service/animepahe.service.js';
import { ZoroService } from '../../anime/zoro/service/zoro.service.js';

@Injectable()
export class ToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly animekaiService: AnimekaiService,
    private readonly animepaheService: AnimepaheService,
    private readonly zoroService: ZoroService,
  ) {}

  async updateAllAnimekai() {
    const entries = await this.prisma.animeKai.findMany({
      include: { episodes: true },
    });

    console.log(`Updating ${entries.length} Animekai entries...`);

    for (const entry of entries) {
      try {
        await this.animekaiService.save(entry as IAnimeInfo);
        console.log(`Updated Animekai ${entry.id}`);
      } catch (e) {
        console.error(`Failed to update Animekai ${entry.id}:`, e.message);
      }
      await sleep(0.1);
    }
  }

  async updateAllAnimepahe() {
    const entries = await this.prisma.animepahe.findMany({
      include: { episodes: true, externalLinks: true },
    });

    console.log(`Updating ${entries.length} Animepahe entries...`);

    for (const entry of entries) {
      try {
        await this.animepaheService.save(entry as IAnimeInfo);
        console.log(`Updated Animepahe ${entry.id}`);
      } catch (e) {
        console.error(`Failed to update Animepahe ${entry.id}:`, e.message);
      }
      await sleep(0.1);
    }
  }

  async updateAllZoro() {
    const entries = await this.prisma.zoro.findMany({
      include: { episodes: true },
    });

    console.log(`Updating ${entries.length} Zoro entries...`);

    for (const entry of entries) {
      try {
        await this.zoroService.save(entry as IAnimeInfo);
        console.log(`Updated Zoro ${entry.id}`);
      } catch (e) {
        console.error(`Failed to update Zoro ${entry.id}:`, e.message);
      }
      await sleep(0.1);
    }
  }
}
