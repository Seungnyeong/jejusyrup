import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly redisService: RedisService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);

    if (can) {
      const request = context.switchToHttp().getRequest();
      const sessionId = request.cookies.session_id;
      const result = await this.redisService.getSessionKey(sessionId);
      if (result) {
        return false;
      }
      await super.logIn(request);
    }

    return true;
  }
}
