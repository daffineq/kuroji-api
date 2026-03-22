export interface MyAnimeListInfo {
  image: string | undefined;
  broadcast: string;
  moreInfo: string;
  videos: MyAnimeListVideo[];
}

export interface MyAnimeListVideo {
  title: string;
  url: string;
  thumbnail: string | null;
  artist?: string | null;
  type: 'trailer' | 'music';
}
