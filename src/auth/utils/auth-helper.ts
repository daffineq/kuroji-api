import bcrypt from 'bcrypt';
import {
  CreateApiKeyRequestPayload,
  CreateUserPayload,
} from '../types/types.js';
import { Prisma } from '@prisma/client';

export async function getUserData(
  data: CreateUserPayload,
): Promise<Prisma.UserCreateInput> {
  const hashed = await bcrypt.hash(data.password, 10);
  return {
    email: data.email,
    name: data.name,
    password: hashed,
  };
}

export function getRequestData(
  data: CreateApiKeyRequestPayload,
  userId: string,
): Prisma.ApiKeyRequestCreateInput {
  return {
    type: data.type,
    whatFor: data.whatFor,
    user: {
      connect: {
        id: userId,
      },
    },
  };
}

export async function comparePasswords(
  raw: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(raw, hashed);
}
