import { UrlConfig } from './url.config.js';

export class Jikan {
  public static getFullInfo(id: number) {
    return `${UrlConfig.JIKAN}anime/${id}/full`;
  }

  public static getVideos(id: number) {
    return `${UrlConfig.JIKAN}anime/${id}/videos`;
  }

  public static getMoreInfo(id: number) {
    return `${UrlConfig.JIKAN}anime/${id}/moreinfo`;
  }
}

export interface PromoVideo {
  title: string;
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
    images: {
      image_url: string;
      small_image_url: string;
      medium_image_url: string;
      large_image_url: string;
      maximum_image_url: string;
    };
  };
}

export interface Episode {
  mal_id: number;
  url: string;
  title: string;
  episode: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export interface MusicVideo {
  title: string;
  video: {
    youtube_id: string;
    url: string;
    embed_url: string;
    images: {
      image_url: string;
      small_image_url: string;
      medium_image_url: string;
      large_image_url: string;
      maximum_image_url: string;
    };
  };
  meta: {
    title: string;
    author: string;
  };
}

export interface VideosData {
  promo: PromoVideo[];
  episodes: Episode[];
  music_videos: MusicVideo[];
}

export interface VideosResponse {
  data: VideosData;
}

export interface MoreInfoResponse {
  data: {
    moreinfo?: string;
  };
}
