import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalSerializer } from 'src/auth/local.serializer';
import { LocalStrategy } from 'src/auth/local.strategy';
import { RolesGuard } from 'src/auth/role.guard';
import { User } from 'src/apis/users/entities/user.entity';
import { UsersService } from 'src/apis/users/users.service';
import { KakaoStrategy } from 'src/auth/kakao.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    LocalStrategy,
    LocalSerializer,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    KakaoStrategy,
  ],
})
export class AuthModule {}
