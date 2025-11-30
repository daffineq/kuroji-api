import Redis from 'ioredis';
import env from 'src/config/env';

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD
});

export default redis;
