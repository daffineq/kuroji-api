import { Injectable } from '@nestjs/common'
import { AnilistHelper } from '../../utils/anilist-helper'
import { AnilistWithRelations } from '../../model/AnilistModels'

@Injectable()
export class AnilistUtilService {
  constructor(
    private readonly helper: AnilistHelper
  ) {}
  
  async adjustAnilist(anilist: AnilistWithRelations): Promise<AnilistWithRelations> {
    return this.helper.reorderItems(anilist) as AnilistWithRelations;
  }
}