import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: RedisClientType;

  constructor(private configService: ConfigService) {}

  /**
   * Connect to Redis server
   */
  async connectToRedis() {
    try {
      const redisHost = this.configService.get<string>('REDIS.HOST');
      const redisPort = this.configService.get<number>('REDIS.PORT');
      const redisConfig = {
        host: redisHost,
        port: redisPort,
      };
      
      // Check for environment-based TLS usage
      const tls = process.env['NODE_ENV'] === 'preprod' || process.env['NODE_ENV'] === 'prod' ? true : false;
      if (tls) {
        redisConfig['tls'] = { servername: redisHost }; // TLS configuration if in preprod or prod
      }

      // Create the Redis client
      this.redisClient = createClient({
        socket: redisConfig,
      });

      // Connect to Redis
      await this.redisClient.connect();

      // Set up event listeners
      this.redisClient.on('ready', () => {
        this.logger.debug('Redis client connected to server.');
      });

      this.redisClient.on('connect', () => {
        this.logger.debug('Redis client connected.');
      });

      this.redisClient.on('error', (err) => {
        this.logger.error(`Redis error: ${err}`);
      });

      this.logger.debug('Connection to Redis successful!');
    } catch (error) {
      this.logger.error('Redis connection error: ', error);
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.logger.warn('Redis client disconnected.');
    }
  }

  /**
   * Set a value in Redis with optional TTL
   * @param key - The key to set
   * @param value - The value to store
   * @param ttl - Optional time to live (TTL) in seconds
   */
  async set(key: string, value: string, ttl?: number): Promise<string> {
    try {
      const result = ttl
        ? await this.redisClient.set(key, value, { EX: ttl })
        : await this.redisClient.set(key, value);
  
      // Handle if result is null
      if (result === null) {
        throw new Error(`Failed to set key: ${key}`);
      }
  
      return result;
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a value from Redis
   * @param key - The key to retrieve
   * @returns The value of the key or null if not found
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Get all keys by pattern (useful for wildcards)
   * @param pattern - Pattern for key search
   * @returns Array of keys matching the pattern
   */
  async getAllKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redisClient.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys by pattern ${pattern}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a key from Redis
   * @param key - The key to delete
   */
  async del(key: string) {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Check if a key exists in Redis
   * @param key - The key to check
   * @returns 1 if exists, 0 if not
   */
  async exists(key: string): Promise<number> {
    try {
      return await this.redisClient.exists(key);
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Get the Redis client instance
   * This is useful if you want to access more advanced Redis commands directly
   */
  getClient(): RedisClientType {
    return this.redisClient;
  }
}
