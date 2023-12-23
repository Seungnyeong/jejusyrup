import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonErrorCode } from 'src/common/exceptions/error.code';

export class BasicException extends HttpException {
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message, status);
    this.code = code;
  }
}

export class UserNotExistException extends BasicException {
  constructor() {
    super(
      '존재하지 않는 사용자입니다.',
      HttpStatus.NOT_FOUND,
      CommonErrorCode.NOT_FOUND,
    );
  }
}

export class UserAlreadyExistException extends BasicException {
  constructor() {
    super(
      '이미 존재하는 사용자 이메일 입니다.',
      HttpStatus.BAD_REQUEST,
      CommonErrorCode.IS_EXIST,
    );
  }
}

export class PasswordUnValidateException extends BasicException {
  constructor() {
    super(
      '비밀번호가 틀렸습니다.',
      HttpStatus.BAD_REQUEST,
      CommonErrorCode.UN_VALIDATE,
    );
  }
}
