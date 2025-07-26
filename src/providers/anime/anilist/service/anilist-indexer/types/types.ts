import { PageInfo } from '../../../../../../shared/responses.js';

export interface Ids {
  sfw: number[];
  nsfw: number[];
}

export interface AnilistPageResponse {
  Page: {
    pageInfo: PageInfo;
    media: MediaItem[];
  };
}

export interface MediaItem {
  id: number;
}
