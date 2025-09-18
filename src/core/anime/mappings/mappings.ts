import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import {
  TitleEntry,
  PosterEntry,
  BannerEntry,
  ScreenshotEntry,
  ArtworkEntry,
  MappingEntry
} from './helpers/mappings.dto';
import mappingsFetch from './helpers/mappings.fetch';
import { toMappingsArray } from './helpers/mappings.utils';
import { SeasonEpisode } from '../tmdb/types';
import {
  getMappingsPrismaData,
  addMappingsPrismaData,
  editMappingsPrismaData,
  removeMappingsPrismaData,
  addOrUpdateEpisodes,
  addOrUpdateTitles,
  removeTitles,
  addOrUpdatePosters,
  removePosters,
  addOrUpdateBanners,
  removeBanners,
  addOrUpdateVideos,
  removeVideos,
  addOrUpdateScreenshots,
  removeScreenshots,
  addOrUpdateArtworks,
  removeArtworks,
  removeEpisodes,
  bulkUpdate
} from './helpers/mappings.prisma';
import { MVideo } from '../mal/types';
import anilist from '../anilist/anilist';

class Mappings {
  async getMappings<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    const existing = await prisma.mappings.findUnique({
      where: { id },
      ...(args as Prisma.MappingsDefaultArgs)
    });

    if (existing) {
      return existing as Prisma.MappingsGetPayload<T>;
    }

    await anilist.getInfo(id);

    const fetched = await mappingsFetch.fetchMappings(id).catch(() => null);
    const mappings = toMappingsArray(fetched?.mappings);

    return this.save(id, mappings, args);
  }

  async findMany<T extends Prisma.MappingsFindManyArgs>(find?: T) {
    return prisma.mappings.findMany(find);
  }

  async findFirst<T extends Prisma.MappingsFindFirstArgs>(find?: T) {
    return prisma.mappings.findFirst(find);
  }

  async save<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    data: Array<MappingEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.upsert({
      where: { id },
      update: getMappingsPrismaData(id, data),
      create: getMappingsPrismaData(id, data),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async add<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    entry: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addMappingsPrismaData(entry),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async edit<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    old: MappingEntry,
    updated: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: editMappingsPrismaData(old, updated),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async remove<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    entry: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: removeMappingsPrismaData(entry),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async addOrUpdateEpisodes<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    episodes: Array<SeasonEpisode>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateEpisodes(episodes),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Title operations
  async addTitles<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    titles: Array<TitleEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateTitles(titles),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeTitles<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    titles: Array<TitleEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeTitles(titles),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Poster operations
  async addPosters<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    posters: Array<PosterEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdatePosters(posters),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removePosters<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    posters: Array<Pick<PosterEntry, 'url' | 'source'>>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removePosters(posters),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Banner operations
  async addBanners<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    banners: Array<BannerEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateBanners(banners),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeBanners<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    banners: Array<Pick<BannerEntry, 'url' | 'source'>>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeBanners(banners),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Video operations
  async addVideos<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    videos: Array<MVideo>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateVideos(videos),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeVideos<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    videoUrls: string[],
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeVideos(videoUrls),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Screenshot operations
  async addScreenshots<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    screenshots: Array<ScreenshotEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateScreenshots(screenshots),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeScreenshots<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    screenshotIds: string[],
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeScreenshots(screenshotIds),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Artwork operations
  async addArtworks<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    artworks: Array<ArtworkEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateArtworks(artworks),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeArtworks<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    artworkIds: number[],
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeArtworks(artworkIds),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Episode operations
  async addEpisodes<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    episodes: Array<SeasonEpisode>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: addOrUpdateEpisodes(episodes),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeEpisodes<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    episodeIds: number[],
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeEpisodes(episodeIds),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Bulk operations
  async bulkUpdate<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    data: {
      titles?: Array<TitleEntry>;
      posters?: Array<PosterEntry>;
      banners?: Array<BannerEntry>;
      videos?: Array<MVideo>;
      screenshots?: Array<ScreenshotEntry>;
      artworks?: Array<ArtworkEntry>;
      episodes?: Array<SeasonEpisode>;
      mappings?: Array<MappingEntry>;
    },
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.getMappings(id);

    return prisma.mappings.update({
      where: { id },
      data: bulkUpdate(data),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Utility methods for common operations
  async addSingleTitle<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    title: TitleEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return this.addTitles(id, [title], args);
  }

  async addSinglePoster<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    poster: PosterEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return this.addPosters(id, [poster], args);
  }

  async addSingleBanner<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    banner: BannerEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return this.addBanners(id, [banner], args);
  }

  async addSingleVideo<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    video: MVideo,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return this.addVideos(id, [video], args);
  }
}

export default new Mappings();
