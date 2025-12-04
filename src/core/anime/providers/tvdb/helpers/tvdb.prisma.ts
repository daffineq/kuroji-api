import { Prisma, TvdbLogin } from 'src/lib/prisma';

const getTvdbLogin = (tvdb: TvdbLogin): Prisma.TvdbLoginCreateInput => {
  return {
    token: tvdb.token,
    created_at: tvdb.created_at ?? new Date(),
    expired: tvdb.expired ?? false
  };
};

const TvdbPrisma = {
  getTvdbLogin
};

export { TvdbPrisma };
