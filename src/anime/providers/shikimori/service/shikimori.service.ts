import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  AiredOn,
  BasicIdShik,
  ReleasedOn,
  Shikimori,
  ShikimoriPoster,
  ShikimoriScreenshot,
  ShikimoriVideo,
} from '@prisma/client'
import { PrismaService } from '../../../../prisma.service'
import { UpdateType } from '../../../../shared/UpdateType'
import { UrlConfig } from '../../../../configs/url.config'
import { CustomHttpService } from '../../../../http/http.service'
import { GraphQL } from '../graphql/shikimori.graphql'
import { getShikimoriInclude, ShikimoriHelper, shikimoriToBasicId } from '../utils/shikimori-helper'
import Dimens from '../../../../configs/Dimens'
import { getUpdateData } from '../../../../update/update.util'

export interface ShikimoriWithRelations extends Shikimori {
  poster: ShikimoriPoster
  airedOn: AiredOn
  releasedOn: ReleasedOn
  videos: ShikimoriVideo[]
  screenshots: ShikimoriScreenshot[]
}

@Injectable()
export class ShikimoriService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: CustomHttpService,
    private readonly helper: ShikimoriHelper,
  ) { }

  async getShikimori(id: string): Promise<ShikimoriWithRelations> {
    if (!id || id == '') {
      throw new Error('Shikimori id is empty')
    }

    const existing = await this.findById(id)
    if (existing) return this.adjustScreenshots(existing)

    const { animes } = await this.fetchFromGraphQL(id);
    const anime = animes[0]
    if (!anime) throw new NotFoundException(`No Shikimori data found for ID: ${id}`);

    await this.saveShikimori(anime as ShikimoriWithRelations)
    const saved = await this.findById(id)
    return this.adjustScreenshots(saved!)
  }

  async getChronology(id: string): Promise<BasicIdShik[]> {
    const shikimori = await this.prisma.shikimori.findUnique({
      where: { id },
      include: { chronology: true },
    })

    if (!shikimori) throw new NotFoundException(`Shikimori not found for ID: ${id}`)
    return shikimori.chronology as BasicIdShik[]
  }

  async saveShikimori(anime: ShikimoriWithRelations): Promise<ShikimoriWithRelations> {
    await this.prisma.lastUpdated.upsert({
      where: { entityId: String(anime.id) },
      create: getUpdateData(String(anime.id), anime.malId ?? 0, UpdateType.SHIKIMORI),
      update: getUpdateData(String(anime.id), anime.malId ?? 0, UpdateType.SHIKIMORI),
    });

    await this.prisma.shikimori.upsert({
      where: { id: anime.id },
      update: this.helper.getDataForPrisma(anime),
      create: this.helper.getDataForPrisma(anime),
    })

    return (await this.findById(anime.id))!
  }

  async update(id: string): Promise<ShikimoriWithRelations> {
    const { animes } = await this.fetchFromGraphQL(id);
    const anime = animes[0]
    if (!anime) throw new NotFoundException(`Shikimori not found for ID: ${id}`)

    const existing = await this.prisma.shikimori.findUnique({ where: { id } })
    if (JSON.stringify(anime) === JSON.stringify(existing)) {
      return anime as ShikimoriWithRelations
    }

    return this.saveShikimori(anime as ShikimoriWithRelations)
  }

  async getFranchise(franchise: string): Promise<Shikimori[]> {
    return this.prisma.shikimori.findMany({ where: { franchise } })
  }

  async getFranchiseIds(franchise: string): Promise<BasicIdShik[]> {
    const items = await this.getFranchise(franchise)
    return items.map((item) => shikimoriToBasicId(item))
  }

  private async fetchFromGraphQL(id: string, page = 1, perPage = 1) {
    return this.http.getGraphQL(UrlConfig.SHIKIMORI_GRAPHQL, GraphQL.getShikimoriAnime(id, page, perPage)) as Promise<{ animes: Shikimori[] }>
  }

  private async findById(id: string): Promise<ShikimoriWithRelations | null> {
    return this.prisma.shikimori.findUnique({
      where: { id },
      include: getShikimoriInclude()
    }) as Promise<ShikimoriWithRelations | null>
  }

  private adjustScreenshots(anime: ShikimoriWithRelations): ShikimoriWithRelations {
    if (anime.screenshots?.length > Dimens.SCREENSHOTS) {
      anime.screenshots = anime.screenshots.slice(0, Dimens.SCREENSHOTS)
    }
    return anime
  }
}