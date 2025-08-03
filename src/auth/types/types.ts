import { Prisma, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthRequest {
  user: { userId: string; email: string; role: string };
}

export interface Login {
  email: string;
  password: string;
}

export interface GiveRole {
  userId: string;
  role: UserRole;
}

export const apiKeyUsageSelect = {
  id: true,
  endpoint: true,
  method: true,
  origin: true,
  userAgent: true,
  ip: true,
} satisfies Prisma.ApiKeyUsageSelect;

export const apiKeySelect = {
  id: true,
  key: true,
  type: true,
  whatFor: true,
  active: true,
} satisfies Prisma.ApiKeySelect;

export const fullApiKeySelect = {
  id: true,
  key: true,
  type: true,
  whatFor: true,
  active: true,
  usage: {
    select: apiKeyUsageSelect,
    orderBy: { usedAt: 'desc' },
  },
} satisfies Prisma.ApiKeySelect;

export const apiKeyRequestSelect = {
  id: true,
  type: true,
  whatFor: true,
  status: true,
  reason: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
} satisfies Prisma.ApiKeyRequestSelect;

export const basicApiKeyRequestSelect = {
  id: true,
  type: true,
  whatFor: true,
  status: true,
} satisfies Prisma.ApiKeyRequestSelect;

export const apiKeyRequestCreate = {
  type: true,
  whatFor: true,
} satisfies Prisma.ApiKeyRequestSelect;

export const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  apiKeys: {
    select: apiKeySelect,
  },
  apiKeyRequests: {
    select: basicApiKeyRequestSelect,
  },
} satisfies Prisma.UserSelect;

export const createUserSelect = {
  password: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

export type UserPayload = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export type ApiKeyRequestPayload = Prisma.ApiKeyRequestGetPayload<{
  select: typeof apiKeyRequestSelect;
}>;

export type CreateUserPayload = Prisma.UserGetPayload<{
  select: typeof createUserSelect;
}>;

export type CreateApiKeyRequestPayload = Prisma.ApiKeyRequestGetPayload<{
  select: typeof apiKeyRequestCreate;
}>;
