import { Module } from 'src/helpers/module';
import { Prisma, TvdbLogin } from 'src/lib/prisma';

class TvdbPrismaModule extends Module {
  override readonly name = 'TvdbPrisma';

  getTvdbLogin(tvdb: TvdbLogin): Prisma.TvdbLoginCreateInput {
    return {
      token: tvdb.token,
      created_at: tvdb.created_at ?? new Date(),
      expired: tvdb.expired ?? false
    };
  }
}

const TvdbPrisma = new TvdbPrismaModule();

export { TvdbPrisma, TvdbPrismaModule };
