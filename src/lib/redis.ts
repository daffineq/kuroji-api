import Redis from 'ioredis';
import { Config } from 'src/config/config';

const redis = new Redis({
  host: Config.redis_host,
  port: Config.redis_port,
  username: Config.redis_username,
  password: Config.redis_password
});

export default redis;
