import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LocalSerializer } from 'src/auth/local.serializer';
import { LocalStrategy } from 'src/auth/local.strategy';
import { RolesGuard } from 'src/auth/role.guard';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

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
  ],
})
export class AuthModule {}
