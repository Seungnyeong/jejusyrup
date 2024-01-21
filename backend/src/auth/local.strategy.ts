import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    const user = await this.usersService.validate({
      email,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return done(null, user.data);
  }
}
