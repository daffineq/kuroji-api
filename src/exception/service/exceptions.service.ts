import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Exception } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiResponse, PageInfo } from '../../shared/ApiResponse';
import { ExceptionFilterDto } from '../model/ExceptionFilterDto';
import { getPageInfo } from '../../utils/utils';

@Injectable()
export class ExceptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExceptions(
    filter: ExceptionFilterDto,
  ): Promise<ApiResponse<Exception[]>> {
    const where: any = {};

    if (filter.statusCode) {
      where.statusCode = filter.statusCode;
    }

    if (filter.path) {
      where.path = { contains: filter.path, mode: 'insensitive' };
    }

    if (filter.message) {
      where.message = { contains: filter.message, mode: 'insensitive' };
    }

    if (filter.method) {
      where.method = { equals: filter.method, mode: 'insensitive' };
    }

    if (filter.fromDate || filter.toDate) {
      where.date = {};
      if (filter.fromDate) {
        where.date.gte = new Date(filter.fromDate);
      }
      if (filter.toDate) {
        where.date.lte = new Date(filter.toDate);
      }
    }

    const page = filter.page ?? 1;
    const perPage = filter.perPage ?? 10;

    const total = await this.prisma.exception.count({ where });

    const exceptions = await this.prisma.exception.findMany({
      where,
      skip: perPage * (page - 1),
      take: perPage,
      orderBy: {
        date: 'desc',
      },
    });

    const pageInfo: PageInfo = getPageInfo(total, perPage, page);
    return { pageInfo, data: exceptions };
  }

  async delete(id: number): Promise<Exception> {
    return await this.prisma.exception.delete({
      where: { id },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async check() {
    const exceptions = await this.prisma.exception.findMany({});

    const now: Date = new Date();

    for (const exception of exceptions) {
      const datePlusTime = new Date(
        exception.date.getFullYear(),
        exception.date.getMonth(),
        exception.date.getDate() + 3,
      );

      if (datePlusTime.getTime() < now.getTime()) {
        await this.prisma.exception.delete({
          where: exception,
        });
      }
    }
  }
}
