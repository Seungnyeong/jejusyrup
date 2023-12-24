import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly redisSerivce: RedisService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const sessionKey = await this.redisSerivce.getSessionKey(
      req.cookies.session_id,
    );
    if (sessionKey) {
      const {
        passport: { user },
      } = JSON.parse(sessionKey);
      req['user'] = Number(user);
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
