import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export function setUpSession(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);
  const port = Number(configService.get('REDIS_PORT'));
  const host = configService.get('REDIS_HOST');
  const client = new Redis({
    host,
    port,
  });

  const redisClient = createClient({
    url: `redis://${host}:${port}`,
  });

  const redisStore = new RedisStore(session);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      store: redisStore,
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 30000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
