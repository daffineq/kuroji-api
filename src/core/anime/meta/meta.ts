import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import anilist from '../providers/anilist/anilist';
import { MVideo } from '../providers/mal/types';
import { SeasonEpisode } from '../providers/tmdb/types';
import {
  ArtworkEntry,
  DescriptionEntry,
  ImageEntry,
  MappingEntry,
  ScreenshotEntry,
  TitleEntry
} from './helpers/meta.dto';
import metaFetch from './helpers/meta.fetch';
import {
  addArtworks,
  addDescriptions,
  addEpisodes,
  addImages,
  addMappingsPrismaData,
  addScreenshots,
  addTitles,
  addVideos,
  editMappingsPrismaData,
  getMetaCreateData,
  removeDescriptions,
  removeEpisodes,
  removeImages,
  removeMappingsPrismaData,
  removeScreenshots,
  removeTitles,
  removeVideos
} from './helpers/meta.prisma';
import { toMappingsArray } from './helpers/meta.utils';

class Meta {
  async fetchOrCreate<T extends Prisma.MetaDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    const existing = await prisma.meta.findUnique({
      where: { id },
      ...(args as Prisma.MetaDefaultArgs)
    });

    if (existing) {
      return existing as Prisma.MetaGetPayload<T>;
    }

    await anilist.getInfo(id);

    return this.save(id, args);
  }

  async loadMappings(id: number) {
    await this.fetchOrCreate(id);

    const fetched = await metaFetch.fetchMappings(id).catch(() => null);
    const mappings = toMappingsArray(fetched?.mappings);

    await this.addMappings(id, mappings);
  }

  async many<T extends Prisma.MetaFindManyArgs>(find?: T) {
    return prisma.meta.findMany(find);
  }

  async first<T extends Prisma.MetaFindFirstArgs>(find?: T) {
    return prisma.meta.findFirst(find);
  }

  async save<T extends Prisma.MetaDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.upsert({
      where: { id },
      update: getMetaCreateData(id),
      create: getMetaCreateData(id),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async addMapping<T extends Prisma.MetaDefaultArgs>(
    id: number,
    entry: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addMappingsPrismaData([entry]),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async addMappings<T extends Prisma.MetaDefaultArgs>(
    id: number,
    entry: Array<MappingEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addMappingsPrismaData(entry),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async edit<T extends Prisma.MetaDefaultArgs>(
    id: number,
    old: MappingEntry,
    updated: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: editMappingsPrismaData(old, updated),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async remove<T extends Prisma.MetaDefaultArgs>(
    id: number,
    entry: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: removeMappingsPrismaData(entry),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async addFranchise<T extends Prisma.MetaDefaultArgs>(
    id: number,
    franchise: string,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: {
        franchise: franchise
      },
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async addRating<T extends Prisma.MetaDefaultArgs>(
    id: number,
    rating: string,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: {
        rating: rating
      },
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async addEpisodesAired<T extends Prisma.MetaDefaultArgs>(
    id: number,
    episodes: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: {
        episodesAired: episodes
      },
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async addEpisodesTotal<T extends Prisma.MetaDefaultArgs>(
    id: number,
    episodes: number,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: {
        episodesTotal: episodes
      },
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Title operations
  async addTitles<T extends Prisma.MetaDefaultArgs>(
    id: number,
    titles: Array<TitleEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addTitles(titles),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async removeTitles<T extends Prisma.MetaDefaultArgs>(
    id: number,
    titles: Array<TitleEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.update({
      where: { id },
      data: removeTitles(titles),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Description operations
  async addDescriptions<T extends Prisma.MetaDefaultArgs>(
    id: number,
    descriptions: Array<DescriptionEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addDescriptions(descriptions),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async removeDescriptions<T extends Prisma.MetaDefaultArgs>(
    id: number,
    descriptions: Array<DescriptionEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.update({
      where: { id },
      data: removeDescriptions(descriptions),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Poster operations
  async addImages<T extends Prisma.MetaDefaultArgs>(
    id: number,
    images: Array<ImageEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addImages(images),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async removeImages<T extends Prisma.MetaDefaultArgs>(
    id: number,
    images: Array<Pick<ImageEntry, 'url' | 'type' | 'source'>>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.update({
      where: { id },
      data: removeImages(images),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Video operations
  async addVideos<T extends Prisma.MetaDefaultArgs>(
    id: number,
    videos: Array<MVideo>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addVideos(videos),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async removeVideos<T extends Prisma.MetaDefaultArgs>(
    id: number,
    videoUrls: string[],
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.update({
      where: { id },
      data: removeVideos(videoUrls),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Screenshot operations
  async addScreenshots<T extends Prisma.MetaDefaultArgs>(
    id: number,
    screenshots: Array<ScreenshotEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addScreenshots(screenshots),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async removeScreenshots<T extends Prisma.MetaDefaultArgs>(
    id: number,
    screenshotIds: string[],
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.update({
      where: { id },
      data: removeScreenshots(screenshotIds),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Artwork operations
  async addArtworks<T extends Prisma.MetaDefaultArgs>(
    id: number,
    artworks: Array<ArtworkEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addArtworks(artworks),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // async removeArtworks<T extends Prisma.MetaDefaultArgs>(
  //   id: number,
  //   artworkIds: number[],
  //   args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  // ): Promise<Prisma.MetaGetPayload<T>> {
  //   return prisma.meta.update({
  //     where: { id },
  //     data: removeArtworks(artworkIds),
  //     ...(args as Prisma.MetaDefaultArgs)
  //   }) as unknown as Prisma.MetaGetPayload<T>;
  // }

  // Episode operations
  async addEpisodes<T extends Prisma.MetaDefaultArgs>(
    id: number,
    episodes: Array<SeasonEpisode>,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    await this.fetchOrCreate(id);

    return prisma.meta.update({
      where: { id },
      data: addEpisodes(episodes),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  async removeEpisodes<T extends Prisma.MetaDefaultArgs>(
    id: number,
    episodeIds: number[],
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return prisma.meta.update({
      where: { id },
      data: removeEpisodes(episodeIds),
      ...(args as Prisma.MetaDefaultArgs)
    }) as unknown as Prisma.MetaGetPayload<T>;
  }

  // Utility methods for common operations
  async addSingleTitle<T extends Prisma.MetaDefaultArgs>(
    id: number,
    title: TitleEntry,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return this.addTitles(id, [title], args);
  }

  async addSingleDescription<T extends Prisma.MetaDefaultArgs>(
    id: number,
    description: DescriptionEntry,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return this.addDescriptions(id, [description], args);
  }

  async addSingleImage<T extends Prisma.MetaDefaultArgs>(
    id: number,
    image: ImageEntry,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return this.addImages(id, [image], args);
  }

  async addSingleVideo<T extends Prisma.MetaDefaultArgs>(
    id: number,
    video: MVideo,
    args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
  ): Promise<Prisma.MetaGetPayload<T>> {
    return this.addVideos(id, [video], args);
  }
}

const meta = new Meta();

export default meta;
