import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiKeyService } from '../service/api.key.service.js';
import { UserRole } from '@prisma/client';
import { AuthRequest, CreateApiKeyRequestPayload } from '../types/types.js';
import { JwtAuthGuard } from '../../decorators/auth/jwt-auth.guards.js';
import { Roles } from '../../decorators/auth/roles.decorator.js';
import { RolesGuard } from '../../decorators/auth/roles.guard.js';
import {
  ApiBody,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateApiKeyRequestPayloadDto,
  DeclineApiKeyRequestPayloadDto,
} from '../types/swagger-types.js';
import { RequireToken } from '../../decorators/auth/jwt-auth.decorator.js';
import Config from '../../configs/config.js';

@ApiTags('Api Keys')
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get('info/:id')
  @ApiOperation({ summary: 'Get information about an API key' })
  @ApiParam({ name: 'id', type: String, description: 'API key id' })
  getApiKey(@Param('id') id: string) {
    return this.apiKeyService.getApiKey(id);
  }

  @UseGuards(JwtAuthGuard)
  @RequireToken()
  @Post('request')
  @ApiOperation({ summary: 'Request an API key' })
  @ApiBody({ type: CreateApiKeyRequestPayloadDto, required: true })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token (e.g. `Bearer <your_token_here>`)',
      required: true,
    },
  ])
  createRequest(
    @Req() req: AuthRequest,
    @Body() body: CreateApiKeyRequestPayload,
  ) {
    return this.apiKeyService.createRequest(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('requests')
  @ApiOperation({ summary: 'List API key requests' })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  listRequests(
    @Query('perPage') perPage: number = Config.DEFAULT_PER_PAGE,
    @Query('page') page: number = Config.DEFAULT_PAGE,
  ) {
    return this.apiKeyService.listRequests(page, perPage);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('requests/:id/approve')
  @ApiOperation({ summary: 'Approve an API key request' })
  @ApiParam({ name: 'id', type: String, description: 'API key request id' })
  approve(@Param('id') id: string) {
    return this.apiKeyService.approveRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('requests/:id/decline')
  @ApiOperation({ summary: 'Decline an API key request' })
  @ApiParam({ name: 'id', type: String, description: 'API key request id' })
  @ApiBody({ type: DeclineApiKeyRequestPayloadDto, required: true })
  decline(@Param('id') id: string, @Body('reason') reason: string) {
    return this.apiKeyService.declineRequest(id, reason);
  }
}
