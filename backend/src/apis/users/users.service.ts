import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserProvider } from 'src/apis/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'src/common/dtos/response.dto';
import {
  PasswordUnValidateException,
  UserAlreadyExistException,
  UserNotExistException,
} from 'src/common/exceptions/common.exception';
import { LoginUserDto } from 'src/apis/users/dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    provider: UserProvider,
  ): Promise<Response> {
    try {
      const exist = await this.users.findOne({
        where: { email: createUserDto.email },
      });
      if (exist) {
        throw new UserAlreadyExistException();
      }
      await this.users.save(
        this.users.create({
          ...createUserDto,
          provider: provider,
        }),
      );
      return {
        success: true,
        message: '회원 가입을 축하합니다!',
      };
    } catch (e) {
      if (e instanceof UserNotExistException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async validate(loginUserDto: LoginUserDto): Promise<Response> {
    try {
      const user = await this.users
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email: loginUserDto.email })
        .getOneOrFail();

      if (!user) {
        throw new UserNotExistException();
      }
      const isCorrect = await user.checkPassword(loginUserDto.password);
      if (isCorrect) {
        return {
          success: true,
          data: user,
        };
      }
      throw new PasswordUnValidateException();
    } catch (e) {
      console.log(e);
      if (e instanceof UserNotExistException) {
        throw e;
      } else if (e instanceof PasswordUnValidateException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string): Promise<User> {
    return await this.users.findOne({
      where: {
        email: email,
      },
    });
  }

  findById(id: number): Promise<User | undefined> {
    return this.users.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
