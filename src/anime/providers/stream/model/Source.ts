import { JsonValue } from '@prisma/client/runtime/library'

export interface Source {
  headers: JsonValue;
  intro: JsonValue;
  outro: JsonValue;
  sources: JsonValue;
  subtitles: JsonValue;
  download: JsonValue;
}

export interface IntroOutro {
  start: number;
  end: number;
}

export namespace Source {
  export interface Headers {
    referer: string;
  }

  export interface SourceInfo {
    url: string;
    isM3U8: boolean;
    type: string;
    quality: string;
    isDub: boolean;
  }

  export interface SubtitleInfo {
    url: string;
    lang: string;
  }
}