import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import {
  apiKeyRequestSelect,
  CreateApiKeyRequestPayload,
} from '../types/types.js';
import { getRequestData } from '../utils/auth-helper.js';
import { generateApiKey } from '../utils/utils.js';
import { ApiKeyRequestStatus } from '@prisma/client';
import { createSuccessResponse } from '../../shared/responses.js';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(request: CreateApiKeyRequestPayload, userId: string) {
    return this.prisma.apiKeyRequest.create({
      data: getRequestData(request, userId),
      select: apiKeyRequestSelect,
    });
  }

  async listRequests() {
    return this.prisma.apiKeyRequest.findMany({
      orderBy: { createdAt: 'desc' },
      select: apiKeyRequestSelect,
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
