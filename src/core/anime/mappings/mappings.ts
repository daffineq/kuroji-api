import { Prisma } from '@prisma/client';
import prisma from 'src/lib/prisma';
import anilist from '../providers/anilist/anilist';
import mal from '../providers/mal/mal';
import { MVideo } from '../providers/mal/types';
import shikimori from '../providers/shikimori/shikimori';
import tmdbSeasons from '../providers/tmdb/helpers/tmdb.seasons';
import tmdb from '../providers/tmdb/tmdb';
import { SeasonEpisode } from '../providers/tmdb/types';
import tvdb from '../providers/tvdb/tvdb';
import {
  ArtworkEntry,
  BannerEntry,
  DescriptionEntry,
  MappingEntry,
  PosterEntry,
  ScreenshotEntry,
  TitleEntry
} from './helpers/mappings.dto';
import mappingsFetch from './helpers/mappings.fetch';
import {
  addArtworks,
  addBanners,
  addDescriptions,
  addEpisodes,
  addMappingsPrismaData,
  addPosters,
  addScreenshots,
  addTitles,
  addVideos,
  bulkUpdate,
  editMappingsPrismaData,
  getMappingsPrismaData,
  removeArtworks,
  removeBanners,
  removeDescriptions,
  removeEpisodes,
  removeMappingsPrismaData,
  removePosters,
  removeScreenshots,
  removeTitles,
  removeVideos
} from './helpers/mappings.prisma';
import { toMappingsArray } from './helpers/mappings.utils';

class Mappings {
  async initOrGet<T extends Prisma.MappingsDefaultArgs>(
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

    return this.save(id, args);
  }

  async loadMappings(id: number) {
    const fetched = await mappingsFetch.fetchMappings(id).catch(() => null);
    const mappings = toMappingsArray(fetched?.mappings);

    await this.addMappings(id, mappings);

    await Promise.all([
      mal.getInfo(id).catch(() => null),
      shikimori.getInfo(id).catch(() => null),
      tmdb.getInfo(id).catch(() => null),
      tvdb.getInfo(id).catch(() => null)
    ]);

    await tmdbSeasons.getSeason(id).catch(() => null);
  }

  async many<T extends Prisma.MappingsFindManyArgs>(find?: T) {
    return prisma.mappings.findMany(find);
  }

  async first<T extends Prisma.MappingsFindFirstArgs>(find?: T) {
    return prisma.mappings.findFirst(find);
  }

  async save<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.upsert({
      where: { id },
      update: getMappingsPrismaData(id),
      create: getMappingsPrismaData(id),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async addMapping<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    entry: MappingEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addMappingsPrismaData([entry]),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async addMappings<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    entry: Array<MappingEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

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
    await this.initOrGet(id);

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
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: removeMappingsPrismaData(entry),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async addFranchise<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    franchise: string,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: {
        franchise: franchise
      },
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async addRating<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    rating: string,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: {
        rating: rating
      },
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Title operations
  async addTitles<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    titles: Array<TitleEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addTitles(titles),
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

  // Description operations
  async addDescriptions<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    descriptions: Array<DescriptionEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addDescriptions(descriptions),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  async removeDescriptions<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    descriptions: Array<DescriptionEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return prisma.mappings.update({
      where: { id },
      data: removeDescriptions(descriptions),
      ...(args as Prisma.MappingsDefaultArgs)
    }) as unknown as Prisma.MappingsGetPayload<T>;
  }

  // Poster operations
  async addPosters<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    posters: Array<PosterEntry>,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addPosters(posters),
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
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addBanners(banners),
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
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addVideos(videos),
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
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addScreenshots(screenshots),
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
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addArtworks(artworks),
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
    await this.initOrGet(id);

    return prisma.mappings.update({
      where: { id },
      data: addEpisodes(episodes),
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
    await this.initOrGet(id);

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

  async addSingleDescription<T extends Prisma.MappingsDefaultArgs>(
    id: number,
    description: DescriptionEntry,
    args?: Prisma.SelectSubset<T, Prisma.MappingsDefaultArgs>
  ): Promise<Prisma.MappingsGetPayload<T>> {
    return this.addDescriptions(id, [description], args);
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

const mappings = new Mappings();

export default mappings;
