import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import {
  ApiKeyRequestPayload,
  apiKeyRequestSelect,
  CreateApiKeyRequestPayload,
  fullApiKeySelect,
} from '../types/types.js';
import { getRequestData } from '../utils/auth-helper.js';
import { generateApiKey } from '../utils/utils.js';
import { ApiKeyRequestStatus } from '@prisma/client';
import {
  ApiResponse,
  createResponse,
  createSuccessResponse,
} from '../../shared/responses.js';
import { getPageInfo } from '../../utils/utils.js';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async getApiKey(id: string) {
    return this.prisma.apiKey.findUnique({
      where: { id },
      select: fullApiKeySelect,
    });
  }

  async createRequest(request: CreateApiKeyRequestPayload, userId: string) {
    return this.prisma.apiKeyRequest.create({
      data: getRequestData(request, userId),
      select: apiKeyRequestSelect,
    });
  }

  async listRequests(
    page: number,
    perPage: number,
  ): Promise<ApiResponse<Array<ApiKeyRequestPayload>>> {
    const [requests, total] = await Promise.all([
      this.prisma.apiKeyRequest.findMany({
        orderBy: { createdAt: 'desc' },
        select: apiKeyRequestSelect,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.apiKeyRequest.count(),
    ]);

    return createResponse({
      data: requests,
      pageInfo: getPageInfo(total, perPage, page),
    });
  }

  async approveRequest(requestId: string) {
    const req = await this.prisma.apiKeyRequest.findUnique({
      where: { id: requestId },
    });

    if (!req) throw new NotFoundException('Request not found');

    await this.prisma.$transaction([
      this.prisma.apiKeyRequest.update({
        where: { id: requestId },
        data: {
          status: ApiKeyRequestStatus.APPROVED,
          reason: 'Approved by admin',
        },
      }),
      this.prisma.apiKey.create({
        data: {
          userId: req.userId,
          type: req.type,
          whatFor: req.whatFor,
          key: generateApiKey(),
        },
      }),
    ]);

    return createSuccessResponse('Approved request');
  }

  async declineRequest(requestId: string, reason = 'Not specified') {
    await this.prisma.apiKeyRequest.update({
      where: { id: requestId },
      data: {
        status: ApiKeyRequestStatus.DECLINED,
        reason,
      },
    });

    return createSuccessResponse('Declined request');
  }
}
