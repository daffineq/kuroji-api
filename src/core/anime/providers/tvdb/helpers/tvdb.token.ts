import env from 'src/config/env';
import { prisma, TvdbLogin } from 'src/lib/prisma';
import { LoginResponse } from '../types';
import logger from 'src/helpers/logger';
import { KurojiClient } from 'src/lib/http';
import { TvdbPrisma } from './tvdb.prisma';

const client = new KurojiClient(env.TVDB);

const getToken = async (): Promise<string> => {
  await check();

  const login = await prisma.tvdbLogin.findFirst({
    where: { expired: false },
    orderBy: { created_at: 'desc' }
  });

  if (!login) {
    throw new Error('No token available');
  }

  return login.token;
};

const check = async (): Promise<void> => {
  const count = await prisma.tvdbLogin.count();
  if (count === 0) {
    logger.log('No tokens found');
    await createToken();
    return;
  }

  const login = await prisma.tvdbLogin.findFirst({
    where: { expired: false },
    orderBy: { created_at: 'desc' }
  });

  if (login) {
    const expiryDate = new Date(login.created_at);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    if (new Date() > expiryDate) {
      await prisma.tvdbLogin.update({
        where: { id: login.id },
        data: { expired: true }
      });
      logger.log('Token expired');
      await createToken();
    }
  } else {
    await createToken();
  }
};

const createToken = async (): Promise<void> => {
  const { data, error } = await client.post<LoginResponse>('login', {
    json: {
      apikey: env.TVDB_API_KEY ?? getRandomKey()
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

  const tokenData = TvdbPrisma.getTvdbLogin({
    token,
    created_at: new Date(),
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
};

const getRandomKey = () => {
  const keys = [
    'f5744a13-9203-4d02-b951-fbd7352c1657',
    '8f406bec-6ddb-45e7-8f4b-e1861e10f1bb',
    '5476e702-85aa-45fd-a8da-e74df3840baf',
    '51020266-18f7-4382-81fc-75a4014fa59f'
  ];

  return keys[Math.floor(Math.random() * keys.length)];
};

const TvdbToken = {
  getToken,
  check,
  getRandomKey
};

export { TvdbToken };
