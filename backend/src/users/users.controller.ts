import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Session,
  Res,
  Req,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Response } from 'express';
import { User } from 'src/decorators/user.decorator';
import { RedisService } from 'src/redis/redis.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/profile')
  profile(@User() user) {
    return this.usersService.findById(user.id);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  userLogin(
    @Req() loginUserDto: LoginUserDto,
    @Session() session,
    @Res({ passthrough: true }) response: Response,
  ) {
    response
      .cookie('session_id', session.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .send({ status: 'ok' });
  }

  @Delete('/logout')
  userLogout(@Req() request, @Res() response: Response) {
    try {
      if (!this.redisService.deleteSessionKey(request.cookies.session_id)) {
        throw new Error();
      }
      response.setHeader(
        'Set-Cookie',
        `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      );
      return response.status(200).send({
        status: 'ok',
      });
    } catch (e) {
      console.error(e);
    }
  }
}
