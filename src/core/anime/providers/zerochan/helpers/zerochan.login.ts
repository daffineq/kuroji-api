import { Config } from 'src/config/config';
import logger from 'src/helpers/logger';
import { KurojiClient } from 'src/lib/http';
import { ClientModule } from 'src/helpers/client';
import { db, zerochanLogin } from 'src/db';
import { count, eq } from 'drizzle-orm';
import puppeteer from 'puppeteer';

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
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    await page.goto(`${Config.zerochan}/login`);

    await page.type('input[name="name"]', `${Config.zerochan_user}`);
    await page.type('input[name="password"]', `${Config.zerochan_password}`);

    await Promise.all([page.click('input[name="login"]'), page.waitForNavigation()]);

    const cookies = await browser.cookies();
    const z_id = cookies.find((c) => c.name === 'z_id')?.value;
    const z_hash = cookies.find((c) => c.name === 'z_hash')?.value;
    const xbotcheck = cookies.find((c) => c.name === 'xbotcheck')?.value;

    if (!z_id || !z_hash || !xbotcheck) {
      throw new Error('No login found');
    }

    logger.log(`Zerochan login: z_id=${z_id}; z_hash=${z_hash}; xbotcheck=${xbotcheck}`);

    await db.insert(zerochanLogin).values({
      z_id,
      z_hash,
      xbotcheck
    });
  }
}

const ZerochanLogin = new ZerochanLoginModule();

export { ZerochanLogin, ZerochanLoginModule };
