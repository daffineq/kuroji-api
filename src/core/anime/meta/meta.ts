import { prisma, Prisma } from 'src/lib/prisma';
import { SeasonEpisode } from '../providers/tmdb/types';
import {
  ArtworkEntry,
  ChronologyEntry,
  DescriptionEntry,
  ImageEntry,
  MappingEntry,
  ScreenshotEntry,
  TitleEntry,
  VideoEntry
} from './helpers/meta.dto';
import { MetaPrisma, MetaFetch, MetaUtils } from './helpers';
import { Anime } from '../anime';
import { Module } from 'src/helpers/module';

class MetaModule extends Module {
  override readonly name = 'Meta';

  async fetchOrCreate<T extends Prisma.MetaDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    const existing = await prisma.meta.findUnique({
      where: { id },
      ...(args as Prisma.MetaDefaultArgs)
    });

    if (existing) return existing as Prisma.MetaGetPayload<T>;

    await Anime.fetchOrCreate(id);
    return this.save(id, args);
  }

  async save<T extends Prisma.MetaDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.upsert({
      where: { id },
      update: MetaPrisma.getMeta(id),
      create: MetaPrisma.getMeta(id),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async loadMappings(id: number) {
    await this.fetchOrCreate(id);
    const fetched = await MetaFetch.fetchMappings(id).catch(() => null);
    const mappings = MetaUtils.toMappingsArray(fetched?.mappings);
    await this.addMappings(id, mappings);
  }

  async addMappings(id: number, entries: MappingEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addMappings(entries)
    });
  }

  async addFranchise(id: number, franchise: string) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { franchise }
    });
  }

  async addRating(id: number, rating: string) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { rating }
    });
  }

  async addEpisodesAired(id: number, episodes: number) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { episodes_aired: episodes }
    });
  }

  async addEpisodesTotal(id: number, episodes: number) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { episodes_total: episodes }
    });
  }

  async addMoreinfo(id: number, info: string) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { moreinfo: info }
    });
  }

  async addBroadcast(id: number, broadcast: string) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { broadcast }
    });
  }

  async setNSFW(id: number, nsfw: boolean) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: { nsfw }
    });
  }

  async addTitles(id: number, titles: TitleEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addTitles(titles)
    });
  }

  async addDescriptions(id: number, descriptions: DescriptionEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addDescriptions(descriptions)
    });
  }

  async addImages(id: number, images: ImageEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addImages(images)
    });
  }

  async addVideos(id: number, videos: VideoEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addVideos(videos)
    });
  }

  async addScreenshots(id: number, screenshots: ScreenshotEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addScreenshots(screenshots)
    });
  }

  async addArtworks(id: number, artworks: ArtworkEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addArtworks(artworks)
    });
  }

  async addChronologies(id: number, chronologies: ChronologyEntry[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addChronologies(chronologies)
    });
  }

  async addEpisodes(id: number, episodes: SeasonEpisode[]) {
    await this.fetchOrCreate(id);
    return prisma.meta.update({
      where: { id },
      data: MetaPrisma.addEpisodes(episodes)
    });
  }

  async addSingleMapping(id: number, entry: MappingEntry) {
    return this.addMappings(id, [entry]);
  }

  async addSingleTitle(id: number, title: TitleEntry) {
    return this.addTitles(id, [title]);
  }

  async addSingleDescription(id: number, desc: DescriptionEntry) {
    return this.addDescriptions(id, [desc]);
  }

  async addSingleImage(id: number, img: ImageEntry) {
    return this.addImages(id, [img]);
  }

  async addSingleVideo(id: number, video: VideoEntry) {
    return this.addVideos(id, [video]);
  }
}

const Meta = new MetaModule();

export { Meta, MetaModule };
