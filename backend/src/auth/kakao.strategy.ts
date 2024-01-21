import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserProvider } from 'src/apis/users/entities/user.entity';
import { UsersService } from 'src/apis/users/users.service';
import { KakaoUserResponse } from 'src/lib/kakao/kakao.response';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: config.get('KAKAO_APP_KEY'),
      callbackURL: config.get('KAKAO_REDIRECT_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const kakaoUser: KakaoUserResponse = {
        email: _json.kakao_account.email,
        nickname: _json.properties.nickname,
      };
      const isExist = await this.usersService.findOne(kakaoUser.email);
      if (!isExist) {
        const newUser = await this.usersService.create(
          {
            email: kakaoUser.email,
            nick_name: kakaoUser.nickname,
            country: {
              code: 'kr',
              name: 'KOR',
            },
            password: null,
          },
          UserProvider.Kakao,
        );
        done(null, newUser.data);
      }
      done(null, isExist);
    } catch (error) {
      done(error);
    }
  }
}
