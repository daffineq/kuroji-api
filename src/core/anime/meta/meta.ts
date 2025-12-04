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

const fetchOrCreate = async <T extends Prisma.MetaDefaultArgs>(
  id: number,
  args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
): Promise<Prisma.MetaGetPayload<T>> => {
  const existing = await prisma.meta.findUnique({
    where: { id },
    ...(args as Prisma.MetaDefaultArgs)
  });

  if (existing) return existing as Prisma.MetaGetPayload<T>;

  await Anime.fetchOrCreate(id);
  return save(id, args);
};

const save = async <T extends Prisma.MetaDefaultArgs>(
  id: number,
  args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
): Promise<Prisma.MetaGetPayload<T>> =>
  prisma.meta.upsert({
    where: { id },
    update: MetaPrisma.getMeta(id),
    create: MetaPrisma.getMeta(id),
    ...(args as Prisma.MetaDefaultArgs)
  }) as unknown as Prisma.MetaGetPayload<T>;

const loadMappings = async (id: number) => {
  await fetchOrCreate(id);
  const fetched = await MetaFetch.fetchMappings(id).catch(() => null);
  const mappings = MetaUtils.toMappingsArray(fetched?.mappings);
  await addMappings(id, mappings);
};

const many = async <T extends Prisma.MetaFindManyArgs>(find?: T) => prisma.meta.findMany(find);

const first = async <T extends Prisma.MetaFindFirstArgs>(find?: T) => prisma.meta.findFirst(find);

const addMapping = async <T extends Prisma.MetaDefaultArgs>(
  id: number,
  entry: MappingEntry,
  args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addMappings([entry]),
    ...(args as Prisma.MetaDefaultArgs)
  }) as unknown as Prisma.MetaGetPayload<T>;
};

const addMappings = async <T extends Prisma.MetaDefaultArgs>(
  id: number,
  entries: MappingEntry[],
  args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addMappings(entries),
    ...(args as Prisma.MetaDefaultArgs)
  }) as unknown as Prisma.MetaGetPayload<T>;
};

const edit = async <T extends Prisma.MetaDefaultArgs>(
  id: number,
  oldEntry: MappingEntry,
  newEntry: MappingEntry,
  args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.editMappings(oldEntry, newEntry),
    ...(args as Prisma.MetaDefaultArgs)
  }) as unknown as Prisma.MetaGetPayload<T>;
};

const remove = async <T extends Prisma.MetaDefaultArgs>(
  id: number,
  entry: MappingEntry,
  args?: Prisma.SelectSubset<T, Prisma.MetaDefaultArgs>
) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.removeMappings(entry),
    ...(args as Prisma.MetaDefaultArgs)
  }) as unknown as Prisma.MetaGetPayload<T>;
};

const addFranchise = async (id: number, franchise: string, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { franchise },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addRating = async (id: number, rating: string, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { rating },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addEpisodesAired = async (id: number, episodes: number, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { episodes_aired: episodes },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addEpisodesTotal = async (id: number, episodes: number, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { episodes_total: episodes },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addMoreinfo = async (id: number, info: string, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { moreinfo: info },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addBroadcast = async (id: number, broadcast: string, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { broadcast },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const setNSFW = async (id: number, nsfw: boolean, args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: { nsfw },
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addTitles = async (id: number, titles: TitleEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addTitles(titles),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const removeTitles = async (id: number, titles: TitleEntry[], args?: any) =>
  prisma.meta.update({
    where: { id },
    data: MetaPrisma.removeTitles(titles),
    ...(args as Prisma.MetaDefaultArgs)
  });

const addDescriptions = async (id: number, descriptions: DescriptionEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addDescriptions(descriptions),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const removeDescriptions = async (id: number, descriptions: DescriptionEntry[], args?: any) =>
  prisma.meta.update({
    where: { id },
    data: MetaPrisma.removeDescriptions(descriptions),
    ...(args as Prisma.MetaDefaultArgs)
  });

const addImages = async (id: number, images: ImageEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addImages(images),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const removeImages = async (id: number, images: ImageEntry[], args?: any) =>
  prisma.meta.update({
    where: { id },
    data: MetaPrisma.removeImages(images),
    ...(args as Prisma.MetaDefaultArgs)
  });

const addVideos = async (id: number, videos: VideoEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addVideos(videos),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

// const removeVideos = async (id: number, videoUrls: string[], args?: any) =>
//   prisma.meta.update({
//     where: { id },
//     data: MetaPrisma.removeVideos(videoUrls),
//     ...(args as Prisma.MetaDefaultArgs)
//   });

const addScreenshots = async (id: number, screenshots: ScreenshotEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addScreenshots(screenshots),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const removeScreenshots = async (id: number, screenshotIds: string[], args?: any) =>
  prisma.meta.update({
    where: { id },
    data: MetaPrisma.removeScreenshots(screenshotIds),
    ...(args as Prisma.MetaDefaultArgs)
  });

const addArtworks = async (id: number, artworks: ArtworkEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addArtworks(artworks),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addChronologies = async (id: number, chronologies: ChronologyEntry[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addChronologies(chronologies),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const addEpisodes = async (id: number, episodes: SeasonEpisode[], args?: any) => {
  await fetchOrCreate(id);
  return prisma.meta.update({
    where: { id },
    data: MetaPrisma.addEpisodes(episodes),
    ...(args as Prisma.MetaDefaultArgs)
  });
};

const removeEpisodes = async (id: number, episodeIds: number[], args?: any) =>
  prisma.meta.update({
    where: { id },
    data: MetaPrisma.removeEpisodes(episodeIds),
    ...(args as Prisma.MetaDefaultArgs)
  });

const addSingleTitle = (id: number, title: TitleEntry, args?: any) => addTitles(id, [title], args);

const addSingleDescription = (id: number, desc: DescriptionEntry, args?: any) => addDescriptions(id, [desc], args);

const addSingleImage = (id: number, img: ImageEntry, args?: any) => addImages(id, [img], args);

const addSingleVideo = (id: number, video: VideoEntry, args?: any) => addVideos(id, [video], args);

const Meta = {
  fetchOrCreate,
  save,
  loadMappings,
  many,
  first,
  addMapping,
  addMappings,
  edit,
  remove,
  addFranchise,
  addRating,
  addEpisodesAired,
  addEpisodesTotal,
  addMoreinfo,
  addBroadcast,
  setNSFW,
  addTitles,
  removeTitles,
  addDescriptions,
  removeDescriptions,
  addImages,
  removeImages,
  addVideos,
  addScreenshots,
  removeScreenshots,
  addArtworks,
  addChronologies,
  addEpisodes,
  removeEpisodes,
  addSingleTitle,
  addSingleDescription,
  addSingleImage,
  addSingleVideo
};

export { Meta };
