import { Prisma, TvdbLogin } from '@prisma/client';

const getTvdbLogin = (tvdb: TvdbLogin): Prisma.TvdbLoginCreateInput => {
  return {
    token: tvdb.token,
    createDate: tvdb.createDate ?? new Date(),
    expired: tvdb.expired ?? false
  };
};

const TvdbPrisma = {
  getTvdbLogin
};

export { TvdbPrisma };
