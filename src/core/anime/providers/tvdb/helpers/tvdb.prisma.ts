import { Prisma, TvdbLogin } from '@prisma/client';

export const getTvdbLoginPrismaData = (tvdb: TvdbLogin): Prisma.TvdbLoginCreateInput => {
  return {
    token: tvdb.token,
    createDate: tvdb.createDate ?? new Date(),
    expired: tvdb.expired ?? false
  };
};
