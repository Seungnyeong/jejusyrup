import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from 'src/redis/redis.repository';

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async getSessionKey(session_id: string): Promise<string | null> {
    return await this.redisRepository.get('sess', session_id);
  }

  async deleteSessionKey(session_id: string): Promise<boolean> {
    const session = await this.redisRepository.delete('sess', session_id);
    return session === 0 ? false : true;
  }
}
