import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoService {
  KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  async getKakaoToken(code: string): Promise<void> {
    console.log(code);
  }
}
