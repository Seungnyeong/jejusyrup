import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './apis/users/users.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/apis/users/entities/user.entity';
import { MediaModule } from './apis/media/media.module';
import { Media } from 'src/apis/media/entities/media.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { RedisModule } from './redis/redis.module';
import { BlogModule } from './apis/blog/blog.module';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { KakaoModule } from 'src/lib/kakao/kakao.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: process.env.NODE_ENV !== 'production',
          logging:
            process.env.NODE_ENV !== 'production' &&
            process.env.NODE_ENV !== 'test',
          entities: [User, Blog, Media],
          legacySpatialSupport: false,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid Options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    UsersModule,
    CommonModule,
    AuthModule,
    MailModule,
    MediaModule,
    RedisModule,
    BlogModule,
    KakaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/users/login',
          method: RequestMethod.POST,
        },
        {
          path: '/users',
          method: RequestMethod.POST,
        },
        {
          path: '/kakao/oauth',
          method: RequestMethod.ALL,
        },
        {
          path: '/kakao/login',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
