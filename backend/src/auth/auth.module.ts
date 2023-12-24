import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalSerializer } from 'src/auth/local.serializer';
import { LocalStrategy } from 'src/auth/local.strategy';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [LocalStrategy, LocalSerializer, UsersService],
})
export class AuthModule {}
