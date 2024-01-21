import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request, Response, response } from 'express';
import { KakaoAuthGuard } from 'src/auth/kakao-auth.guard';
import { KakaoService } from 'src/lib/kakao/kakao.service';

@Controller('kakao')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @Get('/login')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/oauth')
  @UseGuards(KakaoAuthGuard)
  oAuth(
    @Res({ passthrough: true }) response: Response,
    @Session() session,
  ): void {
    return response
      .cookie('session_id', session.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .redirect('/api-doc');
  }
}
