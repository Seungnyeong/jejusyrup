import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}
  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<number> {
    return await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpriry(
    prefix: string,
    key: string,
    value: string,
    expriry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expriry);
  }
}
