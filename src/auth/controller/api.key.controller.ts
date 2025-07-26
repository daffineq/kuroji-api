import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiKeyService } from '../service/api.key.service.js';
import { JwtAuthGuard } from '../utils/jwt-auth.guard.js';
import { Roles, RolesGuard } from '../utils/roles.guard.js';
import { UserRole } from '@prisma/client';
import { AuthRequest, CreateApiKeyRequestPayload } from '../types/types.js';

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request')
  createRequest(
    @Req() req: AuthRequest,
    @Body() body: CreateApiKeyRequestPayload,
  ) {
    return this.apiKeyService.createRequest(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('requests')
  listRequests() {
    return this.apiKeyService.listRequests();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('requests/:id/approve')
  approve(@Param('id') id: string) {
    return this.apiKeyService.approveRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('requests/:id/decline')
  decline(@Param('id') id: string, @Body('reason') reason: string) {
    return this.apiKeyService.declineRequest(id, reason);
  }
}
