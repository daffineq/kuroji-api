import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service';

@Injectable()
export class MalService {
  constructor(private readonly prisma: PrismaService) {}
}
