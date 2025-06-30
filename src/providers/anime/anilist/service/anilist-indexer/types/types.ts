import { PageInfo } from '../../../../../../shared/ApiResponse.js';

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
