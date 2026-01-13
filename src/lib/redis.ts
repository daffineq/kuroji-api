import Redis from 'ioredis';
import { Config } from 'src/config/config';

const redis = new Redis(Config.redis_url);

export default redis;
