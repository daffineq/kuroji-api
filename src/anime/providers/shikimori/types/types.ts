import {
  Shikimori,
  ShikimoriPoster,
  AiredOn,
  ReleasedOn,
  BasicIdShik,
  ShikimoriVideo,
  ShikimoriScreenshot,
} from '@prisma/client';

export interface ShikimoriWithRelations extends Shikimori {
  poster: ShikimoriPoster;
  airedOn: AiredOn;
  releasedOn: ReleasedOn;
  chronology: BasicIdShik[];
  videos: ShikimoriVideo[];
  screenshots: ShikimoriScreenshot[];
}
