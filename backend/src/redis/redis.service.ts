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
}
