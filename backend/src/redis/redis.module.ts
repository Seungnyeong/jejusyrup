import { Global, Module } from '@nestjs/common';
import { RedisClientProvider } from 'src/redis/redis.factory';
import { RedisRepository } from 'src/redis/redis.repository';
import { RedisService } from 'src/redis/redis.service';

@Global()
@Module({
  imports: [],
  providers: [RedisService, ...RedisClientProvider, RedisRepository],
  exports: [RedisService],
})
export class RedisModule {}
