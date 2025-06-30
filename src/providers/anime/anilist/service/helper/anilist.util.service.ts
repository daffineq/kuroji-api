import { Injectable } from '@nestjs/common';
import { AnilistHelper, reorderAnilistItems } from '../../utils/anilist-helper.js';
import { AnilistWithRelations } from '../../types/types.js';

@Injectable()
export class AnilistUtilService {
  constructor(private readonly helper: AnilistHelper) {}

  async adjustAnilist(
    anilist: AnilistWithRelations,
  ): Promise<AnilistWithRelations> {
    return reorderAnilistItems(anilist) as AnilistWithRelations;
  }
}
