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
import { ShikimoriHelper } from '../utils/shikimori-helper'
import Dimens from '../../../../configs/Dimens'
import { AnilistService } from '../../anilist/service/anilist.service'
import { withRetry } from '../../../../shared/utils'

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

    const { animes } = await withRetry(() => this.fetchFromGraphQL(id));
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

  async saveMultipleShikimori(ids: string): Promise<ShikimoriWithRelations[]> {
    const idList = ids.split(',').map((id) => id.trim()).filter(Boolean)

    const existing = await this.prisma.shikimori.findMany({
      where: { id: { in: idList } },
      include: this.helper.getInclude(),
    }) as unknown as ShikimoriWithRelations[]

    const existingIds = existing.map((a) => a.id)
    const toFetch = idList.filter((id) => !existingIds.includes(id))

    if (!toFetch.length) return existing

    const { animes } = await withRetry(() => this.fetchFromGraphQL(toFetch.join(','), 1, toFetch.length));
    const newAnimes = animes.filter((a) => !existingIds.includes(a.id)) as ShikimoriWithRelations[]

    if (newAnimes.length) await this.saveShikimoris(newAnimes)

    return [
      ...existing,
      ...newAnimes.map(this.adjustScreenshots),
    ]
  }

  async saveShikimori(anime: ShikimoriWithRelations): Promise<ShikimoriWithRelations> {
    await this.prisma.lastUpdated.create({
      data: { 
        entityId: anime.id, 
        type: UpdateType.SHIKIMORI 
      },
    })

    await this.prisma.shikimori.upsert({
      where: { id: anime.id },
      update: this.helper.getDataForPrisma(anime),
      create: this.helper.getDataForPrisma(anime),
    })

    return (await this.findById(anime.id))!
  }

  async saveShikimoris(animes: ShikimoriWithRelations[]): Promise<void> {
    const updates = animes.map((a) => ({
      entityId: a.id,
      externalId: Number(a.malId),
      type: UpdateType.SHIKIMORI,
    }))

    await this.prisma.lastUpdated.createMany({ data: updates })

    for (const anime of animes) {
      await this.saveShikimori(anime)
    }
  }

  async update(id: string): Promise<ShikimoriWithRelations> {
    const { animes } = await withRetry(() => this.fetchFromGraphQL(id));
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
    return items.map((item) => this.helper.shikimoriToBasicId(item))
  }

  private async fetchFromGraphQL(id: string, page = 1, perPage = 1) {
    return this.http.getGraphQL(UrlConfig.SHIKIMORI_GRAPHQL, GraphQL.getShikimoriAnime(id, page, perPage)) as Promise<{ animes: Shikimori[] }>
  }

  private async findById(id: string): Promise<ShikimoriWithRelations | null> {
    return this.prisma.shikimori.findUnique({
      where: { id },
      include: this.helper.getInclude(),
    }) as Promise<ShikimoriWithRelations | null>
  }

  private adjustScreenshots(anime: ShikimoriWithRelations): ShikimoriWithRelations {
    if (anime.screenshots?.length > Dimens.SCREENSHOTS) {
      anime.screenshots = anime.screenshots.slice(0, Dimens.SCREENSHOTS)
    }
    return anime
  }
}