import { Config } from 'src/config/config';
import { LoginResponse } from '../types';
import logger from 'src/helpers/logger';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';
import { db, tvdbLogin } from 'src/db';
import { count, eq } from 'drizzle-orm';

class TvdbTokenModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.TVDB);

  async getToken(): Promise<string> {
    await this.check();

    const login = await db.query.tvdbLogin.findFirst({
      where: {
        expired: false
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!login) {
      throw new Error('No token available');
    }

    return login.token;
  }

  async check(): Promise<void> {
    const loginCount = (await db.select({ count: count() }).from(tvdbLogin))[0]?.count ?? 0;
    if (loginCount === 0) {
      logger.log('No tokens found');
      await this.createToken();
      return;
    }

    const login = await db.query.tvdbLogin.findFirst({
      where: {
        expired: false
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (login) {
      const expiryDate = new Date(login.created_at);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      if (new Date() > expiryDate) {
        await db
          .update(tvdbLogin)
          .set({
            expired: true
          })
          .where(eq(tvdbLogin.id, login.id));
        logger.log('Token expired');
        await this.createToken();
      }
    } else {
      await this.createToken();
    }
  }

  async createToken(): Promise<void> {
    const { data, error } = await this.client.post<LoginResponse>('login', {
      json: {
        apikey: Config.tvdb_api_key ?? this.getRandomKey()
      }
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    const token = data.data.token;

    logger.log(`TVDB token: ${token}`);

    await db.insert(tvdbLogin).values({
      token,
      created_at: new Date(),
      expired: false
    });
  }

  getRandomKey = () => {
    const keys = [
      'f5744a13-9203-4d02-b951-fbd7352c1657',
      '8f406bec-6ddb-45e7-8f4b-e1861e10f1bb',
      '5476e702-85aa-45fd-a8da-e74df3840baf',
      '51020266-18f7-4382-81fc-75a4014fa59f'
    ];

    return keys[Math.floor(Math.random() * keys.length)];
  };
}

const TvdbToken = new TvdbTokenModule();

export { TvdbToken, TvdbTokenModule };
