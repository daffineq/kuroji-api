import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { AnilistUtilService } from '../../anilist/service/helper/anilist.util.service.js';

@Injectable()
export class AnilibriaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistUtilService,
  ) {}
}
