import { Module } from '@nestjs/common';
import { KakaoController } from 'src/lib/kakao/kakao.controller';
import { KakaoService } from 'src/lib/kakao/kakao.service';

@Module({
  controllers: [KakaoController],
  providers: [KakaoService],
})
export class KakaoModule {}
