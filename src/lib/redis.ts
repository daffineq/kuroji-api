import Redis from 'ioredis';
import { Config } from 'src/config/config';

let redis: Redis | null = null;

if (Config.caching_enabled && Config.redis_url) {
  redis = new Redis(Config.redis_url);
}

export default redis;
