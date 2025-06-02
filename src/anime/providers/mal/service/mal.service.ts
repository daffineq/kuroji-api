import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';
import { CustomHttpService } from '../../../../http/http.service';

@Injectable()
export class MalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: CustomHttpService,
  ) {}
}
