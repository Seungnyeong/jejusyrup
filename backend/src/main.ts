import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { setUpSession } from 'src/common/session/init.session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());
  setUpSession(app);
  // app.use(csurf());
  await app.listen(3001);
}
bootstrap();
