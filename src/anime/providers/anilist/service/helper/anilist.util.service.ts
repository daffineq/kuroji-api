import { Injectable } from '@nestjs/common'
import { Anilist } from '@prisma/client'
import { ShikimoriService } from '../../../shikimori/service/shikimori.service'
import { AnilistHelper } from '../../utils/anilist-helper'
import { AnilistWithRelations } from '../../model/AnilistModels'

@Injectable()
export class AnilistUtilService {
  constructor(
    private readonly shikimori: ShikimoriService,
    private readonly helper: AnilistHelper
  ) {}
  
  async adjustAnilist(anilist: Anilist): Promise<AnilistWithRelations> {
    const shikimori = await this.shikimori.getShikimori(
      anilist.idMal?.toString() || '',
    ).catch(() => null);
    
    const AnilistWithRelations = {
      ...anilist,
      shikimori: shikimori || [],
    };

    return this.helper.reorderItems(AnilistWithRelations) as AnilistWithRelations;
  }
}