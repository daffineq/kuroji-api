import { Anime } from './anime';

export type AnimeBasicData = Awaited<ReturnType<typeof Anime.getBasicInfo>>;
