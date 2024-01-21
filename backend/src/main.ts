import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { setUpSession } from 'src/common/session/init.session';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { setUpSwagger } from 'src/common/apidoc/swagger.init';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api', {
    exclude: [],
  });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());
  setUpSession(app);
  setUpSwagger(app);
  // app.use(csurf());
  await app.listen(3001);
}
bootstrap();
