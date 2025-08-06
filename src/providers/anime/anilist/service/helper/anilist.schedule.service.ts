import { Injectable } from '@nestjs/common';
import { basicSelect } from '../../types/types.js';
import { AnilistSearchService } from './anilist.search.service.js';
import { FilterDto } from '../../filter/FilterDto.js';
import { Prisma } from '@prisma/client';
import { DateUtils } from '../../../../../shared/date.utils.js';
import { se } from 'date-fns/locale';

@Injectable()
export class AnilistScheduleService {
  constructor(private readonly search: AnilistSearchService) {}

  async getSchedule<T extends Prisma.AnilistSelect>(
    select: T,
  ): Promise<Array<Prisma.AnilistGetPayload<{ select: T }>>> {
    const { start, end } = DateUtils.getSpanRange({
      days: 14,
    });

    const releases = await this.search.getAnilists(
      new FilterDto({
        airingAtGreater: start,
        airingAtLesser: end,
      }),
      select,
      true,
    );

    return releases.data;
  }
}
