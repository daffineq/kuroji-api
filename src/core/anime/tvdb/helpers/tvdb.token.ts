import { TvdbLogin } from '@prisma/client';
import env from 'src/config/env';
import { Client } from 'src/helpers/client';
import { getTvdbLoginPrismaData } from './tvdb.prisma';
import prisma from 'src/lib/prisma';
import { LoginResponse } from '../types';

class TvdbToken extends Client {
  constructor() {
    super(env.TVDB);
  }

  async getToken(): Promise<string> {
    await this.check();

    const login = await prisma.tvdbLogin.findFirst({
      where: { expired: false },
      orderBy: { createDate: 'desc' }
    });

    if (!login) {
      throw new Error('No token available');
    }

    return login.token;
  }

  public async check(): Promise<void> {
    const count = await prisma.tvdbLogin.count();
    if (count === 0) {
      console.log('No tokens found');
      await this.createToken();
      return;
    }

    const login = await prisma.tvdbLogin.findFirst({
      where: { expired: false },
      orderBy: { createDate: 'desc' }
    });

    if (login) {
      const expiryDate = new Date(login.createDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      if (new Date() > expiryDate) {
        await prisma.tvdbLogin.update({
          where: { id: login.id },
          data: { expired: true }
        });
        console.log('Token expired');
        await this.createToken();
      } else {
        console.log(`Token valid until: ${expiryDate.toISOString()}`);
      }
    } else {
      await this.createToken();
    }
  }

  async createToken(): Promise<void> {
    const { data, error } = await this.client.post<LoginResponse>('login', {
      json: {
        apikey: env.TVDB_API ?? this.getRandomKey()
      }
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    const token = data.data.token;

    const tokenData = getTvdbLoginPrismaData({
      token,
      createDate: new Date(),
      expired: false
    } as TvdbLogin);

    const existingLogin = await prisma.tvdbLogin.findFirst({
      where: { token }
    });

    if (existingLogin) {
      await prisma.tvdbLogin.update({
        where: { id: existingLogin.id },
        data: tokenData
      });
    } else {
      await prisma.tvdbLogin.create({
        data: tokenData
      });
    }
  }

  private getRandomKey() {
    const keys = [
      'f5744a13-9203-4d02-b951-fbd7352c1657',
      '8f406bec-6ddb-45e7-8f4b-e1861e10f1bb',
      '5476e702-85aa-45fd-a8da-e74df3840baf',
      '51020266-18f7-4382-81fc-75a4014fa59f'
    ];

    return keys[Math.floor(Math.random() * keys.length)];
  }
}

export default new TvdbToken();
