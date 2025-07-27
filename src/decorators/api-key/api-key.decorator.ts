import { SetMetadata } from '@nestjs/common';
import { ApiKeyType } from '@prisma/client';

export const API_KEY_TYPE = ApiKeyType.FULL;
export const RequireApiKeyType = (type: ApiKeyType) =>
  SetMetadata(API_KEY_TYPE, type);
