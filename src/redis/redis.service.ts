import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: RedisClientType;

  constructor(private configService: ConfigService) {}

  async connectToRedis() {
    try {
      const redisHost = this.configService.get<string>('REDIS.HOST');
      const redisPort = this.configService.get<number>('REDIS.PORT');
      const redisConfig = {
        host: redisHost,
        port: redisPort,
      };
      const tls = process.env.NODE_ENV === 'preprod' || process.env.NODE_ENV === 'prod' ? true : false;

      if (tls) {
        redisConfig['tls'] = true;
      }

      this.redisClient = createClient({
        socket: redisConfig,
      });

      await this.redisClient.connect();

      this.redisClient.on('ready', () => {
        this.logger.debug('Redis client connected to server.');
      });

      this.redisClient.on('connect', () => {
        this.logger.debug('Redis client connected.');
      });

      this.redisClient.on('error', (err) => {
        this.logger.error(`Redis error: ${err}`);
      });
      this.logger.debug('Connection to redis successfully!');
    } catch (error) {
      this.logger.error('Redis ERROR.', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.logger.warn('Redis client disconnected.');
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<string | null > {
    try {
      if (ttl) {
        return await this.redisClient.set(key, value, { EX: ttl });
      }
      return await this.redisClient.set(key, value);
    } catch (error) {
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return await this.redisClient.exists(key) === 1;
    } catch (error) {
      throw error;
    }
  }
}
