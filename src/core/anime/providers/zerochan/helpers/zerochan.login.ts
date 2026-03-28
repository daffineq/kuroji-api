import { Config } from 'src/config/config';
import logger from 'src/helpers/logger';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';
import { db, zerochanLogin } from 'src/db';
import { count, eq } from 'drizzle-orm';

class ZerochanLoginModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.zerochan);

  async getLogin() {
    await this.check();

    const login = await db.query.zerochanLogin.findFirst({
      where: {
        expired: false
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!login) {
      throw new Error('No login available');
    }

    return login;
  }

  async check(): Promise<void> {
    const loginCount = (await db.select({ count: count() }).from(zerochanLogin))[0]?.count ?? 0;
    if (loginCount === 0) {
      logger.log('No logins found');
      await this.createLogin();
      return;
    }

    const login = await db.query.zerochanLogin.findFirst({
      where: {
        expired: false
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (login) {
      const expiryDate = new Date(login.created_at);
      expiryDate.setMonth(expiryDate.getMonth() + 2);
      if (new Date() > expiryDate) {
        await db
          .update(zerochanLogin)
          .set({
            expired: true
          })
          .where(eq(zerochanLogin.id, login.id));
        logger.log('login expired');
        await this.createLogin();
      }
    } else {
      await this.createLogin();
    }
  }

  async createLogin(): Promise<void> {
    const body = new URLSearchParams({
      name: Config.zerochan_user,
      password: Config.zerochan_password,
      login: 'Login'
    });

    const { response } = await this.client.post('login', {
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'manual'
    });

    const cookies = response?.headers.getSetCookie() ?? [];

    const getCookieValue = (name: string) => {
      const cookie = cookies.find((c) => c.startsWith(`${name}=`));
      if (!cookie) return null;
      return cookie.split(';')[0]?.split('=')[1];
    };

    const z_id = getCookieValue('z_id');
    const z_hash = getCookieValue('z_hash');

    if (!z_id || !z_hash) {
      throw new Error('No login found');
    }

    logger.log(`Zerochan login: z_id=${z_id}; z_hash=${z_hash};`);

    await db.insert(zerochanLogin).values({
      z_id,
      z_hash
    });
  }
}

const ZerochanLogin = new ZerochanLoginModule();

export { ZerochanLogin, ZerochanLoginModule };
